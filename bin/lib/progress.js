import path from "path";
import fs from "fs";
import os from "os";
import { rootDir } from "./utils.js";

function getProgressFile() {
  const homeProgressFile = path.join(os.homedir(), ".cojudge", "progress.json");
  const localProgressFile = path.join(rootDir, ".cojudge_progress.json");

  if (fs.existsSync(localProgressFile) && !fs.existsSync(homeProgressFile)) {
    return localProgressFile;
  }

  const homeConfigDir = path.join(os.homedir(), ".cojudge");
  if (!fs.existsSync(homeConfigDir)) {
    try {
      fs.mkdirSync(homeConfigDir, { recursive: true });
    } catch (e) {
      return localProgressFile;
    }
  }

  return homeProgressFile;
}

export function loadProgress() {
  const progressFile = getProgressFile();
  if (fs.existsSync(progressFile)) {
    try {
      return JSON.parse(fs.readFileSync(progressFile, "utf8"));
    } catch (e) {
      return { solvedSlugs: [] };
    }
  }
  return { solvedSlugs: [] };
}

function saveProgress(progress) {
  const progressFile = getProgressFile();
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2), "utf8");
}

export function markProblem(slug, solvedValue) {
  const problemsPath = path.join(rootDir, "problems", slug);
  if (!fs.existsSync(problemsPath)) {
    console.error(`Error: Problem slug '${slug}' not found.`);
    return;
  }

  const progress = loadProgress();
  const solvedSet = new Set(progress.solvedSlugs || []);
  if (solvedValue) {
    solvedSet.add(slug);
    console.log(`Marked '${slug}' as solved.`);
  } else {
    solvedSet.delete(slug);
    console.log(`Unmarked '${slug}' as solved.`);
  }
  progress.solvedSlugs = Array.from(solvedSet);
  saveProgress(progress);
}
