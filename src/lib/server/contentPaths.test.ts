import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('contentPaths', () => {
	let tmpRoot: string;
	let bundledRoot: string;
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(async () => {
		tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-content-'));
		bundledRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-bundled-'));
		originalEnv = { ...process.env };
		process.env.COJUDGE_CONTENT_DIR = path.join(tmpRoot, 'user');
		vi.resetModules();
	});

	afterEach(async () => {
		process.env = originalEnv;
		vi.resetModules();
		const { __resetEnsureMemoForTests } = await import('./contentPaths');
		__resetEnsureMemoForTests();
		await fs.rm(tmpRoot, { recursive: true, force: true });
		await fs.rm(bundledRoot, { recursive: true, force: true });
	});

	it('prefers user content over bundled content', async () => {
		const mod = await import('./contentPaths');
		expect(mod.getContentRoot()).toBe(path.join(tmpRoot, 'user'));
		expect(mod.getProblemsDir()).toBe(path.join(tmpRoot, 'user', 'problems'));
		expect(mod.getCoursesDir()).toBe(path.join(tmpRoot, 'user', 'courses'));
	});

	it('resolveProblemFileSync prefers user file then falls back to bundled', async () => {
		// Point CWD at the fake bundled root for this test.
		const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(bundledRoot);
		try {
			await fs.mkdir(path.join(bundledRoot, 'problems', 'two-sum'), { recursive: true });
			await fs.writeFile(
				path.join(bundledRoot, 'problems', 'two-sum', 'metadata.json'),
				'{"id":"two-sum"}'
			);

			const mod = await import('./contentPaths');

			// No user file yet -> bundled.
			expect(mod.resolveProblemFileSync('two-sum', 'metadata.json')).toBe(
				path.join(bundledRoot, 'problems', 'two-sum', 'metadata.json')
			);

			// After user override -> user wins.
			await fs.mkdir(path.join(tmpRoot, 'user', 'problems', 'two-sum'), { recursive: true });
			await fs.writeFile(
				path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'),
				'{"id":"two-sum","edited":true}'
			);
			expect(mod.resolveProblemFileSync('two-sum', 'metadata.json')).toBe(
				path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json')
			);
		} finally {
			cwdSpy.mockRestore();
		}
	});

	it('detects custom / modified / bundled problem sources', async () => {
		const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(bundledRoot);
		try {
			// Bundled-only problem with no user copy -> bundled.
			await fs.mkdir(path.join(bundledRoot, 'problems', 'two-sum'), { recursive: true });
			await fs.writeFile(path.join(bundledRoot, 'problems', 'two-sum', 'metadata.json'), '{}');

			const mod = await import('./contentPaths');
			expect(await mod.getProblemSource('two-sum')).toBe('bundled');

			// Identical user copy -> still bundled.
			await fs.mkdir(path.join(tmpRoot, 'user', 'problems', 'two-sum'), { recursive: true });
			await fs.writeFile(path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'), '{}');
			expect(await mod.getProblemSource('two-sum')).toBe('bundled');

			// Edited user copy -> modified.
			await fs.writeFile(
				path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'),
				'{"edited":true}'
			);
			expect(await mod.getProblemSource('two-sum')).toBe('modified');

			// User-only problem -> custom.
			await fs.mkdir(path.join(tmpRoot, 'user', 'problems', 'my-prob'), { recursive: true });
			await fs.writeFile(path.join(tmpRoot, 'user', 'problems', 'my-prob', 'metadata.json'), '{}');
			expect(await mod.getProblemSource('my-prob')).toBe('custom');
		} finally {
			cwdSpy.mockRestore();
		}
	});

	it('detects custom / modified / bundled course sources', async () => {
		const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(bundledRoot);
		try {
			await fs.mkdir(path.join(bundledRoot, 'courses', 'blind75'), { recursive: true });
			await fs.writeFile(
				path.join(bundledRoot, 'courses', 'blind75', 'courseinfo.json'),
				'{"title":"Blind 75"}'
			);

			const mod = await import('./contentPaths');
			expect(await mod.getCourseSource('blind75')).toBe('bundled');

			await fs.mkdir(path.join(tmpRoot, 'user', 'courses', 'my-course'), { recursive: true });
			await fs.writeFile(
				path.join(tmpRoot, 'user', 'courses', 'my-course', 'courseinfo.json'),
				'{"title":"Mine"}'
			);
			expect(await mod.getCourseSource('my-course')).toBe('custom');

			// Same content, different whitespace is still a difference (byte compare).
			await fs.mkdir(path.join(tmpRoot, 'user', 'courses', 'blind75'), { recursive: true });
			await fs.writeFile(
				path.join(tmpRoot, 'user', 'courses', 'blind75', 'courseinfo.json'),
				'{"title": "Blind 75"}'
			);
			expect(await mod.getCourseSource('blind75')).toBe('modified');
		} finally {
			cwdSpy.mockRestore();
		}
	});

	it('ensureUserContentSeeded copies missing files without overwriting edits', async () => {
		const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(bundledRoot);
		try {
			await fs.mkdir(path.join(bundledRoot, 'problems', 'two-sum'), { recursive: true });
			await fs.writeFile(
				path.join(bundledRoot, 'problems', 'two-sum', 'metadata.json'),
				'{"id":"two-sum"}'
			);
			await fs.mkdir(path.join(bundledRoot, 'courses', 'blind75'), { recursive: true });
			await fs.writeFile(
				path.join(bundledRoot, 'courses', 'blind75', 'courseinfo.json'),
				'{"title":"Blind 75"}'
			);

			const mod = await import('./contentPaths');
			await mod.ensureUserContentSeeded();

			expect(
				await fs.readFile(
					path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'),
					'utf-8'
				)
			).toBe('{"id":"two-sum"}');

			// User edit must survive a second seed.
			await fs.writeFile(
				path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'),
				'{"edited":true}'
			);
			mod.__resetEnsureMemoForTests();
			await mod.ensureUserContentSeeded();
			expect(
				await fs.readFile(
					path.join(tmpRoot, 'user', 'problems', 'two-sum', 'metadata.json'),
					'utf-8'
				)
			).toBe('{"edited":true}');

			// New bundled problem appears after re-seed.
			await fs.mkdir(path.join(bundledRoot, 'problems', 'new-prob'), { recursive: true });
			await fs.writeFile(
				path.join(bundledRoot, 'problems', 'new-prob', 'metadata.json'),
				'{}'
			);
			mod.__resetEnsureMemoForTests();
			await mod.ensureUserContentSeeded();
			expect(
				await fs.readFile(
					path.join(tmpRoot, 'user', 'problems', 'new-prob', 'metadata.json'),
					'utf-8'
				)
			).toBe('{}');
		} finally {
			cwdSpy.mockRestore();
		}
	});
});
