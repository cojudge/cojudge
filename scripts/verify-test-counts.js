#!/usr/bin/env node
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const DEFAULT_MIN_TESTS = 25;
const EXHAUSTIVE_DOMAIN_SIZES = {
  "n-queens-ii": 9,
};

function parseArgs(argv) {
  const options = {
    minTests: DEFAULT_MIN_TESTS,
    problems: [],
    report: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--min" || arg === "--min-tests") {
      options.minTests = Number(argv[++i]);
    } else if (arg === "--report") {
      options.report = path.resolve(rootDir, argv[++i]);
    } else {
      options.problems.push(arg);
    }
  }

  options.problems = [...new Set(options.problems)];
  if (!Number.isInteger(options.minTests) || options.minTests < 1) {
    throw new Error("--min must be a positive integer");
  }
  return options;
}

function resolveProblemsRoot() {
  const override =
    (process.env.COJUDGE_CONTENT_DIR || "").trim() ||
    (process.env.COJUDGE_HOME || "").trim();
  if (override) {
    const candidate = path.join(path.resolve(override), "problems");
    if (fs.existsSync(candidate)) return candidate;
  }
  const userRoot = path.join(os.homedir(), "cojudge", "problems");
  // Mirror verify-submissions.js: user copy overrides bundled content when
  // resolving individual problems, but discovery defaults to the repo copy
  // unless an explicit content-dir override is set.
  if (!override && fs.existsSync(userRoot)) return userRoot;
  return path.resolve(rootDir, "problems");
}

function resolveProblemDirForVerify(slug) {
  const override =
    (process.env.COJUDGE_CONTENT_DIR || "").trim() ||
    (process.env.COJUDGE_HOME || "").trim();
  const userRoot = override
    ? path.resolve(override)
    : path.join(os.homedir(), "cojudge");
  const userDir = path.join(userRoot, "problems", slug);
  if (fs.existsSync(userDir)) return userDir;
  return path.resolve(rootDir, "problems", slug);
}

function countOfficialTests(problemDir) {
  const testsPath = path.join(problemDir, "official-tests.json");
  if (!fs.existsSync(testsPath)) {
    return { count: 0, error: "official-tests.json not found" };
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(testsPath, "utf8"));
  } catch (error) {
    return { count: 0, error: `Invalid JSON: ${error.message}` };
  }
  if (!Array.isArray(parsed)) {
    return { count: 0, error: "official-tests.json must be a JSON array" };
  }
  return { count: parsed.length };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const problemsRoot = resolveProblemsRoot();
  const allSlugs = fs
    .readdirSync(problemsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const slugs = options.problems.length
    ? [...new Set(options.problems)]
    : allSlugs;

  const results = slugs.map((slug) => {
    const problemDir = resolveProblemDirForVerify(slug);
    if (!fs.existsSync(problemDir)) {
      const result = { slug, count: 0, passed: false, error: "Problem not found" };
      console.log(`FAIL: ${slug} (0/${options.minTests} tests) - Problem not found`);
      return result;
    }
    const { count, error } = countOfficialTests(problemDir);
    const requiredCount = Math.min(
      options.minTests,
      EXHAUSTIVE_DOMAIN_SIZES[slug] ?? options.minTests,
    );
    const passed = !error && count >= requiredCount;
    const result = { slug, count, requiredCount, passed };
    if (error) result.error = error;
    const status = passed ? "PASS" : "FAIL";
    const detail = error ? ` - ${error}` : "";
    console.log(`${status}: ${slug} (${count}/${requiredCount} tests)${detail}`);
    return result;
  });

  const failures = results.filter((result) => !result.passed);

  if (options.report) {
    fs.writeFileSync(options.report, `${JSON.stringify(results, null, 2)}\n`);
  }

  console.log(
    `\nVerified ${results.length - failures.length}/${results.length} problems have at least ${options.minTests} tests.`,
  );

  if (failures.length) {
    for (const failure of failures) {
      const reason = failure.error ?? `only ${failure.count} tests`;
      console.error(`- ${failure.slug}: ${reason}`);
    }
    throw new Error(
      `${failures.length} problem(s) have fewer than ${options.minTests} tests: ${failures.map((f) => f.slug).join(", ")}`,
    );
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
