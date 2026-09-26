fn main() {
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new().commands(&[
            "new_window",
            "google_oauth_access_token",
            "read_text_file",
            "cli_status",
            "cli_install",
            "cli_uninstall",
            "cli_remove_shell_alias",
            "docker_settings",
            "save_docker_settings",
            "test_docker_connection",
        ]),
    ))
    .expect("failed to run tauri-build");
}
