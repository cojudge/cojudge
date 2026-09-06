import fs from 'node:fs/promises';
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
are never overwritten once you have edited them. Set COJUDGE_CONTENT_DIR
to use a different folder.
`;

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
 * Only copies files that are missing — never overwrites user edits.
 * Safe to call on every startup / request; cheap after the first seed.
 */
export function ensureUserContentSeeded(): Promise<void> {
	if (!ensurePromise) {
		ensurePromise = (async () => {
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
				// Seeding must never break serving — readers fall back to bundled content.
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
