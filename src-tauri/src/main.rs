#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    io::Write as _,
    process::Child,
    sync::{
        atomic::{AtomicBool, Ordering},
        Mutex,
    },
    thread,
    time::{Duration, Instant},
};

#[cfg(not(debug_assertions))]
use std::{
    fmt::Write as _,
    io::{BufRead, BufReader},
    process::{Command, Stdio},
};

#[cfg(all(not(debug_assertions), unix))]
use std::{os::unix::net::UnixStream, path::PathBuf};

#[cfg(all(not(debug_assertions), windows))]
use std::os::windows::process::CommandExt;

use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_opener::OpenerExt;

#[cfg(not(debug_assertions))]
const BACKEND_HOST: &str = "cojudge.localhost";
#[cfg(not(debug_assertions))]
const BACKEND_PORT: u16 = 5376;

#[derive(Default)]
struct Backend {
    child: Mutex<Option<Child>>,
    #[cfg(not(debug_assertions))]
    startup_resolved: AtomicBool,
    #[cfg(not(debug_assertions))]
    startup_failed: AtomicBool,
    shutting_down: AtomicBool,
}

fn open_external(app: &tauri::AppHandle, url: &tauri::Url) {
    if matches!(url.scheme(), "http" | "https") {
        if let Err(error) = app.opener().open_url(url.as_str(), None::<&str>) {
            eprintln!("failed to open external URL: {error}");
        }
    }
}

fn create_window(app: &tauri::AppHandle, url: tauri::Url) -> tauri::Result<()> {
    let allowed_origin = url.origin().ascii_serialization();
    let navigation_app = app.clone();
    let new_window_app = app.clone();

    WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url))
        .title("Cojudge")
        .inner_size(1400.0, 900.0)
        .min_inner_size(900.0, 600.0)
        .center()
        .on_navigation(move |url| {
            if url.origin().ascii_serialization() == allowed_origin {
                true
            } else {
                open_external(&navigation_app, url);
                false
            }
        })
        .on_new_window(move |url, _| {
            open_external(&new_window_app, &url);
            tauri::webview::NewWindowResponse::Deny
        })
        .build()?;

    Ok(())
}

#[cfg(not(debug_assertions))]
fn show_startup_error(app: &tauri::AppHandle) {
    if app
        .state::<Backend>()
        .startup_failed
        .swap(true, Ordering::AcqRel)
    {
        return;
    }

    if let Err(error) =
        WebviewWindowBuilder::new(app, "startup-error", WebviewUrl::App("index.html".into()))
            .title("Cojudge could not start")
            .inner_size(560.0, 340.0)
            .resizable(false)
            .center()
            .build()
    {
        eprintln!("failed to show the startup error: {error}");
        app.exit(1);
    }
}

#[cfg(not(debug_assertions))]
fn random_token() -> std::io::Result<String> {
    let mut bytes = [0_u8; 32];
    getrandom::fill(&mut bytes).map_err(|error| std::io::Error::other(error.to_string()))?;

    let mut token = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        write!(token, "{byte:02x}").unwrap();
    }
    Ok(token)
}

#[cfg(all(not(debug_assertions), windows))]
fn docker_host() -> Option<String> {
    if let Ok(value) = std::env::var("DOCKER_HOST") {
        if !value.is_empty() {
            return Some(value);
        }
    }

    Some("npipe:////./pipe/docker_engine".to_string())
}

#[cfg(all(not(debug_assertions), unix))]
fn docker_host() -> Option<String> {
    if let Ok(value) = std::env::var("DOCKER_HOST") {
        if !value.is_empty() {
            return Some(value);
        }
    }

    let home = std::env::var_os("HOME").map(PathBuf::from);
    let mut candidates = Vec::new();
    if let Some(runtime_dir) = std::env::var_os("XDG_RUNTIME_DIR") {
        candidates.push(PathBuf::from(runtime_dir).join("docker.sock"));
    }
    #[cfg(target_os = "linux")]
    if let Some(path) = home
        .as_ref()
        .map(|path| path.join(".docker/desktop/docker.sock"))
    {
        candidates.push(path);
    }
    if let Some(path) = home
        .as_ref()
        .map(|path| path.join(".docker/run/docker.sock"))
    {
        candidates.push(path);
    }
    #[cfg(target_os = "macos")]
    if let Some(path) = home
        .as_ref()
        .map(|path| path.join(".orbstack/run/docker.sock"))
    {
        candidates.push(path);
    }
    #[cfg(target_os = "macos")]
    if let Some(path) = home
        .as_ref()
        .map(|path| path.join(".colima/default/docker.sock"))
    {
        candidates.push(path);
    }
    candidates.push(PathBuf::from("/var/run/docker.sock"));

    candidates
        .into_iter()
        .find(|path| UnixStream::connect(path).is_ok())
        .map(|path| format!("unix://{}", path.display()))
}

#[cfg(not(debug_assertions))]
fn start_backend(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let backend_dir = app.path().resource_dir()?.join("backend");
    let node = std::env::current_exe()?
        .parent()
        .ok_or("application executable has no parent directory")?
        .join(format!("cojudge-node{}", std::env::consts::EXE_SUFFIX));
    let token = random_token()?;
    let session_id = random_token()?;

    let mut command = Command::new(node);
    command
        .arg("desktop-server.mjs")
        .current_dir(backend_dir)
        .env("NODE_ENV", "production")
        .env("COJUDGE_DESKTOP_HOST", BACKEND_HOST)
        .env("COJUDGE_DESKTOP_PORT", BACKEND_PORT.to_string())
        .env("COJUDGE_DESKTOP_TOKEN", &token)
        .env("COJUDGE_SESSION_ID", session_id)
        .env_remove("HOST")
        .env_remove("PORT")
        .env_remove("ORIGIN")
        .env_remove("PROTOCOL_HEADER")
        .env_remove("HOST_HEADER")
        .env_remove("PORT_HEADER")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    if let Some(value) = docker_host() {
        command.env("DOCKER_HOST", value);
    }
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut child = command.spawn()?;

    let stdout = child.stdout.take().ok_or("failed to capture Node stdout")?;
    let stderr = child.stderr.take().ok_or("failed to capture Node stderr")?;
    *app.state::<Backend>().child.lock().unwrap() = Some(child);

    thread::spawn(move || {
        for line in BufReader::new(stderr).lines().map_while(Result::ok) {
            eprintln!("[backend] {line}");
        }
    });

    let stdout_app = app.clone();
    thread::spawn(move || {
        let mut ready = false;
        for line in BufReader::new(stdout).lines().map_while(Result::ok) {
            let Some(raw_port) = line.strip_prefix("COJUDGE_READY=") else {
                println!("[backend] {line}");
                continue;
            };
            if ready {
                continue;
            }

            let state = stdout_app.state::<Backend>();
            if state.shutting_down.load(Ordering::Acquire)
                || state.startup_resolved.swap(true, Ordering::AcqRel)
            {
                return;
            }

            if raw_port.parse::<u16>() != Ok(BACKEND_PORT) {
                eprintln!("backend returned an invalid readiness port");
                shutdown_backend(&stdout_app);
                show_startup_error(&stdout_app);
                return;
            }

            let url =
                format!("http://{BACKEND_HOST}:{BACKEND_PORT}/__cojudge_bootstrap?token={token}")
                    .parse::<tauri::Url>()
                    .expect("desktop URL must be valid");
            if let Err(error) = create_window(&stdout_app, url) {
                eprintln!("failed to create the main window: {error}");
                shutdown_backend(&stdout_app);
                show_startup_error(&stdout_app);
                return;
            }
            ready = true;
        }

        if !stdout_app
            .state::<Backend>()
            .shutting_down
            .load(Ordering::Acquire)
        {
            eprintln!("backend exited unexpectedly");
            if ready {
                stdout_app.exit(1);
            } else {
                shutdown_backend(&stdout_app);
                show_startup_error(&stdout_app);
            }
        }
    });

    let timeout_app = app.clone();
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(30));
        let state = timeout_app.state::<Backend>();
        if !state.shutting_down.load(Ordering::Acquire)
            && !state.startup_resolved.swap(true, Ordering::AcqRel)
        {
            eprintln!("backend did not become ready within 30 seconds");
            shutdown_backend(&timeout_app);
            show_startup_error(&timeout_app);
        }
    });

    Ok(())
}

fn shutdown_backend(app: &tauri::AppHandle) {
    let state = app.state::<Backend>();
    if state.shutting_down.swap(true, Ordering::AcqRel) {
        return;
    }

    let Some(mut child) = state.child.lock().unwrap().take() else {
        return;
    };

    if let Some(mut stdin) = child.stdin.take() {
        let _ = writeln!(stdin, "shutdown");
    }

    let deadline = Instant::now() + Duration::from_secs(12);
    while Instant::now() < deadline {
        match child.try_wait() {
            Ok(Some(_)) => return,
            Ok(None) => thread::sleep(Duration::from_millis(25)),
            Err(_) => break,
        }
    }

    let _ = child.kill();
    let _ = child.wait();
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Backend::default())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let url = app
                    .config()
                    .build
                    .dev_url
                    .clone()
                    .ok_or("build.devUrl is required in development")?;
                create_window(app.handle(), url)?;
            }

            #[cfg(not(debug_assertions))]
            if let Err(error) = start_backend(app.handle()) {
                eprintln!("failed to start the backend: {error}");
                show_startup_error(app.handle());
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("failed to build Cojudge");

    app.run(|app, event| match event {
        tauri::RunEvent::WindowEvent {
            label,
            event: tauri::WindowEvent::CloseRequested { .. },
            ..
        } if label == "main" || label == "startup-error" => {
            shutdown_backend(app);
            app.exit(0);
        }
        tauri::RunEvent::ExitRequested { .. } | tauri::RunEvent::Exit => shutdown_backend(app),
        _ => {}
    });
}
