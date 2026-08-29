fn main() {
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new().commands(&["new_window", "google_oauth_access_token", "read_text_file"]),
    ))
    .expect("failed to run tauri-build");
}
