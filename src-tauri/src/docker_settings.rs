use std::{
    fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    time::{Duration, Instant},
};
use tauri::Manager;

#[derive(serde::Serialize)]
pub struct RuntimeOption {
    id: &'static str,
    label: &'static str,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DockerSettings {
    selected: String,
    options: Vec<RuntimeOption>,
    development: bool,
}

fn options() -> Vec<RuntimeOption> {
    let mut options = vec![RuntimeOption {
        id: "auto",
        label: "Automatic",
    }];
    options.push(RuntimeOption {
        id: "desktop",
        label: "Docker Desktop",
    });
    if cfg!(target_os = "macos") {
        options.push(RuntimeOption {
            id: "orbstack",
            label: "OrbStack",
        });
        options.push(RuntimeOption {
            id: "colima",
            label: "Colima (default profile)",
        });
    }
    if cfg!(target_os = "linux") {
        options.push(RuntimeOption {
            id: "engine",
            label: "Docker Engine",
        });
        options.push(RuntimeOption {
            id: "rootless",
            label: "Docker Engine (rootless)",
        });
    }
    options
}

fn settings_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|path| path.join("docker-runtime"))
        .map_err(|error| error.to_string())
}

fn read_selection(app: &tauri::AppHandle) -> Result<String, String> {
    match fs::read_to_string(settings_path(app)?) {
        Ok(value) if options().iter().any(|option| option.id == value.trim()) => {
            Ok(value.trim().into())
        }
        Ok(_) => Err("Unrecognized saved Docker runtime.".into()),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok("auto".into()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub fn docker_settings(app: tauri::AppHandle) -> Result<DockerSettings, String> {
    Ok(DockerSettings {
        selected: read_selection(&app)?,
        options: options(),
        development: cfg!(debug_assertions),
    })
}

#[tauri::command]
pub fn save_docker_settings(app: tauri::AppHandle, selected: String) -> Result<(), String> {
    if !options().iter().any(|option| option.id == selected) {
        return Err("Unsupported Docker runtime for this operating system.".into());
    }
    // Resolve before saving so missing HOME/XDG_RUNTIME_DIR produces a useful error.
    runtime_host(&selected)?;
    let path = settings_path(&app)?;
    fs::create_dir_all(path.parent().ok_or("Missing settings directory")?)
        .map_err(|error| error.to_string())?;
    fs::write(path, selected).map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn test_docker_connection(
    app: tauri::AppHandle,
    selected: String,
) -> Result<String, String> {
    if !options().iter().any(|option| option.id == selected) {
        return Err("Unsupported Docker runtime for this operating system.".into());
    }
    tauri::async_runtime::spawn_blocking(move || {
        let host = runtime_host(&selected)?.or_else(crate::docker_host);
        #[cfg(debug_assertions)]
        let (node, directory) = (
            PathBuf::from("node"),
            PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .parent()
                .unwrap()
                .to_path_buf(),
        );
        #[cfg(not(debug_assertions))]
        let (node, directory) = (
            std::env::current_exe()
                .map_err(|error| error.to_string())?
                .parent()
                .ok_or("Application directory unavailable")?
                .join(format!("cojudge-node{}", std::env::consts::EXE_SUFFIX)),
            app.path()
                .resource_dir()
                .map_err(|error| error.to_string())?
                .join("backend"),
        );
        #[cfg(debug_assertions)]
        let _ = app;
        probe_docker(&node, &directory, host.as_deref())?;
        Ok(format!(
            "Connected to Docker ({})",
            host.as_deref().unwrap_or("default endpoint")
        ))
    })
    .await
    .map_err(|error| error.to_string())?
}

// Use the same Docker client and environment as the judge, including TLS settings.
// A separate short-lived process lets us bound even a stalled named-pipe connection.
fn probe_docker(node: &Path, directory: &Path, host: Option<&str>) -> Result<(), String> {
    let mut command = Command::new(node);
    command
        .current_dir(directory)
        .args([
            "--input-type=commonjs",
            "-e",
            r#"
const Docker = require('dockerode');
const timer = setTimeout(() => { console.error('Connection timed out.'); process.exit(1); }, 5000);
new Docker({ timeout: 5000 }).ping().then((reply) => {
    if (String(reply).trim() !== 'OK') throw new Error('Unexpected Docker API response.');
    clearTimeout(timer);
    process.exit(0);
}).catch((error) => { console.error(error.message); process.exit(1); });
"#,
        ])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::piped());
    if let Some(host) = host {
        command.env("DOCKER_HOST", host);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }
    let mut child = command
        .spawn()
        .map_err(|error| format!("Could not start connection test: {error}"))?;
    let deadline = Instant::now() + Duration::from_secs(8);
    loop {
        match child.try_wait() {
            Ok(Some(_)) => break,
            Ok(None) if Instant::now() < deadline => std::thread::sleep(Duration::from_millis(50)),
            result => {
                let _ = child.kill();
                let _ = child.wait();
                return Err(match result {
                    Err(error) => error.to_string(),
                    _ => "Connection timed out. Check that the selected runtime is running.".into(),
                });
            }
        }
    }
    let output = child
        .wait_with_output()
        .map_err(|error| error.to_string())?;
    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Could not connect to Docker. {}",
            String::from_utf8_lossy(&output.stderr).trim()
        ))
    }
}

fn runtime_host(selected: &str) -> Result<Option<String>, String> {
    let home_socket = |suffix: &str| -> Result<Option<String>, String> {
        let home = std::env::var_os("HOME").ok_or("HOME is unavailable")?;
        Ok(Some(format!(
            "unix://{}",
            PathBuf::from(home).join(suffix).display()
        )))
    };
    match selected {
        "auto" => Ok(None),
        "desktop" if cfg!(windows) => Ok(Some("npipe:////./pipe/docker_engine".into())),
        "desktop" if cfg!(target_os = "linux") => home_socket(".docker/desktop/docker.sock"),
        "desktop" => home_socket(".docker/run/docker.sock"),
        "orbstack" => home_socket(".orbstack/run/docker.sock"),
        "colima" => home_socket(".colima/default/docker.sock"),
        "engine" => Ok(Some("unix:///var/run/docker.sock".into())),
        "rootless" => {
            let dir = std::env::var_os("XDG_RUNTIME_DIR")
                .ok_or("XDG_RUNTIME_DIR is unavailable for rootless Docker")?;
            Ok(Some(format!(
                "unix://{}",
                PathBuf::from(dir).join("docker.sock").display()
            )))
        }
        _ => Err("Unsupported Docker runtime".into()),
    }
}

#[cfg(not(debug_assertions))]
pub fn selected_host(app: &tauri::AppHandle) -> Result<Option<String>, String> {
    runtime_host(&read_selection(app)?)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn connection_test_checks_the_docker_api_response() {
        for (body, expected_success) in [("OK", true), ("not Docker", false)] {
            let server = tiny_http::Server::http("127.0.0.1:0").unwrap();
            let host = format!("tcp://{}", server.server_addr());
            let responder = std::thread::spawn(move || {
                let request = server
                    .recv_timeout(Duration::from_secs(10))
                    .unwrap()
                    .expect("Docker ping request");
                assert_eq!(request.url(), "/_ping");
                request
                    .respond(tiny_http::Response::from_string(body))
                    .unwrap();
            });
            let directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
            let result = probe_docker(Path::new("node"), directory.parent().unwrap(), Some(&host));
            responder.join().unwrap();
            assert_eq!(result.is_ok(), expected_success, "{result:?}");
        }
    }

    #[test]
    fn connection_test_reports_an_unreachable_endpoint() {
        let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
        let host = format!("tcp://{}", listener.local_addr().unwrap());
        drop(listener);
        let directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        assert!(probe_docker(Path::new("node"), directory.parent().unwrap(), Some(&host)).is_err());
    }

    #[test]
    fn automatic_preserves_detection_and_unknown_runtime_is_rejected() {
        assert_eq!(runtime_host("auto").unwrap(), None);
        assert!(runtime_host("unknown").is_err());
    }

    #[test]
    fn choices_match_the_host_os() {
        let ids: Vec<_> = options().iter().map(|option| option.id).collect();
        assert!(ids.contains(&"auto") && ids.contains(&"desktop"));
        assert_eq!(ids.contains(&"orbstack"), cfg!(target_os = "macos"));
        assert_eq!(ids.contains(&"colima"), cfg!(target_os = "macos"));
        assert_eq!(ids.contains(&"engine"), cfg!(target_os = "linux"));
        assert_eq!(ids.contains(&"rootless"), cfg!(target_os = "linux"));
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn explicit_mac_runtimes_resolve_to_distinct_sockets_without_probing() {
        let home = PathBuf::from(std::env::var_os("HOME").unwrap());
        for (id, suffix) in [
            ("desktop", ".docker/run/docker.sock"),
            ("orbstack", ".orbstack/run/docker.sock"),
            ("colima", ".colima/default/docker.sock"),
        ] {
            assert_eq!(
                runtime_host(id).unwrap(),
                Some(format!("unix://{}", home.join(suffix).display()))
            );
        }
    }
}
