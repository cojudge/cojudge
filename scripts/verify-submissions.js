#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const PROBLEMS_TO_TEST = [
  "two-sum",
  "valid-anagram",
  "maximum-subarray",
  "reverse-linked-list",
  "maximum-depth-of-binary-tree",
  "climbing-stairs",
  "number-of-islands",
];

function convertMarkerToSolution(markerCode) {
  const lines = markerCode.split("\n");
  const result = [];
  let inIsCorrect = false;
  let braceDepth = 0;

  for (const line of lines) {
    if (!inIsCorrect && /^\s*public\s+boolean\s+isCorrect\s*\(/.test(line)) {
      inIsCorrect = true;
      braceDepth = 0;
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      continue;
    }

    if (inIsCorrect) {
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth <= 0) {
        inIsCorrect = false;
      }
      continue;
    }

    result.push(line.replace("class Marker", "class Solution"));
  }

  return result.join("\n");
}

function main() {
  const cojudgeBin = path.resolve(rootDir, "bin", "cojudge");
  const problemsDir = path.resolve(rootDir, "problems");
  let allPassed = true;

  for (const slug of PROBLEMS_TO_TEST) {
    const problemDir = path.resolve(problemsDir, slug);
    const markerPath = path.resolve(problemDir, "Marker.java");

    if (!fs.existsSync(markerPath)) {
      console.error(`SKIP: ${slug} - Marker.java not found`);
      continue;
    }

    const markerCode = fs.readFileSync(markerPath, "utf-8");
    const solutionCode = convertMarkerToSolution(markerCode);

    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `cojudge-verify-${slug}-`),
    );
    const solutionPath = path.join(tmpDir, "Solution.java");
    fs.writeFileSync(solutionPath, solutionCode);

    console.log(`\n=== Testing ${slug} ===`);

    try {
      execSync(`node ${cojudgeBin} submit ${slug} ${solutionPath}`, {
        stdio: "inherit",
        timeout: 120000,
        cwd: rootDir,
      });
      console.log(`PASS: ${slug}`);
    } catch (e) {
      console.error(`FAIL: ${slug}`);
      allPassed = false;
    }

    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  if (!allPassed) {
    console.error("\nSome submissions failed!");
    process.exit(1);
  }
  console.log("\nAll submissions verified successfully!");
}

main();
