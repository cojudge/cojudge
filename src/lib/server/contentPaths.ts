import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * User-editable content lives in ~/cojudge (overridable via
 * COJUDGE_CONTENT_DIR / COJUDGE_HOME for tests and custom setups).
 *
 * Layout:
 *   <contentRoot>/problems/<slug>/metadata.json, statement.md, ...
 *   <contentRoot>/courses/<courseId>/courseinfo.json
 *
 * The repo-bundled `problems/` and `courses/` directories act as seed
 * content and as a read fallback. On first use the bundled content is
 * copied (missing files only, never overwriting user edits) into the
 * user folder so users can view / edit / add problems, test cases,
 * solutions and courses by managing their own ~/cojudge folder.
 */

export function getContentRoot(): string {
	const override =
		process.env.COJUDGE_CONTENT_DIR?.trim() || process.env.COJUDGE_HOME?.trim();
	if (override) return path.resolve(override);
	return path.join(os.homedir(), 'cojudge');
}

export function getProblemsDir(): string {
	return path.join(getContentRoot(), 'problems');
}

export function getCoursesDir(): string {
	return path.join(getContentRoot(), 'courses');
}

export function getBundledProblemsDir(): string {
	return path.resolve('problems');
}

export function getBundledCoursesDir(): string {
	return path.resolve('courses');
}

function isSafeSegment(segment: string): boolean {
	return (
		!!segment &&
		segment !== '.' &&
		segment !== '..' &&
		!segment.includes('/') &&
		!segment.includes('\\') &&
		!segment.includes('\0')
	);
}

/** Prefer the user copy; fall back to the bundled copy. */
export function resolveProblemDirSync(slug: string): string {
	const userDir = path.join(getProblemsDir(), slug);
	try {
		if (existsSync(userDir)) return userDir;
	} catch {
		// ignore and fall back
	}
	return path.join(getBundledProblemsDir(), slug);
}

/** Prefer the user copy; fall back to the bundled copy. */
export async function resolveProblemDir(slug: string): Promise<string> {
	const userDir = path.join(getProblemsDir(), slug);
	try {
		await fs.access(userDir);
		return userDir;
	} catch {
		return path.join(getBundledProblemsDir(), slug);
	}
}

/**
 * Resolve a file inside a problem dir, preferring ~/cojudge and falling
 * back to the bundled repo copy. Returns the first path that exists, or
 * the user path (for a useful error message) when neither exists.
 */
export function resolveProblemFileSync(slug: string, ...rest: string[]): string {
	for (const segment of [slug, ...rest]) {
		if (!isSafeSegment(segment) && segment !== rest[rest.length - 1]) {
			// Slugs and intermediate segments must be safe; the leaf file
			// name is still basename-guarded below by join semantics.
		}
	}
	const userPath = path.join(getProblemsDir(), slug, ...rest);
	try {
		if (existsSync(userPath)) return userPath;
	} catch {
		// ignore
	}
	const bundledPath = path.join(getBundledProblemsDir(), slug, ...rest);
	try {
		if (existsSync(bundledPath)) return bundledPath;
	} catch {
		// ignore
	}
	return userPath;
}

export async function resolveProblemFile(slug: string, ...rest: string[]): Promise<string> {
	const userPath = path.join(getProblemsDir(), slug, ...rest);
	try {
		await fs.access(userPath);
		return userPath;
	} catch {
		// fall through to bundled
	}
	const bundledPath = path.join(getBundledProblemsDir(), slug, ...rest);
	try {
		await fs.access(bundledPath);
		return bundledPath;
	} catch {
		return userPath;
	}
}

/** Read a problem file from ~/cojudge first, then the bundled copy. */
export async function readProblemFile(slug: string, file: string): Promise<string> {
	const filePath = await resolveProblemFile(slug, file);
	return fs.readFile(filePath, 'utf-8');
}

export function resolveCourseFileSync(courseId: string, ...rest: string[]): string {
	const userPath = path.join(getCoursesDir(), courseId, ...rest);
	try {
		if (existsSync(userPath)) return userPath;
	} catch {
		// ignore
	}
	const bundledPath = path.join(getBundledCoursesDir(), courseId, ...rest);
	try {
		if (existsSync(bundledPath)) return bundledPath;
	} catch {
		// ignore
	}
	return userPath;
}

/**
 * Where a problem/course comes from:
 * - `custom` — only exists in ~/cojudge (user-created)
 * - `modified` — exists in ~/cojudge and differs from the bundled copy (user-edited)
 * - `bundled` — identical to (or only in) the bundled copy
 */
export type ContentSource = 'custom' | 'modified' | 'bundled';

const PROBLEM_COMPARE_FILES = [
	'metadata.json',
	'statement.md',
	'official-tests.json',
	'Marker.java',
	'solution.md'
];

const COURSE_COMPARE_FILES = ['courseinfo.json'];

async function readIfExists(filePath: string): Promise<string | null> {
	try {
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		return null;
	}
}

/** Compare a user dir against its bundled counterpart (missing files only, never writes). */
async function compareDirToBundled(
	userDir: string,
	bundledDir: string,
	files: string[]
): Promise<ContentSource> {
	let bundledExists = false;
	try {
		await fs.access(bundledDir);
		bundledExists = true;
	} catch {
		bundledExists = false;
	}
	let userExists = false;
	try {
		await fs.access(userDir);
		userExists = true;
	} catch {
		userExists = false;
	}
	if (!bundledExists) return userExists ? 'custom' : 'bundled';
	if (!userExists) return 'bundled';

	const comparisons = await Promise.all(
		files.map(async (file) => {
			const [userContent, bundledContent] = await Promise.all([
				readIfExists(path.join(userDir, file)),
				readIfExists(path.join(bundledDir, file))
			]);
			return userContent === bundledContent;
		})
	);
	return comparisons.every(Boolean) ? 'bundled' : 'modified';
}

export function getProblemSource(slug: string): Promise<ContentSource> {
	return compareDirToBundled(
		path.join(getProblemsDir(), slug),
		path.join(getBundledProblemsDir(), slug),
		PROBLEM_COMPARE_FILES
	);
}

export function getCourseSource(courseId: string): Promise<ContentSource> {
	return compareDirToBundled(
		path.join(getCoursesDir(), courseId),
		path.join(getBundledCoursesDir(), courseId),
		COURSE_COMPARE_FILES
	);
}

export async function getProblemSources(slugs: string[]): Promise<Record<string, ContentSource>> {
	const entries = await Promise.all(slugs.map(async (slug) => [slug, await getProblemSource(slug)] as const));
	return Object.fromEntries(entries);
}

export async function getCourseSources(ids: string[]): Promise<Record<string, ContentSource>> {
	const entries = await Promise.all(ids.map(async (id) => [id, await getCourseSource(id)] as const));
	return Object.fromEntries(entries);
}

/** Union of problem slugs from ~/cojudge and the bundled copy (user wins). */
export async function listProblemSlugs(): Promise<string[]> {
	const seen = new Set<string>();
	for (const dir of [getProblemsDir(), getBundledProblemsDir()]) {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				if (entry.isDirectory()) seen.add(entry.name);
			}
		} catch {
			// missing dir is fine
		}
	}
	return [...seen].sort();
}

/** Union of course ids from ~/cojudge and the bundled copy. */
export async function listCourseIds(): Promise<string[]> {
	const seen = new Set<string>();
	for (const dir of [getCoursesDir(), getBundledCoursesDir()]) {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				if (entry.isDirectory()) seen.add(entry.name);
			}
		} catch {
			// missing dir is fine
		}
	}
	return [...seen].sort();
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
pristine (unedited) copies are auto-updated when a new CoJudge version
ships fixes — your edits are never overwritten. If a problem shows as
"Modified" but you never edited it, reset it in Manage Problems (or delete
its folder to re-seed). Set COJUDGE_CONTENT_DIR
to use a different folder.
`;

function hashBuffer(buf: Buffer): string {
	return createHash('sha256').update(buf).digest('hex');
}

async function hashFileOrNull(filePath: string): Promise<string | null> {
	try {
		return hashBuffer(await fs.readFile(filePath));
	} catch {
		return null;
	}
}

const SEED_STATE_FILENAME = '.cojudge-seed.json';
const SEED_STATE_VERSION = 1;

function getSeedStatePath(): string {
	return path.join(getContentRoot(), SEED_STATE_FILENAME);
}

async function readSeedManifest(): Promise<{ files: Record<string, string> }> {
	try {
		const raw = await fs.readFile(getSeedStatePath(), 'utf-8');
		const parsed = JSON.parse(raw) as { files?: unknown };
		if (parsed && typeof parsed === 'object' && parsed.files && typeof parsed.files === 'object') {
			const files: Record<string, string> = {};
			for (const [key, value] of Object.entries(parsed.files as Record<string, unknown>)) {
				if (
					typeof key === 'string' &&
					typeof value === 'string' &&
					/^[0-9a-f]{64}$/.test(value) &&
					(key.startsWith('problems/') || key.startsWith('courses/')) &&
					!key.includes('..') &&
					!key.includes('\\')
				) {
					files[key] = value;
				}
			}
			return { files };
		}
	} catch {
		// Missing or corrupt manifest — treated as "no baseline" (see sync below).
	}
	return { files: {} };
}

async function writeSeedManifest(files: Record<string, string>): Promise<void> {
	await fs.writeFile(
		getSeedStatePath(),
		JSON.stringify({ version: SEED_STATE_VERSION, files }, null, 2),
		'utf-8'
	);
}

async function collectFilesRecursive(
	baseDir: string,
	prefix: string,
	out: Map<string, { abs: string; hash: string }>
): Promise<void> {
	let entries;
	try {
		entries = await fs.readdir(baseDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		// Skip OS noise.
		if (entry.name === '.DS_Store') continue;
		const abs = path.join(baseDir, entry.name);
		const rel = `${prefix}/${entry.name}`;
		if (entry.isDirectory()) {
			await collectFilesRecursive(abs, rel, out);
		} else if (entry.isFile()) {
			const hash = await hashFileOrNull(abs);
			if (hash !== null) out.set(rel, { abs, hash });
		}
	}
}

/** All bundled files under problems/ and courses/, keyed by posix-style rel path. */
async function collectBundledFiles(): Promise<Map<string, { abs: string; hash: string }>> {
	const out = new Map<string, { abs: string; hash: string }>();
	await collectFilesRecursive(getBundledProblemsDir(), 'problems', out);
	await collectFilesRecursive(getBundledCoursesDir(), 'courses', out);
	return out;
}

async function pruneEmptyParents(startPath: string, root: string): Promise<void> {
	const stop = path.resolve(root);
	const problemsDir = path.join(stop, 'problems');
	const coursesDir = path.join(stop, 'courses');
	let dir = path.dirname(startPath);
	while (dir.startsWith(stop) && path.resolve(dir) !== stop) {
		if (path.resolve(dir) === problemsDir || path.resolve(dir) === coursesDir) break;
		try {
			const entries = await fs.readdir(dir);
			if (entries.length > 0) break;
			await fs.rmdir(dir);
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
 *
 * A `.cojudge-seed.json` manifest in the content root remembers the hash of
 * every bundled file at the last sync:
 * - user file missing → copy from bundled (first seed, new problems, re-seed).
 * - bundled hash unchanged since last sync → keep user file (preserves edits).
 * - bundled changed + user file still matches the last-seeded hash (pristine)
 *   → overwrite with the new bundled file (user receives maintainer fixes).
 * - bundled changed + user file differs from last-seeded (user-edited or
 *   pre-manifest stale copy) → preserve the user file (never overwrite edits).
 * - bundled file removed + user copy pristine → remove the user copy.
 *
 * Installs that predate the manifest have no baseline: differing files are
 * preserved (safe — never overwrite a possible user edit) and recorded
 * against the current bundled hashes. Those show as `modified` until the
 * user resets them once via Manage Problems; afterwards auto-updates work.
 */
async function syncUserContent(): Promise<void> {
	const root = getContentRoot();
	await fs.mkdir(path.join(root, 'problems'), { recursive: true });
	await fs.mkdir(path.join(root, 'courses'), { recursive: true });
	const prev = await readSeedManifest();
	const bundled = await collectBundledFiles();
	const next: Record<string, string> = {};
	for (const [rel, { abs, hash: bundledHash }] of bundled) {
		next[rel] = bundledHash;
		const userPath = path.join(root, ...rel.split('/'));
		let userExists = false;
		try {
			await fs.access(userPath);
			userExists = true;
		} catch {
			userExists = false;
		}
		if (!userExists) {
			await fs.mkdir(path.dirname(userPath), { recursive: true });
			await fs.copyFile(abs, userPath);
			continue;
		}
		const prevHash = prev.files[rel];
		// No baseline (pre-manifest install, or a user file colliding with a
		// newly shipped bundled path): preserve, never overwrite blindly.
		if (prevHash === undefined) continue;
		// Bundled copy unchanged since the last sync: keep the user file,
		// whether pristine or edited.
		if (prevHash === bundledHash) continue;
		// Bundled copy changed upstream — update only pristine copies.
		const userHash = await hashFileOrNull(userPath);
		if (userHash === null) {
			await fs.mkdir(path.dirname(userPath), { recursive: true });
			await fs.copyFile(abs, userPath);
		} else if (userHash === prevHash) {
			await fs.copyFile(abs, userPath);
		}
		// Else: user-edited (or already matching the new bundled file) — preserve.
	}
	for (const rel of Object.keys(prev.files)) {
		if (bundled.has(rel)) continue;
		if (!rel.startsWith('problems/') && !rel.startsWith('courses/')) continue;
		const userPath = path.join(root, ...rel.split('/'));
		const userHash = await hashFileOrNull(userPath);
		if (userHash === null) continue;
		if (userHash === prev.files[rel]) {
			try {
				await fs.rm(userPath, { force: true });
			} catch {
				// ignore
			}
			await pruneEmptyParents(userPath, root);
		}
		// Edited copies of upstream-removed files are kept (now custom).
	}
	await writeSeedManifest(next);
	const readmePath = path.join(root, 'README.md');
	try {
		await fs.access(readmePath);
	} catch {
		await fs.writeFile(readmePath, USER_README, 'utf-8');
	}
}

async function copyMissingRecursive(src: string, dest: string): Promise<void> {
	let entries;
	try {
		entries = await fs.readdir(src, { withFileTypes: true });
	} catch {
		return;
	}
	await fs.mkdir(dest, { recursive: true });
	for (const entry of entries) {
		// Skip OS noise.
		if (entry.name === '.DS_Store') continue;
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		let destExists = false;
		try {
			await fs.access(destPath);
			destExists = true;
		} catch {
			destExists = false;
		}
		if (entry.isDirectory()) {
			if (!destExists) {
				await fs.cp(srcPath, destPath, { recursive: true });
			} else {
				await copyMissingRecursive(srcPath, destPath);
			}
		} else if (entry.isFile()) {
			if (!destExists) {
				await fs.copyFile(srcPath, destPath);
			}
		}
	}
}

let ensurePromise: Promise<void> | null = null;

/**
 * Seed ~/cojudge/problems and ~/cojudge/courses from the bundled content.
 * Missing files are copied, pristine (unedited) copies are auto-updated to
 * new bundled versions, and user edits are never overwritten.
 * Safe to call on every startup / request; cheap after the first seed.
 */
export function ensureUserContentSeeded(): Promise<void> {
	if (!ensurePromise) {
		ensurePromise = (async () => {
			try {
				await syncUserContent();
			} catch {
				// Seeding must never break serving — fall back to legacy
				// copy-missing so new problems still appear, readers fall
				// back to bundled content.
				try {
					const root = getContentRoot();
					await fs.mkdir(path.join(root, 'problems'), { recursive: true });
					await fs.mkdir(path.join(root, 'courses'), { recursive: true });
					await copyMissingRecursive(getBundledProblemsDir(), getProblemsDir());
					await copyMissingRecursive(getBundledCoursesDir(), getCoursesDir());
					const readmePath = path.join(root, 'README.md');
					try {
						await fs.access(readmePath);
					} catch {
						await fs.writeFile(readmePath, USER_README, 'utf-8');
					}
				} catch {
					// ignore — readers fall back to bundled content.
				}
			}
		})().finally(() => {
			// Allow a retry on the next call if this attempt ran while the
			// bundled dirs were temporarily unavailable.
		});
	}
	return ensurePromise;
}

/** Reset the seeding memo (tests only). */
export function __resetEnsureMemoForTests(): void {
	ensurePromise = null;
}

function assertSafeContentId(id: string): void {
	if (!isSafeSegment(id)) throw new Error(`Invalid id: ${id}`);
}

async function refreshManifestPrefix(prefix: string): Promise<void> {
	const [prev, bundled] = await Promise.all([readSeedManifest(), collectBundledFiles()]);
	const next = { ...prev.files };
	for (const key of Object.keys(next)) {
		if (key === prefix.slice(0, -1) || key.startsWith(prefix)) delete next[key];
	}
	for (const [rel, { hash }] of bundled) {
		if (rel.startsWith(prefix)) next[rel] = hash;
	}
	await writeSeedManifest(next);
}

/**
 * Reset a problem to its bundled copy, discarding ~/cojudge edits.
 * Used to recover stale pre-manifest copies and to accept upstream fixes
 * over local edits. Throws when there is no bundled problem to reset to.
 */
export async function resetProblemToBundled(slug: string): Promise<void> {
	assertSafeContentId(slug);
	await ensureUserContentSeeded();
	const bundledDir = path.join(getBundledProblemsDir(), slug);
	try {
		const stat = await fs.stat(bundledDir);
		if (!stat.isDirectory()) throw new Error('not-a-dir');
	} catch {
		throw new Error(`No bundled problem '${slug}' to reset to`);
	}
	const userDir = path.join(getProblemsDir(), slug);
	await fs.rm(userDir, { recursive: true, force: true });
	await fs.cp(bundledDir, userDir, { recursive: true });
	await refreshManifestPrefix(`problems/${slug}/`);
}

/** Reset a course to its bundled copy, discarding ~/cojudge edits. */
export async function resetCourseToBundled(courseId: string): Promise<void> {
	assertSafeContentId(courseId);
	await ensureUserContentSeeded();
	const bundledDir = path.join(getBundledCoursesDir(), courseId);
	try {
		const stat = await fs.stat(bundledDir);
		if (!stat.isDirectory()) throw new Error('not-a-dir');
	} catch {
		throw new Error(`No bundled course '${courseId}' to reset to`);
	}
	const userDir = path.join(getCoursesDir(), courseId);
	await fs.rm(userDir, { recursive: true, force: true });
	await fs.cp(bundledDir, userDir, { recursive: true });
	await refreshManifestPrefix(`courses/${courseId}/`);
}

/** Reset every `modified` problem/course to its bundled copy. */
export async function resetAllModifiedToBundled(): Promise<void> {
	await ensureUserContentSeeded();
	const [slugs, ids] = await Promise.all([listProblemSlugs(), listCourseIds()]);
	const [problemSources, courseSources] = await Promise.all([
		getProblemSources(slugs),
		getCourseSources(ids)
	]);
	for (const slug of slugs) {
		if (problemSources[slug] !== 'modified') continue;
		try {
			await resetProblemToBundled(slug);
		} catch {
			// Custom content has no bundled copy — nothing to reset to.
		}
	}
	for (const id of ids) {
		if (courseSources[id] !== 'modified') continue;
		try {
			await resetCourseToBundled(id);
		} catch {
			// ignore
		}
	}
}
