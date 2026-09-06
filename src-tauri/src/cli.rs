use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

#[cfg(unix)]
const PATH_BLOCK_BEGIN: &str = "# >>> cojudge CLI >>>";
#[cfg(unix)]
const PATH_BLOCK_END: &str = "# <<< cojudge CLI <<<";
#[cfg(unix)]
const PATH_EXPORT: &str = r#"export PATH="$HOME/.local/bin:$PATH""#;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CliStatus {
    available: bool,
    installed: bool,
    path: Option<String>,
    alias_paths: Vec<String>,
    needs_new_terminal: bool,
    message: Option<String>,
}

fn node_binary() -> Result<PathBuf, String> {
    let exe = std::env::current_exe().map_err(|error| error.to_string())?;
    let dir = exe
        .parent()
        .ok_or_else(|| "application executable has no parent directory".to_string())?;
    Ok(dir.join(format!("cojudge-node{}", std::env::consts::EXE_SUFFIX)))
}

fn backend_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .resource_dir()
        .map(|dir| dir.join("backend"))
        .map_err(|error| error.to_string())
}

fn cli_script(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(backend_dir(app)?.join("bin").join("cojudge"))
}

fn install_dir() -> Result<PathBuf, String> {
    #[cfg(windows)]
    {
        let local = std::env::var("LOCALAPPDATA")
            .map_err(|_| "LOCALAPPDATA is not set".to_string())?;
        Ok(PathBuf::from(local).join("Cojudge").join("cli"))
    }
    #[cfg(not(windows))]
    {
        let home = std::env::var("HOME").map_err(|_| "HOME is not set".to_string())?;
        Ok(PathBuf::from(home).join(".local").join("bin"))
    }
}

fn wrapper_path() -> Result<PathBuf, String> {
    #[cfg(windows)]
    {
        Ok(install_dir()?.join("cojudge.cmd"))
    }
    #[cfg(not(windows))]
    {
        Ok(install_dir()?.join("cojudge"))
    }
}

fn resolve_existing(path: &Path) -> PathBuf {
    path.canonicalize().unwrap_or_else(|_| path.to_path_buf())
}

fn sh_quote(value: &str) -> String {
    format!("'{}'", value.replace('\'', "'\\''"))
}

fn wrapper_belongs_to_this_app(contents: &str, node: &Path, backend: &Path) -> bool {
    let node = node.to_string_lossy();
    let backend = backend.to_string_lossy();
    contents.contains(node.as_ref()) && contents.contains(backend.as_ref())
}

fn unavailable(message: &str) -> CliStatus {
    CliStatus {
        available: false,
        installed: false,
        path: wrapper_path().ok().map(|path| path.display().to_string()),
        alias_paths: find_shell_aliases().unwrap_or_default(),
        needs_new_terminal: false,
        message: Some(message.to_string()),
    }
}

fn current_status(app: &AppHandle) -> Result<CliStatus, String> {
    let node = node_binary()?;
    let backend = backend_dir(app)?;
    let script = cli_script(app)?;
    if !node.is_file() || !script.is_file() {
        return Ok(unavailable(
            "CLI install is available in the packaged Cojudge app.",
        ));
    }

    let node = resolve_existing(&node);
    let backend = resolve_existing(&backend);
    let wrapper = wrapper_path()?;
    let installed = wrapper.is_file()
        && fs::read_to_string(&wrapper)
            .map(|contents| wrapper_belongs_to_this_app(&contents, &node, &backend))
            .unwrap_or(false);

    Ok(CliStatus {
        available: true,
        installed,
        path: Some(wrapper.display().to_string()),
        alias_paths: find_shell_aliases()?,
        needs_new_terminal: installed && !install_dir_on_path()?,
        message: None,
    })
}

fn install_dir_on_path() -> Result<bool, String> {
    let dir = install_dir()?;
    let path = std::env::var_os("PATH").unwrap_or_default();
    Ok(std::env::split_paths(&path).any(|entry| entry == dir))
}

fn home_dir() -> Result<PathBuf, String> {
    let var = if cfg!(windows) { "USERPROFILE" } else { "HOME" };
    std::env::var(var)
        .map(PathBuf::from)
        .map_err(|_| format!("{var} is not set"))
}

fn shell_config_files() -> Result<Vec<PathBuf>, String> {
    let home = home_dir()?;
    let mut files = Vec::new();
    if cfg!(windows) {
        for relative in [
            ["Documents", "WindowsPowerShell", "Microsoft.PowerShell_profile.ps1"].as_slice(),
            ["Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1"].as_slice(),
            ["OneDrive", "Documents", "WindowsPowerShell", "Microsoft.PowerShell_profile.ps1"].as_slice(),
            ["OneDrive", "Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1"].as_slice(),
        ] {
            let mut path = home.clone();
            for part in relative {
                path.push(part);
            }
            files.push(path);
        }
    } else {
        for name in [".zshrc", ".zprofile", ".bash_profile", ".bashrc", ".profile"] {
            files.push(home.join(name));
        }
    }
    files.retain(|path| path.is_file());
    files.sort();
    files.dedup();
    Ok(files)
}

fn line_is_cojudge_alias(line: &str) -> bool {
    let trimmed = line.trim_start();
    trimmed.starts_with("alias cojudge=") || trimmed.starts_with("function cojudge")
}

fn line_is_cojudge_cli_comment(line: &str) -> bool {
    matches!(line.trim(), "# CoJudge CLI" | "# Cojudge CLI")
}

fn has_shell_alias(contents: &str) -> bool {
    contents.lines().any(line_is_cojudge_alias)
}

fn skip_powershell_function(lines: &[&str], start: usize) -> usize {
    let mut depth: usize = 0;
    let mut seen_brace = false;
    let mut index = start;
    while index < lines.len() {
        for ch in lines[index].chars() {
            if ch == '{' {
                depth += 1;
                seen_brace = true;
            } else if ch == '}' {
                depth = depth.saturating_sub(1);
            }
        }
        index += 1;
        if seen_brace && depth == 0 {
            break;
        }
        if !seen_brace && index > start + 2 {
            break;
        }
    }
    index
}

fn strip_shell_alias(contents: &str) -> String {
    let lines: Vec<&str> = contents.lines().collect();
    let mut result = String::new();
    let mut index = 0;
    while index < lines.len() {
        let line = lines[index];
        if line_is_cojudge_cli_comment(line) {
            let next_is_alias = lines.get(index + 1).is_some_and(|next| line_is_cojudge_alias(next));
            let alias_after_blank = lines.get(index + 1).is_some_and(|next| next.trim().is_empty())
                && lines.get(index + 2).is_some_and(|next| line_is_cojudge_alias(next));
            if next_is_alias || alias_after_blank {
                index += 1;
                continue;
            }
        }
        if line_is_cojudge_alias(line) {
            if line.trim_start().starts_with("function cojudge") {
                index = skip_powershell_function(&lines, index);
            } else {
                index += 1;
            }
            if lines.get(index).is_some_and(|next| next.trim().is_empty()) {
                index += 1;
            }
            continue;
        }
        result.push_str(line);
        result.push('\n');
        index += 1;
    }
    result
}

fn find_shell_aliases() -> Result<Vec<String>, String> {
    let mut paths = Vec::new();
    for path in shell_config_files()? {
        let contents = fs::read_to_string(&path)
            .map_err(|error| format!("Could not read {}: {error}", path.display()))?;
        if has_shell_alias(&contents) {
            paths.push(path.display().to_string());
        }
    }
    Ok(paths)
}

fn remove_shell_aliases() -> Result<Vec<String>, String> {
    let mut removed = Vec::new();
    for path in shell_config_files()? {
        let contents = fs::read_to_string(&path)
            .map_err(|error| format!("Could not read {}: {error}", path.display()))?;
        if !has_shell_alias(&contents) {
            continue;
        }
        fs::write(&path, strip_shell_alias(&contents))
            .map_err(|error| format!("Could not update {}: {error}", path.display()))?;
        removed.push(path.display().to_string());
    }
    Ok(removed)
}

#[cfg(unix)]
fn unix_path_targets() -> Result<Vec<PathBuf>, String> {
    let home = PathBuf::from(std::env::var("HOME").map_err(|_| "HOME is not set".to_string())?);
    let mut targets = Vec::new();
    #[cfg(target_os = "macos")]
    {
        targets.push(home.join(".zprofile"));
    }
    for name in [".zprofile", ".zshrc", ".bash_profile", ".bashrc", ".profile"] {
        let path = home.join(name);
        if path.exists() && !targets.iter().any(|existing| existing == &path) {
            targets.push(path);
        }
    }
    if targets.is_empty() {
        targets.push(home.join(".profile"));
    }
    Ok(targets)
}

#[cfg(unix)]
fn file_has_local_bin_path(contents: &str) -> bool {
    contents.contains(PATH_BLOCK_BEGIN)
        || contents.contains("$HOME/.local/bin")
        || contents.contains("~/.local/bin")
}

#[cfg(unix)]
fn ensure_unix_path() -> Result<bool, String> {
    let mut changed = false;
    for path in unix_path_targets()? {
        let mut contents = if path.exists() {
            fs::read_to_string(&path)
                .map_err(|error| format!("Could not read {}: {error}", path.display()))?
        } else {
            String::new()
        };
        if file_has_local_bin_path(&contents) {
            continue;
        }
        if !contents.is_empty() && !contents.ends_with('\n') {
            contents.push('\n');
        }
        if !contents.is_empty() {
            contents.push('\n');
        }
        contents.push_str(PATH_BLOCK_BEGIN);
        contents.push('\n');
        contents.push_str(PATH_EXPORT);
        contents.push('\n');
        contents.push_str(PATH_BLOCK_END);
        contents.push('\n');
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("Could not update {}: {error}", path.display()))?;
        }
        fs::write(&path, contents)
            .map_err(|error| format!("Could not update {}: {error}", path.display()))?;
        changed = true;
    }
    Ok(changed)
}

#[cfg(unix)]
fn strip_path_block(contents: &str) -> String {
    let mut result = String::new();
    let mut skipping = false;
    for line in contents.lines() {
        let trimmed = line.trim();
        if trimmed == PATH_BLOCK_BEGIN {
            skipping = true;
            continue;
        }
        if skipping {
            if trimmed == PATH_BLOCK_END {
                skipping = false;
            }
            continue;
        }
        result.push_str(line);
        result.push('\n');
    }
    result
}

#[cfg(unix)]
fn remove_unix_path() -> Result<(), String> {
    for path in unix_path_targets()? {
        if !path.exists() {
            continue;
        }
        let contents = fs::read_to_string(&path)
            .map_err(|error| format!("Could not read {}: {error}", path.display()))?;
        if !contents.contains(PATH_BLOCK_BEGIN) {
            continue;
        }
        fs::write(&path, strip_path_block(&contents))
            .map_err(|error| format!("Could not update {}: {error}", path.display()))?;
    }
    Ok(())
}

#[cfg(windows)]
fn windows_user_path() -> Result<String, String> {
    let output = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "[Environment]::GetEnvironmentVariable('Path','User')",
        ])
        .output()
        .map_err(|error| format!("Could not read user PATH: {error}"))?;
    if !output.status.success() {
        return Err("Could not read user PATH".to_string());
    }
    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

#[cfg(windows)]
fn windows_set_user_path(value: &str) -> Result<(), String> {
    let status = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "[Environment]::SetEnvironmentVariable('Path', $env:COJUDGE_PATH_VALUE, 'User')",
        ])
        .env("COJUDGE_PATH_VALUE", value)
        .status()
        .map_err(|error| format!("Could not update user PATH: {error}"))?;
    if !status.success() {
        return Err("Could not update user PATH".to_string());
    }
    Ok(())
}

#[cfg(windows)]
fn path_entry_matches(entry: &str, dir: &Path) -> bool {
    let trimmed = entry.trim().trim_end_matches(['\\', '/']);
    if trimmed.is_empty() {
        return false;
    }
    PathBuf::from(trimmed) == dir
}

#[cfg(windows)]
fn ensure_windows_path() -> Result<bool, String> {
    let dir = install_dir()?;
    let existing = windows_user_path()?;
    let mut parts: Vec<String> = existing
        .split(';')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .map(ToString::to_string)
        .collect();
    if parts.iter().any(|part| path_entry_matches(part, &dir)) {
        return Ok(false);
    }
    parts.insert(0, dir.display().to_string());
    windows_set_user_path(&parts.join(";"))?;
    Ok(true)
}

#[cfg(windows)]
fn remove_windows_path() -> Result<(), String> {
    let dir = install_dir()?;
    let existing = windows_user_path()?;
    let parts: Vec<String> = existing
        .split(';')
        .map(str::trim)
        .filter(|part| !part.is_empty() && !path_entry_matches(part, &dir))
        .map(ToString::to_string)
        .collect();
    windows_set_user_path(&parts.join(";"))
}

fn unix_wrapper_contents(node: &Path, backend: &Path) -> String {
    format!(
        "#!/bin/sh\nexport COJUDGE_ROOT={}\nexport COJUDGE_DESKTOP=1\nexec {} \"$COJUDGE_ROOT/bin/cojudge\" \"$@\"\n",
        sh_quote(&backend.to_string_lossy()),
        sh_quote(&node.to_string_lossy())
    )
}

fn windows_wrapper_contents(node: &Path, backend: &Path) -> String {
    format!(
        "@echo off\r\nset \"COJUDGE_ROOT={}\"\r\nset \"COJUDGE_DESKTOP=1\"\r\n\"{}\" \"%COJUDGE_ROOT%\\bin\\cojudge\" %*\r\n",
        backend.display(),
        node.display()
    )
}

fn write_wrapper(node: &Path, backend: &Path) -> Result<PathBuf, String> {
    let dir = install_dir()?;
    fs::create_dir_all(&dir).map_err(|error| format!("Could not create {}: {error}", dir.display()))?;
    let path = wrapper_path()?;
    let contents = if cfg!(windows) {
        windows_wrapper_contents(node, backend)
    } else {
        unix_wrapper_contents(node, backend)
    };
    fs::write(&path, contents)
        .map_err(|error| format!("Could not write {}: {error}", path.display()))?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&path, fs::Permissions::from_mode(0o755))
            .map_err(|error| format!("Could not make {} executable: {error}", path.display()))?;
    }
    Ok(path)
}

#[tauri::command]
pub fn cli_status(app: AppHandle) -> Result<CliStatus, String> {
    current_status(&app)
}

#[tauri::command]
pub fn cli_install(app: AppHandle) -> Result<CliStatus, String> {
    let node = node_binary()?;
    let backend = backend_dir(&app)?;
    let script = cli_script(&app)?;
    if !node.is_file() || !script.is_file() {
        return Ok(unavailable(
            "CLI install is available in the packaged Cojudge app.",
        ));
    }

    let node = resolve_existing(&node);
    let backend = resolve_existing(&backend);
    write_wrapper(&node, &backend)?;

    #[cfg(unix)]
    let path_changed = ensure_unix_path()?;
    #[cfg(windows)]
    let path_changed = ensure_windows_path()?;

    let mut status = current_status(&app)?;
    status.needs_new_terminal = path_changed || !install_dir_on_path()?;
    status.message = Some(if status.needs_new_terminal {
        "Installed. Open a new terminal, then run cojudge -h.".to_string()
    } else {
        "Installed. Run cojudge -h in a terminal.".to_string()
    });
    Ok(status)
}

#[tauri::command]
pub fn cli_uninstall(app: AppHandle) -> Result<CliStatus, String> {
    let path = wrapper_path()?;
    if path.exists() {
        fs::remove_file(&path)
            .map_err(|error| format!("Could not remove {}: {error}", path.display()))?;
    }

    #[cfg(unix)]
    remove_unix_path()?;
    #[cfg(windows)]
    remove_windows_path()?;

    #[cfg(windows)]
    if let Ok(dir) = install_dir() {
        let _ = fs::remove_dir(dir);
    }

    let mut status = current_status(&app)?;
    status.message = Some("Removed the Cojudge CLI.".to_string());
    Ok(status)
}

#[tauri::command]
pub fn cli_remove_shell_alias(app: AppHandle) -> Result<CliStatus, String> {
    let removed = remove_shell_aliases()?;
    let mut status = current_status(&app)?;
    status.message = Some(if removed.is_empty() {
        "No cojudge shell alias was found.".to_string()
    } else {
        format!("Removed the cojudge alias from {}.", removed.join(", "))
    });
    Ok(status)
}
