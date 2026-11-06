import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearTextFileCache, readDerivedCached, readTextCached } from './textFileCache';

describe('textFileCache', () => {
	let dir: string;

	beforeEach(async () => {
		dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-textcache-'));
		clearTextFileCache();
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		clearTextFileCache();
		await fs.rm(dir, { recursive: true, force: true });
	});

	it('reads a file once and serves repeats from a stat check only', async () => {
		const file = path.join(dir, 'metadata.json');
		await fs.writeFile(file, '{"id":"a"}');
		const readSpy = vi.spyOn(fs, 'readFile');

		expect(await readTextCached(file)).toBe('{"id":"a"}');
		expect(await readTextCached(file)).toBe('{"id":"a"}');
		expect(readSpy).toHaveBeenCalledTimes(1);
	});

	it('re-reads after the file changes, and returns null once it is removed', async () => {
		const file = path.join(dir, 'statement.md');
		await fs.writeFile(file, 'one');
		expect(await readTextCached(file)).toBe('one');

		await fs.writeFile(file, 'two, longer');
		expect(await readTextCached(file)).toBe('two, longer');

		// Same size, different content: caught by mtime/ctime.
		const later = new Date(Date.now() + 5000);
		await fs.writeFile(file, 'TWO, LONGER');
		await fs.utimes(file, later, later);
		expect(await readTextCached(file)).toBe('TWO, LONGER');

		await fs.rm(file);
		expect(await readTextCached(file)).toBeNull();
	});

	it('caches derived values per file and recomputes them on change', async () => {
		const file = path.join(dir, 'Marker.java');
		await fs.writeFile(file, 'a\r\nb\r\n');
		const compute = vi.fn((text: string) => text.replace(/\r\n/g, '\n'));

		expect(await readDerivedCached(file, 'eol', compute)).toBe('a\nb\n');
		expect(await readDerivedCached(file, 'eol', compute)).toBe('a\nb\n');
		expect(compute).toHaveBeenCalledTimes(1);

		await fs.writeFile(file, 'a\nb\nc\n');
		expect(await readDerivedCached(file, 'eol', compute)).toBe('a\nb\nc\n');
		expect(compute).toHaveBeenCalledTimes(2);
		expect(await readDerivedCached(path.join(dir, 'missing'), 'eol', compute)).toBeNull();
	});

	it('immutable files skip the stat once cached', async () => {
		const file = path.join(dir, 'bundled.json');
		await fs.writeFile(file, 'v1');
		const statSpy = vi.spyOn(fs, 'stat');

		expect(await readDerivedCached(file, 'raw', (t) => t, { immutable: true })).toBe('v1');
		const statsAfterFirst = statSpy.mock.calls.length;
		expect(await readDerivedCached(file, 'raw', (t) => t, { immutable: true })).toBe('v1');
		expect(statSpy.mock.calls.length).toBe(statsAfterFirst);
	});
});
