import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { rootDir, getPIDs } from "./utils.js";

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

export function startServer(PORT, callback, shouldExit = true) {
  const logFile = getLogFile();

  if (!fs.existsSync(path.join(rootDir, "node_modules"))) {
    console.log("Installing dependencies (first-time setup)...");
    try {
      execSync("npm install", { cwd: rootDir, stdio: "inherit" });
    } catch (e) {
      console.error("Failed to install dependencies.");
      process.exit(1);
    }
  }

  if (
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
    const spawnArgs = [
      vitePath,
      "preview",
      "--port",
      PORT.toString(),
      "--host",
    ];

    const child = spawn(cmd, spawnArgs, {
      cwd: rootDir,
      env: { ...process.env, PORT: PORT.toString() },
      stdio: ["ignore", out, errFile],
      detached: true,
      windowsHide: true,
    });
    child.unref();

    console.log(`Waiting for server to start on port ${PORT}...`);
    let attempts = 0;
    const maxAttempts = 60;
    const interval = setInterval(() => {
      attempts++;
      if (getPIDs(PORT).length > 0) {
        clearInterval(interval);
        console.log("Server started!");
        if (callback) callback();
        if (shouldExit) {
          setTimeout(() => process.exit(0), 1000);
        }
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.log(
          `Server is taking too long to start. Check logs with 'cojudge -l'.`,
        );
        process.exit(1);
      }
    }, 1000);
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
