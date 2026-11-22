/**
 * Cojudge problem-pack plugins. Shared by the CLI (`cojudge plugin ...`) and
 * the SvelteKit server (imported from src/lib/server/plugins.ts), so it must
 * stay dependency-free plain Node ESM.
 *
 * A plugin is a GitHub repo (or local folder) with, at its root:
 *   cojudge-plugin.json            { id, name, version, description?, minCojudge? }
 *   problems/<slug>/...            same layout as the bundled problems/
 *   courses/<course-id>/courseinfo.json
 * Courses may reference problems from the plugin itself or from core by slug.
 *
 * Installed plugins live in `<contentRoot>/plugins/<id>/` (override with
 * COJUDGE_PLUGINS_DIR) next to an `install.json` state file:
 *   { source, version, enabled, installedAt }
 *
 * Install sources: `owner/repo`, `github.com/owner/repo`,
 * `https://github.com/owner/repo[.git]`, optionally `@ref`, or a local path.
 * GitHub installs download the latest release tarball (else the default
 * branch tarball); private repos authenticate with GH_TOKEN / GITHUB_TOKEN,
 * else `gh auth token`. After install nothing needs the network.
 *
 * Lookup precedence: user edits in ~/cojudge > enabled plugins (by id) > bundled.
 */
import { execFileSync, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

export const MANIFEST = "cojudge-plugin.json";
export const STATE = "install.json";
export const DEFAULT_INDEX_URL =
  "https://raw.githubusercontent.com/cojudge/plugins/main/index.json";
const GITHUB_API = "https://api.github.com";
const MAX_TARBALL = 256 * 1024 * 1024;

function contentRoot() {
  const override =
    (process.env.COJUDGE_CONTENT_DIR || "").trim() ||
    (process.env.COJUDGE_HOME || "").trim();
  if (override) return path.resolve(override);
  return path.join(os.homedir(), "cojudge");
}

export function getPluginsDir() {
  const override = (process.env.COJUDGE_PLUGINS_DIR || "").trim();
  return override ? path.resolve(override) : path.join(contentRoot(), "plugins");
}

export function validId(id) {
  return typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,63}$/.test(id);
}

export function validateManifest(m) {
  if (!m || typeof m !== "object") throw new Error(`${MANIFEST} must be a JSON object`);
  if (!validId(m.id)) throw new Error(`${MANIFEST}: invalid id (lowercase letters, digits, dashes)`);
  if (typeof m.name !== "string" || !m.name.trim()) throw new Error(`${MANIFEST}: name is required`);
  if (typeof m.version !== "string" || !/^\d+\.\d+\.\d+([-+][\w.]+)?$/.test(m.version)) {
    throw new Error(`${MANIFEST}: version must be semver (e.g. 1.0.0)`);
  }
  return {
    id: m.id,
    name: m.name.trim().slice(0, 120),
    version: m.version,
    description: typeof m.description === "string" ? m.description.slice(0, 1000) : "",
    minCojudge: typeof m.minCojudge === "string" ? m.minCojudge : undefined,
    homepage: typeof m.homepage === "string" ? m.homepage : undefined,
  };
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** All installed plugins (valid manifest only), sorted by id. */
export function listInstalled() {
  const dir = getPluginsDir();
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory() || !validId(e.name)) continue;
    const root = path.join(dir, e.name);
    let manifest;
    try {
      manifest = validateManifest(readJson(path.join(root, MANIFEST)));
    } catch {
      continue;
    }
    if (manifest.id !== e.name) continue;
    const state = readJson(path.join(root, STATE)) || {};
    out.push({
      ...manifest,
      dir: root,
      source: typeof state.source === "string" ? state.source : "",
      enabled: state.enabled !== false,
      installedAt: typeof state.installedAt === "number" ? state.installedAt : 0,
    });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export function getInstalled(id) {
  return listInstalled().find((p) => p.id === id) || null;
}

function writeState(id, patch) {
  const file = path.join(getPluginsDir(), id, STATE);
  const prev = readJson(file) || {};
  fs.writeFileSync(file, JSON.stringify({ ...prev, ...patch }, null, 2) + "\n", "utf8");
}

export function setEnabled(id, enabled) {
  const p = getInstalled(id);
  if (!p) throw new Error(`Plugin '${id}' is not installed`);
  writeState(id, { enabled: !!enabled });
  return { ...p, enabled: !!enabled };
}

export function uninstall(id) {
  if (!validId(id)) throw new Error(`Invalid plugin id: ${id}`);
  const dir = path.join(getPluginsDir(), id);
  if (!fs.existsSync(dir)) throw new Error(`Plugin '${id}' is not installed`);
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  return { id };
}

/** Parse an install source. Returns {kind:'github', owner, repo, ref} or {kind:'local', path}. */
export function parseSource(src) {
  const s = String(src || "").trim();
  if (!s) throw new Error("Missing plugin source");
  const local = s.startsWith(".") || s.startsWith("/") || s.startsWith("~") || /^[A-Za-z]:[\\/]/.test(s);
  if (local || (fs.existsSync(s) && fs.statSync(s).isDirectory())) {
    const p = s.startsWith("~") ? path.join(os.homedir(), s.slice(1)) : s;
    return { kind: "local", path: path.resolve(p) };
  }
  let rest = s.replace(/^https?:\/\//i, "").replace(/^github\.com\//i, "");
  let ref;
  const at = rest.lastIndexOf("@");
  if (at > 0) {
    ref = rest.slice(at + 1);
    rest = rest.slice(0, at);
  }
  rest = rest.replace(/\.git$/i, "").replace(/\/+$/, "");
  const m = /^([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)$/.exec(rest);
  if (!m) throw new Error(`Unsupported plugin source: ${s} (use owner/repo, a GitHub URL, or a local path)`);
  if (ref !== undefined && !/^[A-Za-z0-9._\/-]+$/.test(ref)) throw new Error(`Invalid ref: ${ref}`);
  return { kind: "github", owner: m[1], repo: m[2], ref };
}

export function canonicalSource(parsed) {
  if (parsed.kind === "local") return parsed.path;
  return `${parsed.owner}/${parsed.repo}${parsed.ref ? `@${parsed.ref}` : ""}`;
}

let cachedToken;
function githubToken() {
  if (cachedToken !== undefined) return cachedToken;
  cachedToken = (process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "").trim() || null;
  if (!cachedToken) {
    try {
      const r = spawnSync("gh", ["auth", "token"], { encoding: "utf8", timeout: 5000 });
      if (r.status === 0 && r.stdout.trim()) cachedToken = r.stdout.trim();
    } catch {}
  }
  return cachedToken;
}

async function ghFetch(url, { json = true } = {}) {
  const headers = { "User-Agent": "cojudge-plugin-installer", Accept: json ? "application/vnd.github+json" : "*/*" };
  const tok = githubToken();
  if (tok) headers.Authorization = `Bearer ${tok}`;
  return fetch(url, { headers, redirect: "follow" });
}

/** Resolve a GitHub source to a tarball URL + label. */
async function resolveGithubTarball({ owner, repo, ref }) {
  const base = `${GITHUB_API}/repos/${owner}/${repo}`;
  if (ref) return { url: `${base}/tarball/${encodeURIComponent(ref)}`, label: ref };
  const rel = await ghFetch(`${base}/releases/latest`);
  if (rel.ok) {
    const data = await rel.json();
    if (data && data.tarball_url) return { url: data.tarball_url, label: data.tag_name || "latest" };
  } else if (rel.status !== 404) {
    throw new Error(`GitHub API error ${rel.status} for ${owner}/${repo}`);
  }
  const info = await ghFetch(base);
  if (!info.ok) throw new Error(`Repository ${owner}/${repo} not found (HTTP ${info.status})`);
  return { url: `${base}/tarball`, label: "default branch" };
}

async function downloadTo(url, file) {
  const res = await ghFetch(url, { json: false });
  if (!res.ok) throw new Error(`Download failed (HTTP ${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_TARBALL) throw new Error("Plugin archive too large");
  fs.writeFileSync(file, buf);
}

/** Reject symlinks / special files anywhere in the tree. */
function assertPlainTree(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) throw new Error(`Plugin contains a symlink: ${e.name}`);
    if (e.isDirectory()) assertPlainTree(p);
    else if (!e.isFile()) throw new Error(`Plugin contains a special file: ${e.name}`);
  }
}

/** Copy only manifest, problems/, courses/, README/LICENSE from a plugin tree. */
function stagePlugin(srcRoot, destRoot) {
  fs.mkdirSync(destRoot, { recursive: true });
  for (const name of [MANIFEST, "README.md", "LICENSE"]) {
    const p = path.join(srcRoot, name);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) fs.copyFileSync(p, path.join(destRoot, name));
  }
  for (const name of ["problems", "courses"]) {
    const p = path.join(srcRoot, name);
    if (fs.existsSync(p)) {
      assertPlainTree(p);
      fs.cpSync(p, path.join(destRoot, name), { recursive: true });
    }
  }
}

/**
 * Install (or upgrade, if already installed) a plugin. Keeps the existing
 * enabled flag on upgrade. Returns the installed entry.
 */
export async function install(src, { log = () => {} } = {}) {
  const parsed = parseSource(src);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cojudge-plugin-"));
  try {
    let srcRoot;
    if (parsed.kind === "local") {
      if (!fs.existsSync(path.join(parsed.path, MANIFEST))) {
        throw new Error(`No ${MANIFEST} in ${parsed.path}`);
      }
      srcRoot = parsed.path;
    } else {
      const { url, label } = await resolveGithubTarball(parsed);
      log(`Downloading ${parsed.owner}/${parsed.repo} (${label})...`);
      const tgz = path.join(tmp, "plugin.tar.gz");
      await downloadTo(url, tgz);
      const out = path.join(tmp, "x");
      fs.mkdirSync(out);
      // GNU/bsdtar both refuse absolute paths and `..` members by default;
      // symlinks are rejected after extraction by assertPlainTree.
      execFileSync("tar", ["-xzf", tgz, "-C", out], { stdio: "pipe" });
      const tops = fs.readdirSync(out);
      if (tops.length !== 1) throw new Error("Unexpected archive layout");
      srcRoot = path.join(out, tops[0]);
      if (!fs.existsSync(path.join(srcRoot, MANIFEST))) {
        throw new Error(`No ${MANIFEST} at the root of ${parsed.owner}/${parsed.repo}`);
      }
    }
    const manifest = validateManifest(readJson(path.join(srcRoot, MANIFEST)));
    const staged = path.join(tmp, "staged");
    stagePlugin(srcRoot, staged);

    const pluginsDir = getPluginsDir();
    fs.mkdirSync(pluginsDir, { recursive: true });
    const dest = path.join(pluginsDir, manifest.id);
    const prev = readJson(path.join(dest, STATE));
    fs.rmSync(dest, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    try {
      fs.renameSync(staged, dest);
    } catch {
      fs.cpSync(staged, dest, { recursive: true }); // cross-device tmp
    }
    writeState(manifest.id, {
      source: canonicalSource(parsed),
      version: manifest.version,
      enabled: prev ? prev.enabled !== false : true,
      installedAt: Date.now(),
    });
    return getInstalled(manifest.id);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

/** Re-install from the recorded source. */
export async function upgrade(id, opts) {
  const p = getInstalled(id);
  if (!p) throw new Error(`Plugin '${id}' is not installed`);
  if (!p.source) throw new Error(`Plugin '${id}' has no recorded source`);
  return install(p.source, opts);
}

/** Fetch the plugin catalog. Entries: {id, name, description, source, version}. */
export async function fetchCatalog() {
  const url = (process.env.COJUDGE_PLUGIN_INDEX || "").trim() || DEFAULT_INDEX_URL;
  let data;
  if (/^https?:\/\//.test(url)) {
    const res = await fetch(url, { headers: { "User-Agent": "cojudge-plugin-installer" } });
    if (!res.ok) throw new Error(`Could not fetch plugin index (HTTP ${res.status})`);
    data = await res.json();
  } else {
    data = readJson(path.resolve(url));
    if (!data) throw new Error(`Could not read plugin index ${url}`);
  }
  const list = Array.isArray(data) ? data : Array.isArray(data && data.plugins) ? data.plugins : [];
  const out = [];
  for (const e of list) {
    if (!e || !validId(e.id) || typeof e.source !== "string") continue;
    out.push({
      id: e.id,
      name: typeof e.name === "string" ? e.name : e.id,
      description: typeof e.description === "string" ? e.description : "",
      source: e.source,
      version: typeof e.version === "string" ? e.version : "",
      problems: typeof e.problems === "number" ? e.problems : undefined,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Problem ids
//
// Core problems (bundled or user-created) have bare ids: `two-sum`.
// Plugin problems are owned by their pack: `<plugin-id>/<slug>`, so two packs
// can both ship `two-sum` without clobbering each other. Packs migrated out of
// core (LeetCode 1000) set `"unprefixedIds": true` so their problems keep the
// bare ids existing progress / bookmarks / saved code are keyed by; core
// always wins a bare-id collision.
//
// User edits of a prefixed plugin problem live in
// `<contentRoot>/problems/@<plugin-id>/<slug>/` (the `@` keeps them apart
// from core slugs); edits of unprefixed ones in `problems/<slug>/` as before.
// ---------------------------------------------------------------------------

const SLUG_RE = /^[a-z0-9][a-z0-9_-]*$/i;

export function isValidSlug(s) {
  return typeof s === "string" && SLUG_RE.test(s);
}

/** Split an id into {pluginId|null, slug}, or null if malformed. */
export function parseProblemId(id) {
  if (typeof id !== "string") return null;
  const parts = id.split("/");
  if (parts.length === 1) return isValidSlug(id) ? { pluginId: null, slug: id } : null;
  if (parts.length === 2 && validId(parts[0]) && isValidSlug(parts[1])) {
    return { pluginId: parts[0], slug: parts[1] };
  }
  return null;
}

/** Enabled plugins with their content dirs and id mode, in precedence order. */
export function enabledPlugins() {
  return listInstalled()
    .filter((p) => p.enabled)
    .map((p) => {
      const raw = readJson(path.join(p.dir, MANIFEST)) || {};
      return {
        id: p.id,
        problems: path.join(p.dir, "problems"),
        courses: path.join(p.dir, "courses"),
        unprefixed: raw.unprefixedIds === true,
      };
    });
}

function subdirs(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && isValidSlug(e.name))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

/**
 * Candidate dirs for a problem id, most-preferred first: [user override,
 * ...base copies]. `base` (the last entry that exists) is what a user copy is
 * compared against for Modified badges. Returns null for malformed ids or
 * ids of plugins that are not installed+enabled.
 */
export function problemDirCandidates(id, { userProblemsDir, bundledProblemsDir, plugins = enabledPlugins() }) {
  const parsed = parseProblemId(id);
  if (!parsed) return null;
  if (parsed.pluginId) {
    const p = plugins.find((x) => x.id === parsed.pluginId);
    if (!p) return null;
    if (p.unprefixed) return null; // its problems are addressed by bare id
    return {
      user: path.join(userProblemsDir, `@${p.id}`, parsed.slug),
      bases: [path.join(p.problems, parsed.slug)],
    };
  }
  return {
    user: path.join(userProblemsDir, parsed.slug),
    bases: [
      path.join(bundledProblemsDir, parsed.slug),
      ...plugins.filter((p) => p.unprefixed).map((p) => path.join(p.problems, parsed.slug)),
    ],
  };
}

/** Every problem id visible: core + unprefixed plugin slugs + `<plugin>/<slug>`. */
export function listProblemIds({ userProblemsDir, bundledProblemsDir, plugins = enabledPlugins() }) {
  const ids = new Set([...subdirs(userProblemsDir), ...subdirs(bundledProblemsDir)]);
  for (const p of plugins) {
    for (const slug of subdirs(p.problems)) ids.add(p.unprefixed ? slug : `${p.id}/${slug}`);
  }
  return [...ids].sort();
}

/** All ids whose slug part equals `slug` (for CLI convenience lookups). */
export function findProblemIdsBySlug(slug, opts) {
  return listProblemIds(opts).filter((id) => id === slug || id.endsWith(`/${slug}`));
}

/**
 * Qualify a plugin course's problem references: a bare entry resolves to the
 * pack's own problem first, then core. Entries already containing `/` and
 * entries of unprefixed packs are kept as-is.
 */
export function qualifyCourseEntry(entry, plugin) {
  if (!plugin || plugin.unprefixed || entry.includes("/")) return entry;
  return fs.existsSync(path.join(plugin.problems, entry)) ? `${plugin.id}/${entry}` : entry;
}

/** The enabled plugin that ships course `courseId`, if any. */
export function pluginForCourse(courseId, plugins = enabledPlugins()) {
  return plugins.find((p) => fs.existsSync(path.join(p.courses, courseId, "courseinfo.json"))) || null;
}
