import path from "path";
import fs from "fs";
import { rootDir, getParam } from "../utils.js";

export function handleInit(argsToUse) {
  const slug = argsToUse[1];
  if (!slug) {
    console.error("Usage: cojudge init <slug> [--lang <language>] [--output <filename>]");
    process.exit(1);
  }

  const problemsPath = path.join(rootDir, "problems", slug);
  if (!fs.existsSync(problemsPath)) {
    console.error(`Error: Problem slug '${slug}' not found.`);
    process.exit(1);
  }

  const metadataPath = path.join(problemsPath, "metadata.json");
  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch (e) {
    console.error(`Error: Could not read metadata for problem '${slug}'.`);
    process.exit(1);
  }

  const lang = getParam(argsToUse, "--lang");
  const availableLangs = Object.keys(metadata.starterCode || {});

  if (!lang) {
    console.log(`Please specify a language using --lang <language>`);
    console.log(`Available languages for '${slug}': ${availableLangs.join(", ")}`);
    process.exit(1);
  }

  const starterCode = metadata.starterCode && metadata.starterCode[lang];

  const extMap = {
    java: ".java",
    python: ".py",
    cpp: ".cpp",
    rust: ".rs",
    csharp: ".cs",
    go: ".go",
  };

  const extension = extMap[lang] || ".txt";
  let defaultFilename = `solution${extension}`;
  if (["java", "cpp", "csharp", "go"].includes(lang)) {
    defaultFilename = `Solution${extension}`;
  }
  const outputFilename = getParam(argsToUse, "--output") || defaultFilename;

  if (fs.existsSync(outputFilename)) {
    console.error(`Error: File '${outputFilename}' already exists. Refusing to overwrite.`);
    process.exit(1);
  }

  try {
    fs.writeFileSync(outputFilename, starterCode, "utf8");
    console.log(`Initialized '${slug}' in ${outputFilename}`);
  } catch (e) {
    console.error(`Error: Could not write to file '${outputFilename}': ${e.message}`);
    process.exit(1);
  }
}
