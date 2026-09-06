import fs from "fs";
import os from "os";
import path from "path";
import { rootDir } from "./utils.js";

/**
 * User-editable content lives in ~/cojudge (overridable via
 * COJUDGE_CONTENT_DIR / COJUDGE_HOME). Mirrors
 * src/lib/server/contentPaths.ts for the CLI.
 */

export function getContentRoot() {
  const override =
    (process.env.COJUDGE_CONTENT_DIR || "").trim() ||
    (process.env.COJUDGE_HOME || "").trim();
  if (override) return path.resolve(override);
  return path.join(os.homedir(), "cojudge");
}

export function getProblemsDir() {
  return path.join(getContentRoot(), "problems");
}

export function getCoursesDir() {
  return path.join(getContentRoot(), "courses");
}

export function getBundledProblemsDir() {
  return path.join(rootDir, "problems");
}

export function getBundledCoursesDir() {
  return path.join(rootDir, "courses");
}

/** Prefer the user copy; fall back to the bundled copy. */
export function resolveProblemDirSync(slug) {
  const userDir = path.join(getProblemsDir(), slug);
  if (fs.existsSync(userDir)) return userDir;
  return path.join(getBundledProblemsDir(), slug);
}

export function resolveProblemFileSync(slug, ...rest) {
  const userPath = path.join(getProblemsDir(), slug, ...rest);
  if (fs.existsSync(userPath)) return userPath;
  const bundledPath = path.join(getBundledProblemsDir(), slug, ...rest);
  if (fs.existsSync(bundledPath)) return bundledPath;
  return userPath;
}

export function resolveCourseFileSync(courseId, ...rest) {
  const userPath = path.join(getCoursesDir(), courseId, ...rest);
  if (fs.existsSync(userPath)) return userPath;
  const bundledPath = path.join(getBundledCoursesDir(), courseId, ...rest);
  if (fs.existsSync(bundledPath)) return bundledPath;
  return userPath;
}

/** Union of problem slugs from ~/cojudge and the bundled copy. */
export function listProblemSlugsSync() {
  const seen = new Set();
  for (const dir of [getProblemsDir(), getBundledProblemsDir()]) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) seen.add(entry.name);
      }
    } catch {}
  }
  return [...seen].sort();
}

function copyMissingRecursiveSync(src, dest) {
  let entries;
  try {
    entries = fs.readdirSync(src, { withFileTypes: true });
  } catch {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const destExists = fs.existsSync(destPath);
    if (entry.isDirectory()) {
      if (!destExists) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        copyMissingRecursiveSync(srcPath, destPath);
      }
    } else if (entry.isFile()) {
      if (!destExists) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const USER_README = `# CoJudge content

This folder is yours. CoJudge reads problems and courses from here first.

- \`problems/<slug>/\` — statement.md, metadata.json, official-tests.json, Marker.java, solution.md (optional), images
- \`courses/<course-id>/courseinfo.json\` — category order + problem lists

You can view, edit, add or delete anything here — changes take effect
immediately (no restart needed, just refresh the browser or re-run the CLI).

After you add a problem, verify it with the CoJudge CLI (Docker required):

\`\`\`bash
cojudge run <slug> Solution.py
cojudge submit <slug> Solution.py
\`\`\`

Missing files are seeded from the bundled CoJudge content on startup and
are never overwritten once you have edited them. Set COJUDGE_CONTENT_DIR
to use a different folder.
`;

/**
 * Seed ~/cojudge/problems and ~/cojudge/courses from the bundled content.
 * Only copies files that are missing — never overwrites user edits.
 */
export function ensureUserContentSeededSync() {
  try {
    const root = getContentRoot();
    fs.mkdirSync(path.join(root, "problems"), { recursive: true });
    fs.mkdirSync(path.join(root, "courses"), { recursive: true });
    copyMissingRecursiveSync(getBundledProblemsDir(), getProblemsDir());
    copyMissingRecursiveSync(getBundledCoursesDir(), getCoursesDir());
    const readmePath = path.join(root, "README.md");
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, USER_README, "utf8");
    }
  } catch {
    // Seeding must never break the CLI — readers fall back to bundled content.
  }
}
