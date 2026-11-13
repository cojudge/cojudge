import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { rootDir, getPIDs, isDesktopCli } from "./utils.js";
import { ensureUserContentSeededSync, getContentRoot } from "./contentPaths.js";

export function getLogFile() {
  const homeConfigDir = path.join(os.homedir(), ".cojudge");
  if (!fs.existsSync(homeConfigDir)) {
    try {
      fs.mkdirSync(homeConfigDir, { recursive: true });
    } catch (e) {
      return path.join(rootDir, "cojudge.log");
    }
  }
  return path.join(homeConfigDir, "cojudge.log");
}

const READY_POLL_MS = 200;
const READY_TIMEOUT_MS = 60000;

/**
 * Resolve true once the server answers HTTP requests. Polling the port with
 * netstat/lsof once a second added up to a second of dead time per start,
 * and the bare port can be open before the app handler has loaded (the
 * preview server answers 503 until then), so probe a static file instead.
 */
async function waitForServer(PORT) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/robots.txt`, {
        signal: AbortSignal.timeout(2000),
      });
      await response.body?.cancel();
      if (response.status !== 503) return true;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, READY_POLL_MS));
  }
  return false;
}

export function startServer(PORT, callback, shouldExit = true) {
  ensureUserContentSeededSync();
  console.log(`Content: ${getContentRoot()} (edit problems/courses there; overrides bundled content)`);
  const logFile = getLogFile();

  if (!isDesktopCli && !fs.existsSync(path.join(rootDir, "node_modules"))) {
    console.log("Installing dependencies (first-time setup)...");
    try {
      execSync("npm install", { cwd: rootDir, stdio: "inherit" });
    } catch (e) {
      console.error("Failed to install dependencies.");
      process.exit(1);
    }
  }

  if (
    !isDesktopCli &&
    !fs.existsSync(path.join(rootDir, ".svelte-kit", "output")) &&
    !fs.existsSync(path.join(rootDir, "build"))
  ) {
    console.log("Building application (first-time setup)...");
    try {
      execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
    } catch (e) {
      console.error("Failed to build application.");
      process.exit(1);
    }
  }

  console.log(`Starting cojudge on port ${PORT}...`);
  console.log(`Logs are being written to ${logFile}`);

  try {
    const out = fs.openSync(logFile, "a");
    const errFile = fs.openSync(logFile, "a");

    const cmd = process.execPath;
    const vitePath = path.join(
      rootDir,
      "node_modules",
      "vite",
      "bin",
      "vite.js",
    );
    const previewServer = path.join(rootDir, "bin", "lib", "preview-server.mjs");
    const handlerPath = path.join(rootDir, "build", "handler.js");
    const spawnArgs = fs.existsSync(vitePath)
      ? [vitePath, "preview", "--port", PORT.toString(), "--host"]
      : fs.existsSync(handlerPath) && fs.existsSync(previewServer)
        ? [previewServer]
        : null;
    if (!spawnArgs) {
      console.error(
        "Cannot start the server: missing Vite preview and production build.",
      );
      process.exit(1);
    }

    const child = spawn(cmd, spawnArgs, {
      cwd: rootDir,
      env: { ...process.env, PORT: PORT.toString() },
      stdio: ["ignore", out, errFile],
      detached: true,
      windowsHide: true,
    });
    child.unref();

    console.log(`Waiting for server to start on port ${PORT}...`);
    void waitForServer(PORT).then((ready) => {
      if (!ready) {
        console.log(
          `Server is taking too long to start. Check logs with 'cojudge -l'.`,
        );
        process.exit(1);
      }
      console.log("Server started!");
      if (callback) callback();
      if (shouldExit) {
        setTimeout(() => process.exit(0), 1000);
      }
    });
  } catch (e) {
    console.error(`Failed to start server: ${e.message}`);
    process.exit(1);
  }
}

export function streamLogs() {
  const logFile = getLogFile();
  if (fs.existsSync(logFile)) {
    console.log(`Streaming logs from ${logFile}...`);
    const isWin = process.platform === "win32";
    const cmd = isWin ? "powershell" : "tail";
    const args = isWin
      ? ["-Command", `Get-Content "${logFile}" -Wait`]
      : ["-f", logFile];
    const tail = spawn(cmd, args, { stdio: "inherit" });
    process.on("SIGINT", () => {
      tail.kill();
      process.exit();
    });
  } else {
    console.log("No log file found.");
  }
}

export function killServer(PORT) {
  const pids = getPIDs(PORT);
  if (pids.length > 0) {
    console.log(`Stopping cojudge on port ${PORT}...`);
    pids.forEach((pid) => {
      try {
        process.kill(parseInt(pid), "SIGTERM");
      } catch (e) {}
    });
    console.log("Stopped.");
  } else {
    console.log(`cojudge is not running on port ${PORT}.`);
  }
}

export function restartServer(PORT, callback) {
  if (getPIDs(PORT).length === 0) {
    startServer(PORT, callback);
    return;
  }

  killServer(PORT);

  let attempts = 0;
  const maxAttempts = 30;
  const interval = setInterval(() => {
    attempts++;
    if (getPIDs(PORT).length === 0) {
      clearInterval(interval);
      startServer(PORT, callback);
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.error(
        `Failed to stop the server on port ${PORT}. Try 'cojudge -k' manually.`,
      );
      process.exit(1);
    }
  }, 500);
}
