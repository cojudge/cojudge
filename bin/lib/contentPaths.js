import crypto from "crypto";
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

/** Union of course ids from ~/cojudge and the bundled copy. */
export function listCourseIdsSync() {
  const seen = new Set();
  for (const dir of [getCoursesDir(), getBundledCoursesDir()]) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) seen.add(entry.name);
      }
    } catch {}
  }
  return [...seen].sort();
}

function hashBuffer(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function hashFileOrNullSync(filePath) {
  try {
    return hashBuffer(fs.readFileSync(filePath));
  } catch {
    return null;
  }
}

const SEED_STATE_FILENAME = ".cojudge-seed.json";
const SEED_STATE_VERSION = 2;

// See STAT_CACHE_RACY_WINDOW_MS in src/lib/server/contentPaths.ts: a cached
// bundled hash is only trusted for files last modified well before the scan
// that recorded it.
const STAT_CACHE_RACY_WINDOW_MS = 2000;

function getSeedStatePath() {
  return path.join(getContentRoot(), SEED_STATE_FILENAME);
}

function isManifestKey(key) {
  return (
    (key.startsWith("problems/") || key.startsWith("courses/")) &&
    !key.includes("..") &&
    !key.includes("\\")
  );
}

function readSeedManifestSync() {
  try {
    const raw = fs.readFileSync(getSeedStatePath(), "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.files && typeof parsed.files === "object") {
      const files = {};
      for (const [key, value] of Object.entries(parsed.files)) {
        if (typeof value === "string" && /^[0-9a-f]{64}$/.test(value) && isManifestKey(key)) {
          files[key] = value;
        }
      }
      const stats = {};
      if (parsed.stats && typeof parsed.stats === "object") {
        for (const [key, value] of Object.entries(parsed.stats)) {
          if (typeof value === "string" && /^\d+:[\d.]+$/.test(value) && isManifestKey(key)) {
            stats[key] = value;
          }
        }
      }
      const scannedAt =
        typeof parsed.scannedAt === "number" && Number.isFinite(parsed.scannedAt)
          ? parsed.scannedAt
          : 0;
      return { files, stats, scannedAt, raw };
    }
  } catch {
    // Missing or corrupt manifest — treated as "no baseline".
  }
  return { files: {}, stats: {}, scannedAt: 0, raw: null };
}

function serializeSeedManifest(files, bundled, scannedAt) {
  const sortedFiles = {};
  for (const rel of Object.keys(files).sort()) sortedFiles[rel] = files[rel];
  // A stat is only a valid cache key for the hash it was taken with.
  const stats = {};
  for (const rel of [...bundled.keys()].sort()) {
    const file = bundled.get(rel);
    if (files[rel] === file.hash) stats[rel] = file.sig;
  }
  return JSON.stringify(
    { version: SEED_STATE_VERSION, scannedAt, files: sortedFiles, stats },
    null,
    2,
  );
}

function writeSeedManifestSync(prev, files, scan) {
  // Steady state: every hash came from the cache and nothing changed.
  if (
    scan.hashed === 0 &&
    prev.raw !== null &&
    serializeSeedManifest(files, scan.files, prev.scannedAt) === prev.raw
  ) {
    return;
  }
  fs.writeFileSync(
    getSeedStatePath(),
    serializeSeedManifest(files, scan.files, scan.scannedAt),
    "utf8",
  );
}

function collectFilesRecursiveSync(baseDir, prefix, prev, scan) {
  let entries;
  try {
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const abs = path.join(baseDir, entry.name);
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      collectFilesRecursiveSync(abs, rel, prev, scan);
    } else if (entry.isFile()) {
      let stat;
      try {
        stat = fs.statSync(abs);
      } catch {
        continue;
      }
      const sig = `${stat.size}:${stat.mtimeMs}`;
      // Reuse the recorded hash when the file provably has not changed:
      // opening every file is the slow part of a start on Windows.
      const cached = prev.files[rel];
      if (
        cached !== undefined &&
        prev.stats[rel] === sig &&
        stat.mtimeMs < prev.scannedAt - STAT_CACHE_RACY_WINDOW_MS
      ) {
        scan.files.set(rel, { abs, hash: cached, sig });
        continue;
      }
      scan.hashed++;
      const hash = hashFileOrNullSync(abs);
      if (hash !== null) scan.files.set(rel, { abs, hash, sig });
    }
  }
}

/** All bundled files under problems/ and courses/, keyed by posix-style rel path. */
function collectBundledFilesSync(prev) {
  const scan = { files: new Map(), scannedAt: Date.now(), hashed: 0 };
  collectFilesRecursiveSync(getBundledProblemsDir(), "problems", prev, scan);
  collectFilesRecursiveSync(getBundledCoursesDir(), "courses", prev, scan);
  return scan;
}

/** Every entry (file or dir) under the user's problems/ and courses/, as rel paths. */
function collectUserEntriesSync(root) {
  const out = new Set();
  const walk = (dir, prefix) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = `${prefix}/${entry.name}`;
      out.add(rel);
      if (entry.isDirectory()) walk(path.join(dir, entry.name), rel);
    }
  };
  walk(path.join(root, "problems"), "problems");
  walk(path.join(root, "courses"), "courses");
  return out;
}

function pruneEmptyParentsSync(startPath, root) {
  const stop = path.resolve(root);
  const problemsDir = path.join(stop, "problems");
  const coursesDir = path.join(stop, "courses");
  let dir = path.dirname(startPath);
  while (dir.startsWith(stop) && path.resolve(dir) !== stop) {
    if (path.resolve(dir) === problemsDir || path.resolve(dir) === coursesDir) break;
    try {
      if (fs.readdirSync(dir).length > 0) break;
      fs.rmdirSync(dir);
    } catch {
      break;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}

/**
 * Smart sync: seed missing files AND auto-update pristine (unedited) copies
 * when the bundled content changed, without ever overwriting user edits.
 * Mirrors syncUserContent() in src/lib/server/contentPaths.ts.
 */
function syncUserContentSync() {
  const root = getContentRoot();
  fs.mkdirSync(path.join(root, "problems"), { recursive: true });
  fs.mkdirSync(path.join(root, "courses"), { recursive: true });
  const prev = readSeedManifestSync();
  const scan = collectBundledFilesSync(prev);
  const bundled = scan.files;
  const userEntries = collectUserEntriesSync(root);
  const next = {};
  for (const [rel, { abs, hash: bundledHash }] of bundled) {
    next[rel] = bundledHash;
    const userPath = path.join(root, ...rel.split("/"));
    if (!userEntries.has(rel)) {
      fs.mkdirSync(path.dirname(userPath), { recursive: true });
      fs.copyFileSync(abs, userPath);
      continue;
    }
    const prevHash = prev.files[rel];
    // No baseline (pre-manifest install, or a user file colliding with a
    // newly shipped bundled path): preserve, never overwrite blindly.
    if (prevHash === undefined) continue;
    // Bundled copy unchanged since the last sync: keep the user file.
    if (prevHash === bundledHash) continue;
    // Bundled copy changed upstream — update only pristine copies.
    const userHash = hashFileOrNullSync(userPath);
    if (userHash === null) {
      fs.mkdirSync(path.dirname(userPath), { recursive: true });
      fs.copyFileSync(abs, userPath);
    } else if (userHash === prevHash) {
      fs.copyFileSync(abs, userPath);
    }
    // Else: user-edited (or already matching the new bundled file) — preserve.
  }
  for (const rel of Object.keys(prev.files)) {
    if (bundled.has(rel)) continue;
    if (!rel.startsWith("problems/") && !rel.startsWith("courses/")) continue;
    const userPath = path.join(root, ...rel.split("/"));
    const userHash = hashFileOrNullSync(userPath);
    if (userHash === null) continue;
    if (userHash === prev.files[rel]) {
      try {
        fs.rmSync(userPath, { force: true });
      } catch {}
      pruneEmptyParentsSync(userPath, root);
    }
    // Edited copies of upstream-removed files are kept (now custom).
  }
  writeSeedManifestSync(prev, next, scan);
  const readmePath = path.join(root, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, USER_README, "utf8");
  }
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

let seededThisProcess = false;

const USER_README = `# Cojudge content

This folder is yours. Cojudge reads problems and courses from here first.

- \`problems/<slug>/\` — statement.md, metadata.json, official-tests.json, Marker.java, solution.md (optional), images
- \`courses/<course-id>/courseinfo.json\` — category order + problem lists

You can view, edit, add or delete anything here — changes take effect
immediately (no restart needed, just refresh the browser or re-run the CLI).

After you add a problem, verify it with the Cojudge CLI (Docker required):

\`\`\`bash
cojudge run <slug> Solution.py
cojudge submit <slug> Solution.py
\`\`\`

Missing files are seeded from the bundled Cojudge content on startup and
pristine (unedited) copies are auto-updated when a new Cojudge version
ships fixes — your edits are never overwritten. If a problem shows as
"Modified" but you never edited it, reset it with \`cojudge sync --reset
<slug>\` (or delete its folder to re-seed). Set COJUDGE_CONTENT_DIR
to use a different folder.
`;

/**
 * Seed ~/cojudge/problems and ~/cojudge/courses from the bundled content.
 * Missing files are copied, pristine copies are auto-updated to new bundled
 * versions, and user edits are never overwritten.
 */
export function ensureUserContentSeededSync() {
  // Commands call this at entry and again when they auto-start the server;
  // one sync per CLI process is enough (resets refresh the manifest themselves).
  if (seededThisProcess) return;
  seededThisProcess = true;
  try {
    syncUserContentSync();
  } catch {
    // Seeding must never break the CLI — fall back to legacy copy-missing.
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
      // Readers fall back to bundled content.
    }
  }
}

function isSafeId(id) {
  return (
    !!id &&
    id !== "." &&
    id !== ".." &&
    !id.includes("/") &&
    !id.includes("\\") &&
    !id.includes("\0")
  );
}

function refreshManifestPrefixSync(prefix) {
  const prev = readSeedManifestSync();
  const scan = collectBundledFilesSync(prev);
  const next = { ...prev.files };
  for (const key of Object.keys(next)) {
    if (key === prefix.slice(0, -1) || key.startsWith(prefix)) delete next[key];
  }
  for (const [rel, { hash }] of scan.files) {
    if (rel.startsWith(prefix)) next[rel] = hash;
  }
  writeSeedManifestSync(prev, next, scan);
}

/** Reset a problem to its bundled copy, discarding ~/cojudge edits. */
export function resetProblemToBundledSync(slug) {
  if (!isSafeId(slug)) throw new Error(`Invalid slug: ${slug}`);
  ensureUserContentSeededSync();
  const bundledDir = path.join(getBundledProblemsDir(), slug);
  if (!fs.existsSync(bundledDir) || !fs.statSync(bundledDir).isDirectory()) {
    throw new Error(`No bundled problem '${slug}' to reset to`);
  }
  const userDir = path.join(getProblemsDir(), slug);
  fs.rmSync(userDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  fs.cpSync(bundledDir, userDir, { recursive: true });
  refreshManifestPrefixSync(`problems/${slug}/`);
}

/** Reset a course to its bundled copy, discarding ~/cojudge edits. */
export function resetCourseToBundledSync(courseId) {
  if (!isSafeId(courseId)) throw new Error(`Invalid course id: ${courseId}`);
  ensureUserContentSeededSync();
  const bundledDir = path.join(getBundledCoursesDir(), courseId);
  if (!fs.existsSync(bundledDir) || !fs.statSync(bundledDir).isDirectory()) {
    throw new Error(`No bundled course '${courseId}' to reset to`);
  }
  const userDir = path.join(getCoursesDir(), courseId);
  fs.rmSync(userDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  fs.cpSync(bundledDir, userDir, { recursive: true });
  refreshManifestPrefixSync(`courses/${courseId}/`);
}

function readIfExistsSync(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function compareDirToBundledSync(userDir, bundledDir, files) {
  const bundledExists = fs.existsSync(bundledDir);
  const userExists = fs.existsSync(userDir);
  if (!bundledExists) return userExists ? "custom" : "bundled";
  if (!userExists) return "bundled";
  // Line-ending-agnostic: the Windows desktop bundle is CRLF (core.autocrlf
  // checkout) while user copies are often LF. Mirrors the server comparison.
  const normalizeEol = (text) => (text === null ? null : text.replace(/\r\n/g, "\n"));
  return files.every(
    (file) =>
      normalizeEol(readIfExistsSync(path.join(userDir, file))) ===
      normalizeEol(readIfExistsSync(path.join(bundledDir, file))),
  )
    ? "bundled"
    : "modified";
}

const PROBLEM_COMPARE_FILES = [
  "metadata.json",
  "statement.md",
  "official-tests.json",
  "Marker.java",
  "solution.md",
];

const COURSE_COMPARE_FILES = ["courseinfo.json"];

/** Where a problem comes from: custom (user-only), modified, or bundled. */
export function getProblemSourceSync(slug) {
  return compareDirToBundledSync(
    path.join(getProblemsDir(), slug),
    path.join(getBundledProblemsDir(), slug),
    PROBLEM_COMPARE_FILES,
  );
}

/** Where a course comes from: custom (user-only), modified, or bundled. */
export function getCourseSourceSync(courseId) {
  return compareDirToBundledSync(
    path.join(getCoursesDir(), courseId),
    path.join(getBundledCoursesDir(), courseId),
    COURSE_COMPARE_FILES,
  );
}
