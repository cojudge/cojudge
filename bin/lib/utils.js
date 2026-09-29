import { execSync, exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const rootDir = process.env.COJUDGE_ROOT
  ? path.resolve(process.env.COJUDGE_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const isDesktopCli = process.env.COJUDGE_DESKTOP === "1";

export function getParam(args, param) {
  const index = args.findIndex((arg) => arg === param);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  return null;
}

export function getPort(args) {
  return getParam(args, "-p") || getParam(args, "--port") || process.env.PORT || 5375;
}

export function getPIDs(port) {
  try {
    if (process.platform === "win32") {
      const stdout = execSync(
        `netstat -ano | findstr :${port} | findstr LISTENING`,
      )
        .toString()
        .trim();
      const lines = stdout.split("\n");
      const pids = new Set();
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          pids.add(parts[parts.length - 1]);
        }
      });
      return Array.from(pids);
    }
    const stdout = execSync(`lsof -i :${port} -t`).toString().trim();
    return stdout ? stdout.split("\n") : [];
  } catch (e) {
    return [];
  }
}

export function getLangFromExt(ext) {
  switch (ext.toLowerCase()) {
    case ".java":
      return "java";
    case ".py":
      return "python";
    case ".cpp":
    case ".cc":
    case ".hpp":
    case ".h":
      return "cpp";
    case ".rs":
      return "rust";
    case ".cs":
      return "csharp";
    case ".go":
      return "go";
    case ".ts":
      return "typescript";
    default:
      return "plaintext";
  }
}

export function openBrowser(port, openPath = "") {
  const url = `http://localhost:${port}${openPath}`;
  console.log(`Opening ${url} in browser...`);
  const plat = process.platform;
  const cmd =
    plat === "win32"
      ? `start "" "${url}"`
      : plat === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) {
      console.error(`Failed to open browser: ${err.message}`);
    }
  });
}

export function getDifficultyOrder(difficulty) {
  const d = (difficulty || "").toLowerCase();
  if (d === "easy") return 1;
  if (d === "medium") return 2;
  if (d === "hard") return 3;
  return 4;
}

export function isDockerRunning() {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

export function printVersion(dir) {
  try {
    const commit = execSync('git log -1 --format="%h"', { cwd: dir })
      .toString()
      .trim();
    const date = execSync(
      'git log -1 --format="%cd" --date=format:"%Y-%m-%d %H:%M:%S"',
      { cwd: dir },
    )
      .toString()
      .trim();
    console.log(`Cojudge version: ${commit} (${date})`);
  } catch (e) {
    try {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(dir, "package.json"), "utf8"),
      );
      console.log(`Cojudge version: ${pkg.version || "unknown"}`);
    } catch {
      console.log("Cojudge version unknown");
    }
  }
  console.log(`Installed at: ${dir}`);
}

export const APP_UPDATE_REPO = "cojudge/cojudge";
export const APP_UPDATE_RELEASES_URL = `https://github.com/${APP_UPDATE_REPO}/releases/latest`;
export const APP_UPDATE_API_URL = `https://api.github.com/repos/${APP_UPDATE_REPO}/releases/latest`;

export function getInstalledVersion(dir) {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8"),
    );
    const version = typeof pkg.version === "string" ? pkg.version.trim() : "";
    return version || null;
  } catch {
    return null;
  }
}

export function normalizeReleaseVersion(version) {
  return String(version ?? "").trim().replace(/^v/i, "");
}

export function compareReleaseVersions(a, b) {
  const parse = (value) => {
    const cleaned = normalizeReleaseVersion(value);
    const [core, ...preRest] = cleaned.split("-");
    const parts = core.split(".").map((part) => {
      const num = Number.parseInt(part, 10);
      return Number.isFinite(num) ? num : 0;
    });
    while (parts.length < 3) parts.push(0);
    return { parts, prerelease: preRest.join("-") };
  };
  const left = parse(a);
  const right = parse(b);
  for (let i = 0; i < 3; i++) {
    if (left.parts[i] !== right.parts[i]) {
      return left.parts[i] < right.parts[i] ? -1 : 1;
    }
  }
  if (left.prerelease === right.prerelease) return 0;
  if (!left.prerelease) return 1;
  if (!right.prerelease) return -1;
  return left.prerelease < right.prerelease ? -1 : 1;
}

function pickReleaseAsset(assets, patterns) {
  for (const pattern of patterns) {
    const found = assets.find((asset) =>
      typeof pattern === "string"
        ? asset.name === pattern
        : pattern.test(asset.name),
    );
    if (found) return found;
  }
  return null;
}

export function pickPlatformAsset(assets) {
  const list = Array.isArray(assets) ? assets : [];
  if (process.platform === "darwin") {
    return pickReleaseAsset(list, [/\.dmg$/, /\.app\.tar\.gz$/]);
  }
  if (process.platform === "win32") {
    return pickReleaseAsset(list, [/-setup\.exe$/, /\.nsis\.zip$/, /\.msi$/]);
  }
  return pickReleaseAsset(list, [/\.AppImage$/, /\.deb$/, /\.rpm$/]);
}

export async function fetchLatestRelease({ timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(APP_UPDATE_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "cojudge-cli",
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function checkDesktopUpdate(dir) {
  const current = getInstalledVersion(dir);
  const release = await fetchLatestRelease();
  const latest = normalizeReleaseVersion(release?.tag_name ?? release?.name ?? "");
  if (!latest) {
    throw new Error("Could not determine the latest release version.");
  }
  const comparison = current ? compareReleaseVersions(current, latest) : null;
  const releaseUrl =
    typeof release?.html_url === "string" && release.html_url.trim()
      ? release.html_url.trim()
      : APP_UPDATE_RELEASES_URL;
  const asset = pickPlatformAsset(release?.assets);
  return {
    current,
    latest,
    upToDate: comparison === null ? null : comparison >= 0,
    releaseUrl,
    assetName: asset?.name ?? null,
    assetUrl: asset?.browser_download_url ?? null,
  };
}

export async function runDesktopUpdate(dir) {
  const displayCurrent = getInstalledVersion(dir) ?? "unknown";
  console.log(`Installed version: ${displayCurrent}`);
  console.log("Checking for updates...");
  let status;
  try {
    status = await checkDesktopUpdate(dir);
  } catch (e) {
    console.error(`Update check failed: ${e?.message ?? e}`);
    console.log(`See releases at ${APP_UPDATE_RELEASES_URL}`);
    return false;
  }
  if (status.upToDate === true) {
    console.log(`Cojudge is up to date (v${status.latest}).`);
    return false;
  }
  if (status.upToDate === null) {
    console.log(`Latest release: v${status.latest}.`);
  } else {
    console.log(`Update available: v${status.current} → v${status.latest}.`);
  }
  if (status.assetUrl) {
    console.log(`Download for this device: ${status.assetUrl}`);
  }
  console.log(`All downloads: ${status.releaseUrl}`);
  console.log(
    "Install the new app, then reinstall the CLI from the app menu (CLI → Install).",
  );
  if (process.platform === "darwin") {
    console.log(
      "macOS: after dragging Cojudge.app into /Applications, run: xattr -dr com.apple.quarantine /Applications/Cojudge.app",
    );
  }
  return true;
}

export function updateRepo(dir) {
  if (isDesktopCli) {
    console.log("This CLI is bundled with the Cojudge desktop app.");
    console.log(
      "Download a newer app from GitHub Releases, then reinstall the CLI from the app menu.",
    );
    return false;
  }
  console.log("Updating cojudge...");
  try {
    const before = execSync("git rev-parse HEAD", { cwd: dir })
      .toString()
      .trim();
    execSync("git pull", { cwd: dir, stdio: "inherit" });
    const after = execSync("git rev-parse HEAD", { cwd: dir })
      .toString()
      .trim();
    if (before === after) {
      console.log("Already up to date.");
      return false;
    }
    console.log("Installing dependencies and building...");
    execSync("npm install", { cwd: dir, stdio: "inherit" });
    execSync("npm run build", { cwd: dir, stdio: "inherit" });
    console.log("Update complete.");
    return true;
  } catch (e) {
    console.error("Update failed.");
    return false;
  }
}
