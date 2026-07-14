import path from "path";
import fs from "fs";
import {
  rootDir,
  getPIDs,
  getLangFromExt,
  isDockerRunning,
} from "../utils.js";
import { startServer } from "../server.js";

function parseDebugLines(args) {
  const debugIdx = args.findIndex(a => a === '--debug-lines');
  if (debugIdx === -1) return null;
  const val = args[debugIdx + 1];
  if (!val) return null;
  return val.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
}

function stripDebugArgs(args) {
  const result = [];
  let i = 0;
  while (i < args.length) {
    if (args[i] === '--debug-lines') {
      i += 2;
    } else {
      result.push(args[i]);
      i++;
    }
  }
  return result;
}

export async function handleRun(argsToUse, PORT) {
  const debugLines = parseDebugLines(argsToUse);
  const cleanedArgs = debugLines ? stripDebugArgs(argsToUse) : argsToUse;

  if (!isDockerRunning()) {
    console.error(
      "\x1b[31mError: Docker engine not detected. Please ensure Docker is running.\x1b[0m",
    );
    process.exit(1);
  }

  let slug = cleanedArgs[1];
  let filename = cleanedArgs[2];

  if (slug === '-h' || slug === '--help') {
    showRunHelp();
    return;
  }

  if (
    slug &&
    !filename &&
    fs.existsSync(slug) &&
    !fs.existsSync(path.join(rootDir, "problems", slug))
  ) {
    filename = slug;
    slug = "playground";
  }

  if (!slug || !filename) {
    showRunHelp();
    process.exit(1);
  }

  let problemId = slug;
  let isPlayground = slug === "playground";
  let testCases = [];

  if (!isPlayground) {
    const problemsPath = path.join(rootDir, "problems", slug);
    if (!fs.existsSync(problemsPath)) {
      console.error(`Error: Problem slug '${slug}' not found.`);
      process.exit(1);
    }

    const metadataPath = path.join(problemsPath, "metadata.json");
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      testCases = metadata.testCases || [];
    } catch (e) {
      console.error(`Error: Could not read metadata for problem '${slug}'.`);
      process.exit(1);
    }
  } else {
    problemId = "playground";
    testCases = [{}];
  }

  if (!fs.existsSync(filename)) {
    console.error(`Error: File '${filename}' does not exist.`);
    process.exit(1);
  }

  const ext = path.extname(filename);
  const lang = getLangFromExt(ext);
  let code = "";
  try {
    code = fs.readFileSync(filename, "utf8");
  } catch (e) {
    console.error(`Error: Could not read file ${filename}: ${e.message}`);
    process.exit(1);
  }

  const pids = getPIDs(PORT);
  if (pids.length === 0) {
    console.log("Server not running. Starting it first...");
    await new Promise((resolve) => {
      startServer(PORT, () => {
        resolve();
      }, false);
    });
  }

  try {
    const statusResponse = await fetch(
      `http://localhost:${PORT}/api/image/status?language=${lang}`,
    );
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      if (!statusData.present) {
        console.error(
          `\x1b[33mWarning: Docker image for ${lang} (${statusData.image}) is not found.\x1b[0m`,
        );
        console.error(
          `Please run 'cojudge ${filename}' to download it via the UI, or run:`,
        );
        console.error(`\x1b[36mdocker pull ${statusData.image}\x1b[0m`);
        process.exit(1);
      }
    }
  } catch (e) {
  }

  if (isPlayground) {
    console.log(`Running '${filename}' in playground...`);
  } else {
    console.log(`Running sample tests for '${slug}' with ${filename}...`);
  }

  try {
    const apiEndpoint = isPlayground ? "/api/playground/run" : "/api/run";
    const body = isPlayground
      ? { language: lang, code: code }
      : { problemId: slug, language: lang, code: code, testCases: testCases };

    if (debugLines) {
      body.debugLines = debugLines;
    }

    const response = await fetch(`http://localhost:${PORT}${apiEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData.debug) {
      console.log(`\n\x1b[36mDebug session started.\x1b[0m`);
      console.log(`Job ID: \x1b[33m${responseData.jobId}\x1b[0m`);
      console.log("");
      console.log("Commands:");
      console.log(`  cojudge debug ${responseData.jobId}          Show current state`);
      console.log(`  cojudge debug continue ${responseData.jobId}  Continue execution`);
      console.log(`  cojudge debug step ${responseData.jobId}      Step to next line`);
      console.log(`  cojudge debug stop ${responseData.jobId}      Stop debugging`);
      console.log("");

      if (responseData.state) {
        printDebugState(responseData.state, responseData.jobId);
      }
      return;
    }

    const { jobId } = responseData;

    let results = null;
    let attempts = 0;
    const maxPolls = 120;
    while (!results && attempts < maxPolls) {
      attempts++;
      const pollResponse = await fetch(
        `http://localhost:${PORT}${apiEndpoint}?jobId=${jobId}`,
      );
      const polledData = await pollResponse.json();

      if (!pollResponse.ok) {
        throw new Error(
          polledData.error || polledData.message || pollResponse.statusText,
        );
      }

      if (polledData.ready) {
        if (polledData.error) {
          throw new Error(polledData.error);
        }
        if (polledData.timeout) {
          throw new Error("Execution timed out");
        }

        if (isPlayground) {
          results = [polledData];
        } else {
          results = polledData.results;
        }
      } else {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    if (!results) {
      throw new Error("Execution timed out after 12 seconds");
    }

    results.forEach((res, index) => {
      if (!isPlayground) {
        console.log(`\nTEST CASE ${String(index + 1).padStart(2, "0")}`);

        const inputStr = Object.entries(res)
          .filter(
            ([key]) =>
              ![
                "output",
                "logs",
                "isCorrect",
                "correctAnswer",
                "error",
              ].includes(key),
          )
          .map(([key, value]) => `${key} = ${value}`)
          .join(", ");

        console.log(`INPUT: ${inputStr}`);
        console.log(`EXPECTED: ${res.correctAnswer}`);
        console.log(`ACTUAL: ${res.output}`);
      } else {
        if (index > 0) console.log("\n---");
      }

      if (res.logs && res.logs.trim()) {
        console.log(`CONSOLE: ${res.logs.trim()}`);
      }

      if (res.output && isPlayground) {
        console.log(res.output);
      }

      if (!isPlayground && res.isCorrect !== undefined) {
        if (res.isCorrect) {
          console.log(`VERDICT: \x1b[32mPASS\x1b[0m`);
        } else {
          console.log(`VERDICT: \x1b[31mFAILED\x1b[0m`);
        }
      }
    });
  } catch (e) {
    let msg = e.message;
    msg = msg.replace(/^Execution failed: details: /i, "");
    msg = msg.replace(/^Error: /i, "");
    msg = msg.replace(/^Error: /i, "");

    console.error(`\x1b[31m${msg}\x1b[0m`);
    process.exit(1);
  }
}

function printDebugState(data, jobId) {
  if (data.status === 'running') {
    console.log('Status:  \x1b[33mRunning\x1b[0m (waiting to hit a breakpoint)');
  } else if (data.status === 'paused') {
    console.log('Status:  \x1b[36mPaused\x1b[0m');
    console.log(`Line:    \x1b[33m${data.line}\x1b[0m`);

    if (data.vars && Object.keys(data.vars).length > 0) {
      console.log('Variables:');
      for (const [key, value] of Object.entries(data.vars)) {
        const truncated = String(value).length > 120
          ? String(value).slice(0, 120) + '...'
          : value;
        console.log(`  \x1b[32m${key}\x1b[0m = ${truncated}`);
      }
    }

    if (data.output && data.output.trim()) {
      console.log('Output so far:');
      const lines = data.output.trim().split('\n');
      for (const line of lines) {
        console.log(`  \x1b[90m${line}\x1b[0m`);
      }
    }
  } else if (data.status === 'completed') {
    console.log('Status:  \x1b[32mCompleted\x1b[0m');
    if (data.output && data.output.trim()) {
      console.log('Output:');
      const lines = data.output.trim().split('\n');
      for (const line of lines) {
        console.log(`  ${line}`);
      }
    }
  }
  console.log('');
}

function showRunHelp() {
  console.log(`
cojudge run - Execute code against sample test cases

Usage:
  cojudge run <slug> <file>        Run sample tests for a problem
  cojudge run <file>               Run a standalone playground file
  cojudge run <file> --debug-lines <lines>  Debug with breakpoints

Options:
  --debug-lines <lines>   Comma-separated line numbers to set breakpoints
                          (e.g. --debug-lines 5,10,15)
                          Currently supports Python only.

Examples:
  cojudge run two-sum Solution.py
  cojudge run my-script.py
  cojudge run my-script.py --debug-lines 3,8,12
`);
}
