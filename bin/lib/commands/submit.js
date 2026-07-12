import path from "path";
import fs from "fs";
import {
  rootDir,
  getPIDs,
  getLangFromExt,
  isDockerRunning,
} from "../utils.js";
import { startServer } from "../server.js";
import { markProblem } from "../progress.js";

export async function handleSubmit(argsToUse, PORT) {
  if (!isDockerRunning()) {
    console.error(
      "\x1b[31mError: Docker engine not detected. Please ensure Docker is running.\x1b[0m",
    );
    process.exit(1);
  }

  const slug = argsToUse[1];
  const filename = argsToUse[2];

  if (!slug || !filename) {
    console.error("Usage: cojudge submit <slug> <file>");
    process.exit(1);
  }

  const problemsPath = path.join(rootDir, "problems", slug);
  if (!fs.existsSync(problemsPath)) {
    console.error(`Error: Problem slug '${slug}' not found.`);
    process.exit(1);
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

  console.log(`Submitting '${slug}' with ${filename}...`);

  try {
    let startTcNo = 0;
    let totalTcCount = 0;
    let passedTcCount = 0;
    let keepRunning = true;

    while (keepRunning) {
      const response = await fetch(`http://localhost:${PORT}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: slug,
          language: lang,
          code: code,
          startTcNo: startTcNo,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || response.statusText);
      }

      const { jobId } = await response.json();

      let jobResult = null;
      let attempts = 0;
      const maxPolls = 120;
      while (!jobResult && attempts < maxPolls) {
        attempts++;
        const pollResponse = await fetch(
          `http://localhost:${PORT}/api/submit?jobId=${jobId}`,
        );
        const data = await pollResponse.json();

        if (!pollResponse.ok || data.error) {
          if (data.errorTestCase) {
            const inputStr = Object.entries(data.errorTestCase)
              .filter(([key]) =>
                !["output", "logs", "isCorrect", "correctAnswer", "error"].includes(key)
              )
              .map(([key, value]) => `${key} = ${value}`)
              .join(", ");
            console.log(`\n\x1b[31mFAILED\x1b[0m at Test Case ${startTcNo + 1}`);
            console.log(`INPUT: ${inputStr}`);
          }
          let msg = data.error || pollResponse.statusText;
          msg = msg.replace(/^Submission failed: details: /i, "");
          msg = msg.replace(/^Error: /i, "");
          if (msg.includes('SIGSEGV')) {
            console.error('\x1b[33mHint: Segmentation fault — check for out-of-bounds array access or null pointer dereference.\x1b[0m');
          } else if (msg.includes('SIGFPE')) {
            console.error('\x1b[33mHint: Floating point exception — check for division by zero or arithmetic overflow.\x1b[0m');
          } else if (msg.includes('SIGABRT')) {
            console.error('\x1b[33mHint: Abort — check for assertion failures or unhandled exceptions.\x1b[0m');
          }
          throw new Error(msg);
        }

        if (data.ready) {
          if (data.timeout) throw new Error("Time Limit Exceeded");
          jobResult = data;
        } else {
          await new Promise((r) => setTimeout(r, 100));
        }
      }

      if (!jobResult) throw new Error("Submission timed out");

      totalTcCount = jobResult.totalTc || totalTcCount;

      const firstFailed = (jobResult.results || []).find((r) => !r.isCorrect);

      if (firstFailed) {
        const passedInThisBatch = (jobResult.results || []).filter((r, idx) => {
          const failedIdx = (jobResult.results || []).findIndex(
            (res) => !res.isCorrect,
          );
          return idx < failedIdx;
        }).length;

        passedTcCount = startTcNo + passedInThisBatch;

        console.log(
          `\n\x1b[31mFAILED\x1b[0m at Test Case ${passedTcCount + 1}`,
        );

        const inputStr = Object.entries(firstFailed)
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
        console.log(`EXPECTED: ${firstFailed.correctAnswer}`);
        console.log(`ACTUAL: ${firstFailed.output}`);
        if (firstFailed.logs && firstFailed.logs.trim()) {
          console.log(`CONSOLE: ${firstFailed.logs.trim()}`);
        }

        console.log(
          `\nSummary: ${passedTcCount}/${totalTcCount} test cases passed.`,
        );
        process.exit(1);
      }

      startTcNo += (jobResult.results || []).length;

      if (startTcNo >= totalTcCount) {
        passedTcCount = totalTcCount;
        keepRunning = false;
        console.log(`\n\x1b[32mACCEPTED\x1b[0m`);
        console.log(
          `Summary: ${passedTcCount}/${totalTcCount} test cases passed.`,
        );

        markProblem(slug, true);
      } else {
        process.stdout.write(
          `Testing... ${startTcNo}/${totalTcCount} passed\r`,
        );
      }
    }
  } catch (e) {
    let msg = e.message;
    msg = msg.replace(/^Submission failed: details: /i, "");
    msg = msg.replace(/^Error: /i, "");
    console.error(`\x1b[31m${msg}\x1b[0m`);
    process.exit(1);
  }
}
