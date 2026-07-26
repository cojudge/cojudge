#!/usr/bin/env node
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const cojudgeBin = path.resolve(rootDir, "bin", "cojudge");
const languageFiles = {
  java: "Solution.java",
  python: "Solution.py",
  cpp: "Solution.cpp",
  csharp: "Solution.cs",
  rust: "Solution.rs",
  go: "Solution.go",
  typescript: "Solution.ts",
};
const defaultProblems = [
  "two-sum",
  "valid-anagram",
  "maximum-subarray",
  "reverse-linked-list",
  "maximum-depth-of-binary-tree",
  "climbing-stairs",
  "number-of-islands",
];

function parseArgs(argv) {
  const options = {
    concurrency: 2,
    includeRun: false,
    languages: ["java"],
    problems: [],
    report: null,
    solutionsRoot: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--csv") {
      options.problems.push(...readSlugsFromCsv(argv[++i]));
    } else if (arg === "--concurrency") {
      options.concurrency = Number(argv[++i]);
    } else if (arg === "--run") {
      options.includeRun = true;
    } else if (arg === "--languages") {
      const value = argv[++i];
      options.languages =
        value === "all" ? Object.keys(languageFiles) : value.split(",");
    } else if (arg === "--report") {
      options.report = path.resolve(rootDir, argv[++i]);
    } else if (arg === "--solutions-root") {
      options.solutionsRoot = path.resolve(argv[++i]);
    } else {
      options.problems.push(arg);
    }
  }

  if (options.problems.length === 0) options.problems = defaultProblems;
  options.problems = [...new Set(options.problems)];
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    throw new Error("--concurrency must be a positive integer");
  }
  for (const language of options.languages) {
    if (!languageFiles[language]) throw new Error(`Unknown language: ${language}`);
  }
  return options;
}

function readSlugsFromCsv(csvPath) {
  const file = path.resolve(rootDir, csvPath);
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/,([^,]+),(Easy|Medium|Hard)$/);
      if (!match) throw new Error(`Unable to parse CSV row: ${line}`);
      return match[1];
    });
}

function convertMarkerToSolution(markerCode) {
  // Extra methods are legal in a submission and retaining isCorrect avoids
  // brittle source parsing for multiline signatures.
  return markerCode.replace(/\bclass\s+Marker\b/, "class Solution");
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function runCommand(args, timeout = 180_000) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cojudgeBin, ...args], {
      cwd: rootDir,
      env: { ...process.env, NO_COLOR: "1" },
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));

    const timer = setTimeout(() => child.kill("SIGKILL"), timeout);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code, output: stripAnsi(output), signal });
    });
  });
}

async function verifySubmission(item, options, tempRoot) {
  const { slug, language } = item;
  const problemDir = path.resolve(rootDir, "problems", slug);
  let solutionPath;
  if (options.solutionsRoot) {
    solutionPath = path.resolve(
      options.solutionsRoot,
      slug,
      languageFiles[language],
    );
    if (!fs.existsSync(solutionPath)) {
      return {
        slug,
        language,
        passed: false,
        error: `Reference solution not found: ${solutionPath}`,
      };
    }
  } else {
    if (language !== "java") {
      return {
        slug,
        language,
        passed: false,
        error: "Non-Java verification requires --solutions-root",
      };
    }
    const markerPath = path.resolve(problemDir, "Marker.java");
    if (!fs.existsSync(markerPath)) {
      return { slug, language, passed: false, error: "Marker.java not found" };
    }
    const solutionDir = path.resolve(tempRoot, slug);
    fs.mkdirSync(solutionDir, { recursive: true });
    solutionPath = path.resolve(solutionDir, "Solution.java");
    fs.writeFileSync(
      solutionPath,
      convertMarkerToSolution(fs.readFileSync(markerPath, "utf8")),
    );
  }

  const result = {
    slug,
    language,
    passed: false,
    run: null,
    submit: null,
  };
  if (options.includeRun) {
    result.run = await runCommand(["run", slug, solutionPath]);
    if (
      result.run.code !== 0 ||
      result.run.signal ||
      /VERDICT:\s*FAIL|COMPILATION ERROR|RUNTIME ERROR|TIMED OUT/i.test(
        result.run.output,
      )
    ) {
      return result;
    }
  }

  result.submit = await runCommand(["submit", slug, solutionPath]);
  result.passed =
    result.submit.code === 0 &&
    !result.submit.signal &&
    /ACCEPTED/.test(result.submit.output);
  return result;
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function consume() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
      const status = results[index].passed ? "PASS" : "FAIL";
      console.log(
        `${status}: ${items[index].slug} [${items[index].language}]`,
      );
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, consume),
  );
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "cojudge-verify-"));
  const submissions = options.problems.flatMap((slug) =>
    options.languages.map((language) => ({ slug, language })),
  );

  try {
    const results = await runPool(
      submissions,
      options.concurrency,
      (item) => verifySubmission(item, options, tempRoot),
    );
    const failures = results.filter((result) => !result.passed);

    if (options.report) {
      fs.writeFileSync(options.report, `${JSON.stringify(results, null, 2)}\n`);
    }

    for (const failure of failures) {
      console.error(`\n=== ${failure.slug} [${failure.language}] ===`);
      if (failure.error) console.error(failure.error);
      if (failure.run && !failure.submit) console.error(failure.run.output);
      if (failure.submit) console.error(failure.submit.output);
    }

    console.log(
      `\nVerified ${results.length - failures.length}/${results.length} problems.`,
    );
    if (failures.length) process.exitCode = 1;
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
