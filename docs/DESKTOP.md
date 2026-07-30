# Desktop Apps

Cojudge uses Tauri with the operating system's webview:

- macOS: WKWebView, based on the same WebKit engine as Safari
- Windows: WebView2
- Linux: WebKitGTK

A bundled Node.js sidecar runs the existing SvelteKit server on the loopback interface. Users do not need to install Node.js, npm, or Rust to run a packaged application.

## Runtime Requirements

- macOS 13.5 or newer, Windows x64, or Debian/Ubuntu x64
- Docker Desktop, OrbStack, or Colima only when running, submitting, or debugging code

`DOCKER_HOST` takes precedence when provided. Otherwise the app checks the standard Docker endpoints for its operating system.

## Firebase Sharing

Firebase is optional and is only needed to save or open shared solutions. In a packaged desktop app, open the homepage menu and select **Firebase settings**, then enter the web-app values from the Firebase console:

- API key
- Auth domain
- Project ID
- Messaging sender ID
- App ID
- Storage bucket (optional)

The values are stored locally on that device and are ignored by the hosted web app, including when they arrive in an imported backup. After the five required fields are configured, the homepage menu shows **Load**. Entering or pasting the fourth character automatically opens `/p/<code>`; no submit action is required. The Firebase project must have anonymous authentication enabled and Firestore rules that permit the app's `shares` operations.

## Development

Install the native build prerequisites for your operating system, Node.js, npm, and Rust, then run:

```bash
npm install
npm run desktop:dev
```

Development mode loads the SvelteKit development server in the native webview. It does not stage or launch the production Node.js sidecar.

## Local Installers

Build the default installer for the current operating system:

```bash
npm run desktop:build
```

The platform defaults are DMG on macOS, NSIS EXE on Windows, and DEB on Linux. The build downloads a pinned Node.js runtime, verifies its SHA-256 checksum, builds SvelteKit, and installs only backend production dependencies.

Create an ad-hoc signed macOS build for local testing:

```bash
APPLE_SIGNING_IDENTITY=- npm run desktop:build
```

Build a universal macOS DMG:

```bash
rustup target add aarch64-apple-darwin x86_64-apple-darwin
APPLE_SIGNING_IDENTITY=- npm run desktop:build -- --target universal-apple-darwin --bundles dmg
```

Installer output is written under `src-tauri/target/<target>/release/bundle/`, or `src-tauri/target/release/bundle/` for a native build.

## GitHub Release

The `Release desktop installers` workflow is manually triggered:

1. Update the version in `package.json` and `src-tauri/Cargo.toml`.
2. Open the repository's Actions tab.
3. Select `Release desktop installers` and choose `Run workflow`.
4. Enter the version without a leading `v`, for example `0.1.0`.

The workflow builds all platforms before publishing anything. When every build succeeds, it creates tag `v<version>` and a GitHub Release containing exactly:

- `Cojudge_<version>_universal.dmg`
- `Cojudge_<version>_x64-setup.exe`
- `Cojudge_<version>_amd64.deb`

The generated release notes automatically include this required command for the ad-hoc-signed macOS build:

```bash
xattr -dr com.apple.quarantine /Applications/Cojudge.app
```

## Distribution Signing

The default workflow produces an ad-hoc-signed, non-notarized macOS app and an unsigned Windows installer. macOS users must run the quarantine command above, and Windows may display a SmartScreen warning.

For trusted public distribution, configure Apple Developer ID/notarization credentials and a Windows code-signing certificate in the workflow.

## Packaged Resources

Every installer includes:

- The SvelteKit client and server build
- The platform-specific Node.js runtime
- Production dependencies required by Docker-based judging
- All courses, problems, tests, markers, and debugger Dockerfiles

Docker itself and language runtime images are not included. Missing runner images are downloaded through the configured Docker daemon as needed.
