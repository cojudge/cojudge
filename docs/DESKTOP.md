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

## Firebase And Cojudge Cloud

Firebase is optional and is only needed for shared solutions and Cojudge Cloud. Official release builds receive the project configuration from GitHub Actions. For a custom project, open the homepage menu and select **Firebase settings**, then enter the web-app values from the Firebase console:

- API key
- Auth domain
- Project ID
- Messaging sender ID
- App ID
- Storage bucket (optional)
- Google desktop OAuth client ID (required for Cojudge Cloud sign-in)
- Google desktop OAuth client secret (required when Google enforces it for token exchange)

The values are stored locally on that device and are ignored by the hosted web app. They are excluded from progress backups and Cojudge Cloud snapshots. After the five Firebase web-app fields are configured, the homepage menu shows **Load**. Entering or pasting the fourth character automatically opens `/p/<code>`; no submit action is required.

For a custom Firebase project:

1. Enable Anonymous and Google providers in Firebase Authentication.
2. Add the hosted domain to Authentication's authorized domains.
3. Put the Google provider's Web OAuth client ID in `VITE_GOOGLE_WEB_CLIENT_ID`. Add each browser origin that hosts Cojudge to that client's authorized JavaScript origins.
4. Create a Google OAuth client with application type **Desktop app**. Put its client ID in `VITE_GOOGLE_DESKTOP_CLIENT_ID` and its generated client secret in `VITE_GOOGLE_DESKTOP_CLIENT_SECRET` for local/custom builds.
5. If Identity Platform asks for external Google client IDs, add the desktop client ID there as well.
6. Deploy the private per-user and sharing rules with `npx firebase-tools deploy --only firestore:rules --project <project-id>`.

Desktop Google sign-in opens the system browser, listens temporarily on a random `127.0.0.1` port, uses OAuth PKCE, and then closes the local listener. No hosted callback server or VPS is involved. Google calls the native credential a client secret, but installed apps cannot keep embedded values confidential; PKCE and callback validation provide the security boundary.

Cojudge Cloud is manual: **Upload backup** replaces the account's single cloud backup, while **Download backup** replaces local progress after confirmation. Signing in never uploads or downloads progress automatically.

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

Before running a release, configure these GitHub Actions repository secrets. Vite embeds the public project identifiers and desktop client ID in each installer; the workflow compiles the desktop client secret into the native binary rather than the web bundle:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `GOOGLE_WEB_CLIENT_ID`
- `GOOGLE_DESKTOP_CLIENT_ID`
- `GOOGLE_DESKTOP_CLIENT_SECRET`

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
