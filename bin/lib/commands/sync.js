import fs from "fs";
import path from "path";
import {
  ensureUserContentSeededSync,
  getBundledCoursesDir,
  getBundledProblemsDir,
  getContentRoot,
  getCourseSourceSync,
  getProblemSourceSync,
  listCourseIdsSync,
  listProblemSlugsSync,
  resetCourseToBundledSync,
  resetProblemToBundledSync,
} from "../contentPaths.js";

function isBundledProblem(id) {
  try {
    return fs.statSync(path.join(getBundledProblemsDir(), id)).isDirectory();
  } catch {
    return false;
  }
}

function isBundledCourse(id) {
  try {
    return fs.statSync(path.join(getBundledCoursesDir(), id)).isDirectory();
  } catch {
    return false;
  }
}

function resetOne(target) {
  if (isBundledProblem(target)) {
    resetProblemToBundledSync(target);
    console.log(`Reset problem '${target}' to the bundled version.`);
    return true;
  }
  if (isBundledCourse(target)) {
    resetCourseToBundledSync(target);
    console.log(`Reset course '${target}' to the bundled version.`);
    return true;
  }
  console.error(`Error: no bundled problem or course named '${target}' to reset to.`);
  return false;
}

function resetAllModified() {
  const slugs = listProblemSlugsSync();
  const ids = listCourseIdsSync();
  let count = 0;
  for (const slug of slugs) {
    if (getProblemSourceSync(slug) !== "modified") continue;
    try {
      resetProblemToBundledSync(slug);
      console.log(`Reset problem '${slug}' to the bundled version.`);
      count++;
    } catch {}
  }
  for (const id of ids) {
    if (getCourseSourceSync(id) !== "modified") continue;
    try {
      resetCourseToBundledSync(id);
      console.log(`Reset course '${id}' to the bundled version.`);
      count++;
    } catch {}
  }
  console.log(count === 0 ? "Nothing to reset — no modified content." : `Reset ${count} item(s).`);
}

function printStatus() {
  console.log(`Content: ${getContentRoot()}`);
  const slugs = listProblemSlugsSync();
  const ids = listCourseIdsSync();
  const modifiedProblems = slugs.filter((s) => getProblemSourceSync(s) === "modified");
  const modifiedCourses = ids.filter((id) => getCourseSourceSync(id) === "modified");
  const customProblems = slugs.filter(
    (s) => getProblemSourceSync(s) === "custom" && !isBundledProblem(s),
  );
  const customCourses = ids.filter(
    (id) => getCourseSourceSync(id) === "custom" && !isBundledCourse(id),
  );
  const total = modifiedProblems.length + modifiedCourses.length;
  if (total === 0) {
    console.log("All bundled content is up to date. Unedited copies auto-update on new versions; your edits are never overwritten.");
  } else {
    console.log(
      `${total} item(s) differ from the bundled copy (your edits are preserved):`,
    );
    for (const s of modifiedProblems) console.log(`  problem  ${s}`);
    for (const id of modifiedCourses) console.log(`  course   ${id}`);
    console.log(
      "If you did not edit these, they are stale copies from an older version —",
    );
    console.log("reset them with `cojudge sync --reset <id>` (or `cojudge sync --reset --all`).");
  }
  const customTotal = customProblems.length + customCourses.length;
  if (customTotal > 0) {
    console.log(`Custom content (only in your folder): ${customTotal} item(s).`);
    for (const s of customProblems) console.log(`  problem  ${s}`);
    for (const id of customCourses) console.log(`  course   ${id}`);
  }
}

export function handleSync(args) {
  // Smart sync runs first: pristine copies auto-update, edits preserved.
  ensureUserContentSeededSync();
  const resetIdx = args.findIndex((a) => a === "--reset" || a === "--reset-all");
  if (args.includes("--reset-all")) {
    resetAllModified();
    return;
  }
  if (resetIdx !== -1) {
    const target = args[resetIdx + 1];
    if (!target || target.startsWith("-")) {
      if (target === "--all" || target === "all") {
        resetAllModified();
        return;
      }
      console.error("Usage: cojudge sync --reset <slug|course-id|--all>");
      process.exitCode = 1;
      return;
    }
    if (!resetOne(target)) process.exitCode = 1;
    return;
  }
  printStatus();
}
