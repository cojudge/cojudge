import { execSync, exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

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
    console.log(`Installed at: ${dir}`);
  } catch (e) {
    console.log("Cojudge version unknown");
    console.log(`Installed at: ${dir}`);
  }
}

export function updateRepo(dir) {
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
