import fs from 'node:fs/promises';

/**
 * In-memory cache of small content files (problem metadata, statements,
 * markers, course info), validated by `stat` on every lookup.
 *
 * The home page re-reads ~1000 `metadata.json` files and compares ~5000
 * user files against their bundled copies on every course-tab navigation.
 * Opening and reading a file is far more expensive than a `stat` — on
 * Windows especially, where real-time antivirus scans every file open — so
 * repeat navigations only `stat` and re-read just the files that changed.
 *
 * A file is re-read whenever its size, mtime, ctime or inode changes, so
 * edits made in an editor, by the CLI or by a reset are picked up on the
 * next lookup.
 */

type Entry = {
	size: number;
	mtimeMs: number;
	ctimeMs: number;
	ino: number;
	text: string;
	derived: Map<string, unknown>;
};

const cache = new Map<string, Entry>();
// Bounded so a huge custom content folder can't grow memory without limit.
const MAX_ENTRIES = 20_000;

async function load(filePath: string, immutable = false): Promise<Entry | null> {
	if (immutable) {
		const hit = cache.get(filePath);
		if (hit) return hit;
	}
	let stat;
	try {
		stat = await fs.stat(filePath);
	} catch {
		cache.delete(filePath);
		return null;
	}
	if (!stat.isFile()) {
		cache.delete(filePath);
		return null;
	}
	const hit = cache.get(filePath);
	if (
		hit &&
		hit.size === stat.size &&
		hit.mtimeMs === stat.mtimeMs &&
		hit.ctimeMs === stat.ctimeMs &&
		hit.ino === stat.ino
	) {
		return hit;
	}
	let text: string;
	try {
		text = await fs.readFile(filePath, 'utf-8');
	} catch {
		cache.delete(filePath);
		return null;
	}
	if (cache.size >= MAX_ENTRIES) cache.clear();
	const entry: Entry = {
		size: stat.size,
		mtimeMs: stat.mtimeMs,
		ctimeMs: stat.ctimeMs,
		ino: stat.ino,
		text,
		derived: new Map()
	};
	cache.set(filePath, entry);
	return entry;
}

/** File contents as UTF-8, or null when the file is missing/unreadable. */
export async function readTextCached(filePath: string): Promise<string | null> {
	return (await load(filePath))?.text ?? null;
}

/**
 * A value derived from the file's text (e.g. parsed JSON, normalised text),
 * recomputed only when the file changes. Returns null for a missing file.
 * `compute` must not mutate shared state; the result is shared between
 * callers, so treat it as read-only.
 * `immutable` skips the stat once the file is cached — only for files that
 * cannot change while the process runs (the bundled content of an install).
 * A missing file is never cached, so it is re-checked every time.
 */
export async function readDerivedCached<T>(
	filePath: string,
	key: string,
	compute: (text: string) => T,
	opts: { immutable?: boolean } = {}
): Promise<T | null> {
	const entry = await load(filePath, opts.immutable);
	if (!entry) return null;
	if (entry.derived.has(key)) return entry.derived.get(key) as T;
	const value = compute(entry.text);
	entry.derived.set(key, value);
	return value;
}

/** Drop everything (tests, or after bulk writes). */
export function clearTextFileCache(): void {
	cache.clear();
}
