#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    io::Write as _,
    process::Child,
    sync::{
        atomic::{AtomicBool, AtomicU32, Ordering},
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

use oauth2::{
    basic::BasicClient, reqwest, url::Url, AuthType, AuthUrl, AuthorizationCode, ClientId,
    ClientSecret, CsrfToken, PkceCodeChallenge, RedirectUrl, RequestTokenError, Scope,
    TokenResponse, TokenUrl,
};
use tauri::{
    menu::{Menu, MenuItemBuilder, MenuItemKind, PredefinedMenuItem, Submenu},
    Manager, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_opener::OpenerExt;
use tiny_http::{
    Header as HttpHeader, Method as HttpMethod, Request as HttpRequest, Response as HttpResponse,
    Server as HttpServer, StatusCode as HttpStatusCode,
};

#[cfg(not(debug_assertions))]
const BACKEND_HOST: &str = "cojudge.localhost";
#[cfg(not(debug_assertions))]
const BACKEND_PORT: u16 = 5376;

const NEW_WINDOW_MENU_ID: &str = "new-window";
const WINDOW_LABEL_PREFIX: &str = "main";
const GOOGLE_AUTH_URL: &str = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_CALLBACK_PATH: &str = "/";
const GOOGLE_OAUTH_TIMEOUT: Duration = Duration::from_secs(300);
const GOOGLE_TOKEN_TIMEOUT: Duration = Duration::from_secs(30);
const BUNDLED_GOOGLE_DESKTOP_CLIENT_ID: Option<&str> = option_env!("GOOGLE_DESKTOP_CLIENT_ID");
const BUNDLED_GOOGLE_DESKTOP_CLIENT_SECRET: Option<&str> =
    option_env!("GOOGLE_DESKTOP_CLIENT_SECRET");
static WINDOW_COUNTER: AtomicU32 = AtomicU32::new(0);

#[derive(Default)]
struct Backend {
    child: Mutex<Option<Child>>,
    window_url: Mutex<Option<tauri::Url>>,
    #[cfg(not(debug_assertions))]
    startup_resolved: AtomicBool,
    #[cfg(not(debug_assertions))]
    startup_failed: AtomicBool,
    oauth_in_progress: AtomicBool,
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
    let label = format!(
        "{WINDOW_LABEL_PREFIX}-{}",
        WINDOW_COUNTER.fetch_add(1, Ordering::Relaxed)
    );

    WebviewWindowBuilder::new(app, label, WebviewUrl::External(url))
        .title("Cojudge")
        .inner_size(1400.0, 900.0)
        .min_inner_size(300.0, 300.0)
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

fn build_menu(app: &tauri::AppHandle) -> tauri::Result<()> {
    let menu = Menu::default(app)?;
    let new_window = MenuItemBuilder::with_id(NEW_WINDOW_MENU_ID, "New Window")
        .accelerator("CmdOrCtrl+N")
        .build(app)?;

    let mut file_submenu = None;
    for item in menu.items()? {
        if let MenuItemKind::Submenu(submenu) = item {
            if submenu.text()? == "File" {
                file_submenu = Some(submenu);
                break;
            }
        }
    }

    if let Some(file) = file_submenu {
        file.insert(&new_window, 0)?;
        #[cfg(not(target_os = "macos"))]
        file.insert(&PredefinedMenuItem::separator(app)?, 1)?;
    } else {
        // Platforms whose default menu has no File submenu (e.g. Linux)
        let file = Submenu::with_items(
            app,
            "File",
            true,
            &[
                &new_window,
                &PredefinedMenuItem::separator(app)?,
                &PredefinedMenuItem::quit(app, None)?,
            ],
        )?;
        menu.prepend(&file)?;
    }

    app.set_menu(menu)?;
    Ok(())
}

fn open_new_window(app: &tauri::AppHandle) -> Result<(), String> {
    let url = app
        .state::<Backend>()
        .window_url
        .lock()
        .unwrap()
        .clone()
        .ok_or_else(|| "the application is still starting up".to_string())?;
    create_window(app, url).map_err(|error| error.to_string())
}

#[tauri::command]
fn new_window(app: tauri::AppHandle) -> Result<(), String> {
    open_new_window(&app)
}

struct GoogleOauthGuard<'a>(&'a AtomicBool);

impl Drop for GoogleOauthGuard<'_> {
    fn drop(&mut self) {
        self.0.store(false, Ordering::Release);
    }
}

fn google_oauth_header(name: &[u8], value: &[u8]) -> HttpHeader {
    HttpHeader::from_bytes(name, value).expect("static OAuth callback header must be valid")
}

fn respond_to_google_oauth(request: HttpRequest, status: u16, body: &str) {
    let response = HttpResponse::from_string(google_oauth_page(status, body))
        .with_status_code(HttpStatusCode(status))
        .with_header(google_oauth_header(
            b"Content-Type",
            b"text/html; charset=utf-8",
        ))
        .with_header(google_oauth_header(
            b"Cache-Control",
            b"no-store, max-age=0",
        ))
        .with_header(google_oauth_header(b"Pragma", b"no-cache"))
        .with_header(google_oauth_header(b"Referrer-Policy", b"no-referrer"))
        .with_header(google_oauth_header(b"X-Content-Type-Options", b"nosniff"))
        .with_header(google_oauth_header(
            b"Content-Security-Policy",
            b"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
        ));

    let _ = request.respond(response);
}

fn google_oauth_page(status: u16, message: &str) -> String {
    let escaped_message = message
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;");
    let bg = if status == 200 { "#f0f7ef" } else { "#fdf1ef" };
    format!(
        r#"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in &middot; Cojudge</title>
</head>
<body>
<main>
  <p class="badge">Cojudge</p>
  <h1>One moment&hellip;</h1>
  <p class="message">{escaped_message}</p>
  <p id="hint" class="hint" hidden>Your browser blocked auto-closing this window. You can close it manually now.</p>
</main>
<script>
  function tryClose() {{
    try {{ window.close(); }} catch (_) {{}}
  }}
  tryClose();
  setTimeout(function () {{
    tryClose();
    document.getElementById("hint").classList.add("show");
  }}, 800);
</script>
<style>
  :root {{ color-scheme: light dark; }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: {bg};
    color: #1d1d1f;
  }}
  main {{
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.10);
  }}
  .badge {{
    display: inline-block;
    margin: 0 0 12px;
    padding: 4px 12px;
    border-radius: 999px;
    background: #e8f3fb;
    color: #0b5c8a;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }}
  h1 {{ margin: 0 0 8px; font-size: 22px; }}
  .message {{ margin: 0; font-size: 15px; line-height: 1.5; }}
  .hint {{
    visibility: hidden;
    margin: 16px 0 0;
    font-size: 13px;
    color: #6b6b70;
  }}
  .hint.show {{ visibility: visible; }}
  @media (prefers-color-scheme: dark) {{
    main {{ background: #1f1f23; }}
    .message {{ color: #e8e8ed; }}
    .badge {{ background: #16324a; color: #7cc4ea; }}
  }}
</style>
</body>
</html>"#
    )
}

fn google_oauth_callback_parameters(
    request: &HttpRequest,
    expected_host: &str,
) -> Option<Vec<(String, String)>> {
    if request.method() != &HttpMethod::Get
        || !request
            .remote_addr()
            .is_some_and(|address| address.ip().is_loopback())
        || request.url().len() > 4096
        || !request.url().starts_with('/')
    {
        return None;
    }

    let mut hosts = request
        .headers()
        .iter()
        .filter(|candidate| candidate.field.equiv("Host"));
    let host = hosts.next()?;
    if host.value.as_str() != expected_host || hosts.next().is_some() {
        return None;
    }

    let url = Url::parse(&format!("http://{expected_host}{}", request.url())).ok()?;
    if url.path() != GOOGLE_OAUTH_CALLBACK_PATH || url.fragment().is_some() {
        return None;
    }

    Some(
        url.query_pairs()
            .map(|(key, value)| (key.into_owned(), value.into_owned()))
            .collect(),
    )
}

fn unique_google_oauth_parameter(
    parameters: &[(String, String)],
    name: &str,
) -> Result<Option<String>, ()> {
    let mut values = parameters
        .iter()
        .filter(|(key, _)| key == name)
        .map(|(_, value)| value);

    let value = values.next().cloned();
    if values.next().is_some() {
        return Err(());
    }

    Ok(value)
}

fn google_oauth_client_secret(
    client_id: &str,
    supplied_client_secret: Option<String>,
) -> Result<String, String> {
    let supplied_client_secret = supplied_client_secret.unwrap_or_default();
    let bundled_client_secret = if BUNDLED_GOOGLE_DESKTOP_CLIENT_ID == Some(client_id) {
        BUNDLED_GOOGLE_DESKTOP_CLIENT_SECRET.unwrap_or_default()
    } else {
        ""
    };
    let client_secret = if supplied_client_secret.trim().is_empty() {
        bundled_client_secret.trim()
    } else {
        supplied_client_secret.trim()
    };

    if client_secret.is_empty()
        || client_secret.len() > 512
        || !client_secret.is_ascii()
        || client_secret.chars().any(char::is_whitespace)
    {
        return Err(
            "The Google desktop OAuth client secret is not configured or invalid.".to_string(),
        );
    }

    Ok(client_secret.to_string())
}

fn run_google_oauth(
    app: &tauri::AppHandle,
    client_id: String,
    supplied_client_secret: Option<String>,
) -> Result<String, String> {
    let client_id = client_id.trim();
    if client_id.is_empty()
        || client_id.len() > 512
        || !client_id.is_ascii()
        || !client_id.ends_with(".apps.googleusercontent.com")
    {
        return Err("The Google desktop client ID is invalid.".to_string());
    }
    let client_secret = google_oauth_client_secret(client_id, supplied_client_secret)?;

    let state = app.state::<Backend>();
    if state.shutting_down.load(Ordering::Acquire) {
        return Err("Google sign-in was interrupted.".to_string());
    }

    if state
        .oauth_in_progress
        .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
        .is_err()
    {
        return Err("Google sign-in is already in progress.".to_string());
    }
    let _flow_guard = GoogleOauthGuard(&state.oauth_in_progress);

    let server = HttpServer::http(("127.0.0.1", 0))
        .map_err(|_| "Could not start the local sign-in callback.".to_string())?;
    let port = server
        .server_addr()
        .to_ip()
        .ok_or_else(|| "The sign-in callback did not use TCP.".to_string())?
        .port();

    let expected_host = format!("127.0.0.1:{port}");
    let redirect_url = format!("http://{expected_host}");
    let client = BasicClient::new(ClientId::new(client_id.to_string()))
        .set_client_secret(ClientSecret::new(client_secret))
        .set_auth_uri(
            AuthUrl::new(GOOGLE_AUTH_URL.to_string())
                .expect("Google authorization URL must be valid"),
        )
        .set_token_uri(
            TokenUrl::new(GOOGLE_TOKEN_URL.to_string()).expect("Google token URL must be valid"),
        )
        .set_redirect_uri(
            RedirectUrl::new(redirect_url).expect("loopback redirect URL must be valid"),
        )
        .set_auth_type(AuthType::RequestBody);

    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();
    let (authorization_url, expected_state) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("openid".to_string()))
        .add_scope(Scope::new("email".to_string()))
        .add_scope(Scope::new("profile".to_string()))
        .add_extra_param("prompt", "select_account")
        .set_pkce_challenge(pkce_challenge)
        .url();

    let http_client = reqwest::blocking::ClientBuilder::new()
        .redirect(reqwest::redirect::Policy::none())
        .https_only(true)
        .timeout(GOOGLE_TOKEN_TIMEOUT)
        .build()
        .map_err(|_| "Could not initialize the Google sign-in client.".to_string())?;

    app.opener()
        .open_url(authorization_url.as_str(), None::<&str>)
        .map_err(|_| "Could not open the system browser for Google sign-in.".to_string())?;

    let deadline = Instant::now() + GOOGLE_OAUTH_TIMEOUT;
    let (code, callback_request) = loop {
        if state.shutting_down.load(Ordering::Acquire) {
            return Err("Google sign-in was interrupted.".to_string());
        }

        let now = Instant::now();
        if now >= deadline {
            return Err("Google sign-in timed out.".to_string());
        }

        let Some(request) = server
            .recv_timeout((deadline - now).min(Duration::from_secs(1)))
            .map_err(|_| "The local sign-in callback failed.".to_string())?
        else {
            continue;
        };

        let Some(parameters) = google_oauth_callback_parameters(&request, &expected_host) else {
            respond_to_google_oauth(request, 404, "Not found");
            continue;
        };

        let Ok(Some(returned_state)) = unique_google_oauth_parameter(&parameters, "state") else {
            respond_to_google_oauth(request, 400, "Invalid sign-in response");
            continue;
        };

        if CsrfToken::new(returned_state) != expected_state {
            respond_to_google_oauth(request, 400, "Invalid sign-in response");
            continue;
        }

        let (Ok(error), Ok(code)) = (
            unique_google_oauth_parameter(&parameters, "error"),
            unique_google_oauth_parameter(&parameters, "code"),
        ) else {
            respond_to_google_oauth(request, 400, "Invalid sign-in response");
            continue;
        };

        match (error, code) {
            (Some(error), None) if !error.is_empty() => {
                respond_to_google_oauth(
                    request,
                    200,
                    "Sign-in was not completed. You can return to Cojudge.",
                );
                return Err(if error == "access_denied" {
                    "Google sign-in was cancelled.".to_string()
                } else {
                    "Google sign-in failed.".to_string()
                });
            }
            (None, Some(code)) if !code.is_empty() => {
                break (AuthorizationCode::new(code), request);
            }
            _ => respond_to_google_oauth(request, 400, "Invalid sign-in response"),
        }
    };

    let token_result = client
        .exchange_code(code)
        .set_pkce_verifier(pkce_verifier)
        .request(&http_client);
    let token = match token_result {
        Ok(token) => {
            respond_to_google_oauth(
                callback_request,
                200,
                "Sign-in complete. You can return to Cojudge.",
            );
            token
        }
        Err(error) => {
            respond_to_google_oauth(
                callback_request,
                502,
                "Google sign-in could not be completed. Return to Cojudge for details.",
            );
            return Err(match error {
                RequestTokenError::ServerResponse(response) => {
                    format!("Google token exchange failed: {response}.")
                }
                RequestTokenError::Request(_) => {
                    "Google token exchange failed because Google's token service could not be reached."
                        .to_string()
                }
                RequestTokenError::Parse(_, _) => {
                    "Google's token service returned an unexpected response.".to_string()
                }
                RequestTokenError::Other(reason) => {
                    format!("Google token exchange failed: {reason}.")
                }
            });
        }
    };

    Ok(token.access_token().secret().to_owned())
}

#[tauri::command]
async fn google_oauth_access_token(
    app: tauri::AppHandle,
    client_id: String,
    client_secret: Option<String>,
) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || run_google_oauth(&app, client_id, client_secret))
        .await
        .map_err(|_| "Google sign-in stopped unexpectedly.".to_string())?
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
            *stdout_app.state::<Backend>().window_url.lock().unwrap() = Some(url.clone());
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
        .invoke_handler(tauri::generate_handler![
            new_window,
            google_oauth_access_token
        ])
        .on_menu_event(|app, event| {
            if event.id().0.as_str() == NEW_WINDOW_MENU_ID {
                if let Err(error) = open_new_window(app) {
                    eprintln!("failed to open a new window: {error}");
                }
            }
        })
        .setup(|app| {
            build_menu(app.handle())?;

            #[cfg(debug_assertions)]
            {
                let url = app
                    .config()
                    .build
                    .dev_url
                    .clone()
                    .ok_or("build.devUrl is required in development")?;
                *app.state::<Backend>().window_url.lock().unwrap() = Some(url.clone());
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
        } if label == "startup-error" => {
            shutdown_backend(app);
            app.exit(0);
        }
        tauri::RunEvent::WindowEvent {
            label,
            event: tauri::WindowEvent::CloseRequested { .. },
            ..
        } if label.starts_with(WINDOW_LABEL_PREFIX) => {
            // Shut down only when the last main window is closed
            let remaining = app
                .webview_windows()
                .keys()
                .filter(|key| key.starts_with(WINDOW_LABEL_PREFIX))
                .count();
            if remaining <= 1 {
                shutdown_backend(app);
                app.exit(0);
            }
        }
        tauri::RunEvent::ExitRequested { .. } | tauri::RunEvent::Exit => shutdown_backend(app),
        _ => {}
    });
}
