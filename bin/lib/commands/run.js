import path from "path";
import fs from "fs";
import {
  rootDir,
  getPIDs,
  getLangFromExt,
  isDockerRunning,
} from "../utils.js";
import { startServer } from "../server.js";

export async function handleRun(argsToUse, PORT) {
  if (!isDockerRunning()) {
    console.error(
      "\x1b[31mError: Docker engine not detected. Please ensure Docker is running.\x1b[0m",
    );
    process.exit(1);
  }

  let slug = argsToUse[1];
  let filename = argsToUse[2];

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
    console.error("Usage: cojudge run <slug> <file> OR cojudge run <file>");
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

    const response = await fetch(`http://localhost:${PORT}${apiEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const { jobId } = await response.json();

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
      throw new Error("Execution timed out after 60 seconds");
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
