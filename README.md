[![CI](https://github.com/cojudge/cojudge/actions/workflows/test.yml/badge.svg)](https://github.com/cojudge/cojudge/actions/workflows/test.yml)
[![GitHub Release](https://img.shields.io/github/v/release/cojudge/cojudge?include_prereleases)](https://github.com/cojudge/cojudge/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/cojudge/cojudge?style=social)](https://github.com/cojudge/cojudge)

> Solve classic algorithmic problems without the internet or having to deal with installing runtimes. No discussion forum, no LLM assistant, not even the internet. Solve the curated list with just you, the problem and the judge.

|![Web UI](/screenshots/problem.png) | ![CLI](/screenshots/cli.png) |
|:---:|:---:|
| localhost web | CLI |
|![Web UI](/screenshots/progresstracker.png) | ![CLI](/screenshots/debugger.png) |
| Progress Tracker | Debugger |

![Demo + Visualizer](./screenshots/ide.gif)

### Demo site: [https://cojudge.cloud](https://cojudge.cloud)

## Highlights

- Offline-first: judge solutions without an internet connection
- Custom test cases: add your own test cases and compare the expected output with your code output, just like in LeetCode but no internet connection is required here
- Dynamic judging: judge solutions with custom `isCorrect(output)` logic for each problem instead of just checking `str(output) == str(expected)`
- Docker sandboxes: consistent, isolated runs across machines
- LeetCode-style problem packs with statements and tests
- Simple & fast web UI (SvelteKit) with in-browser editor and light/dark mode support
- Debugger support (Java/C++/Python/Typescript/Rust/C#/Go)
- Multiple languages support for all problems (Java/C++/Python/Typescript/Rust/C#/Go)
- Code Playground: Run code snippets in Java, C++, Python, Typescript, Rust, C# or Go without a problem context
- Extensible: add new problems by dropping folders in `problems/`
- Persistent Code & Progress Tracking via Local Storage
- Optional manual Cojudge Cloud backups through Google sign-in; local storage remains the source of truth
- Browser-like tabs to organize your local solutions
- Extensive problems: includes all 75 problems with sample test cases, hidden test cases and reference solutions from Blind 75

## Requirements

- Node.js (v18+) and npm for CLI or source installs; desktop releases bundle Node.js
- Docker (installed and running, only required while judging)

## Quickstart

### 1. Installation

#### Desktop app
Download the latest installer for macOS, Windows, or Linux from [GitHub Releases](https://github.com/cojudge/cojudge/releases). Desktop builds bundle Node.js; Docker is only required when running, submitting, or debugging code.

#### CLI
The easiest way to install the `cojudge` CLI without dealing with NPM permission issues is to run our install script:

#### Mac / Linux
```bash
git clone https://github.com/cojudge/cojudge
cd cojudge
./install.sh
source ~/.zshrc # or ~/.bashrc, depending on your shell
```

#### Windows Powershell
```powerhshell
git clone https://github.com/cojudge/cojudge
cd cojudge
./install.ps1
. $PROFILE
```

This will install dependencies, build the app, and add a `cojudge` alias to your shell configuration.

### 2. Usage
Open the installed desktop app, or run `cojudge` to start the server and open it in your browser:
```bash
cojudge
```

### CLI Commands
| Command | Description |
| --- | --- |
| `cojudge` | Start server & open browser |
| `cojudge <slug> <file>` | Open specific problem in browser with local file |
| `cojudge init <slug> [--lang <lang>] [--output <filename>]` | Initialize a problem file with starter code with filename. Fall back to, for example `solution.rs`, if `filename` is not provided |
| `cojudge run <slug> <file>` | Run sample tests for a problem from CLI (require running Docker) |
| `cojudge submit <slug> <file>`| Submit code for a problem from CLI (require running Docker) |
| `cojudge run <file>` | Run a playground file from CLI (require running Docker) |
| `cojudge list` | List all available problem slugs |
| `cojudge mark <slug>` | Mark a problem as solved |
| `cojudge unmark <slug>` | Unmark a problem as solved |
| `cojudge -p, --port <port>` | Start server on specific port (default 5375) |
| `cojudge -s, --status` | Check if server is running |
| `cojudge -u, --update` | Update to latest version (git pull) |
| `cojudge -l, --logs` | Stream the server logs |
| `cojudge -k, --kill` | Stop the server |
| `cojudge -v, --version` | Show current version & age |
| `cojudge -h, --help` | Show help message |

**Note:** You can browse problems and organize solutions without Docker. Docker is only required when you actually want to `Run` or `Submit` code, either from the web UI or CLI.

### Manual Global Installation (If you prefer)
If you'd rather install it globally via NPM and have the necessary permissions:
```bash
npm install -g .
```

### Troubleshooting Installation (Permission Denied)

If you encounter an `EACCES` error when running `npm install -g .` (especially on macOS with Homebrew), it's likely because your user doesn't have permissions to write to the global `node_modules` folder.

You can fix this by either:
1. **Using sudo** (not recommended but fast):
   ```bash
   sudo npm install -g .
   ```
2. **Fixing npm permissions** (recommended): Follow the [official npm guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) to change npm's default directory.
3. **Using the install script** (easiest): Use `./install.sh` as described in the Quickstart section.

## Alternative: Manual Run
If you don't want to install the CLI:
```bash
chmod +x run.sh
./run.sh
```
This starts the app at: http://localhost:5375.

## Running with Docker (Containerized)

If you prefer to run the entire application inside a Docker container:
```bash
chmod +x docker.sh
./docker.sh
```
This builds a local image named `cojudge` and runs it, mapping the host Docker socket so the judge can spawn sibling containers.

## Desktop Apps

Cojudge can also run as a native Tauri application on macOS, Windows, and Linux. The application bundles its Node.js backend, problems, and courses, so users do not need to install Node.js. Docker is still required when running or debugging code.

See [`docs/DESKTOP.md`](docs/DESKTOP.md) for development, DMG, signing, and notarization instructions.

## Cojudge Cloud

Cojudge Cloud stores one private progress backup per Google account. **Upload backup** replaces that cloud copy with this device's solutions, files, checkboxes, settings, game results, test cases, course selection, and whiteboards. **Download backup** replaces the corresponding local progress after confirmation. Nothing uploads or downloads automatically.

Cloud access is never required to browse problems, edit solutions, use the whiteboard, or run the local judge. Every change is saved locally first, and failed or unavailable backups do not block the application.

## Development

1) Add $USER to docker group (if using Docker)
```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

2) Install dependencies
```bash
npm install
```
3) Start the app (dev)
```bash
npm run dev
```

## Add a problem

See [`docs/ADD_PROBLEMS.md`](docs/ADD_PROBLEMS.md) for a comprehensive guide covering:

- Required files (`statement.md`, `metadata.json`, `official-tests.json`, `Marker.java`)
- Standard function-based problems vs class-based design problems
- Supported parameter/output types
- Starter code conventions for all 5 languages (Java, Python, C++, C#, Rust)
- How to write `Marker.java` with the reference solution and `isCorrect` validator
- Registration in `courses/blind75/courseinfo.json`
- Verification checklist (`cojudge init`/`run`/`submit`)

Refer to `problems/two-sum` for a minimal example.

#### Note on problems

Some test cases and reference marker solutions were AI‑assisted and human‑reviewed. Issues may remain—please open an issue or PR if you spot anything.

## Add a programming language

This is a more complicated process but it is definitely doable.

1. For starter you need to create a new class that extends class `ProgramRunner.ts` (e.g. `JavascriptRunner.ts`) and implement your own `abstract compile()` and `abstract run()`. It's expected that all runtimes will be executed via [Dockerode](https://github.com/apocas/dockerode)

2. Implement all the `displayOutput({inputType})` and `to_{inputType}()` methods on your custom utilitiy class (e.g. `javascriptUtil.ts`)

3. Add your new languages on `api/image/pull` and `api/image/status`

4. Add `starterCode` to the problem you like to solve in your language. Just the starter code is needed for existing problems. No need for solution in the new language. Our codebase will handle the rest.

5. Update `type ProgrammingLanguage = 'java' | 'python' | 'cpp' | 'your_new_lang'` on `util.ts`;

6. Add a new `<option>` on the UI for the new language in `#language-select`

7. Create a new class that extends `PlaygroundRunner` (e.g. `PlaygroundJavascriptRunner`) in `src/lib/runners/PlaygroundRunners.ts` and add the instantiation logic in `src/routes/api/playground/run/+server.ts`.

Refer to `javaUtil.ts`, `JavaRunner.ts` and `problems/two-sum` for a detailed example.

## Troubleshooting

### Error Connecting to Docker on macOS with Colima

Some Docker environments on macOS (like Colima) use a non-default Docker socket path. If the application has trouble connecting to Docker, you can specify the path manually by setting the `HOST_DOCKER_SOCKET` environment variable.

**Example:**
```bash
# Find your socket path by running `colima status`
HOST_DOCKER_SOCKET="/Users/your-user/.colima/default/docker.sock" ./docker.sh
```

### Docker Not Found on macOS with Orbstack

If you're using [Orbstack](https://orbstack.dev) instead of Docker Desktop, you may need to set the `DOCKER_HOST` environment variable so the app can locate the Docker socket:

```bash
export DOCKER_HOST="unix://$HOME/.orbstack/run/docker.sock"
```

Add this line to your `~/.zshrc` (or `~/.bashrc`) to make it permanent:

## Contact

Feel free to use the [Issue page](https://github.com/cojudge/cojudge/issues) or [Discussion page](https://github.com/cojudge/cojudge/discussions) for any issues, feedback, comments, feature requests, or anything else related to cojudge.
