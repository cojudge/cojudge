import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function writeJson(file: string, value: unknown) {
	await fs.mkdir(path.dirname(file), { recursive: true });
	await fs.writeFile(file, JSON.stringify(value));
}

async function makeProblem(dir: string, id: string, title: string) {
	await writeJson(path.join(dir, 'metadata.json'), { id, title, difficulty: 'Easy' });
}

/** A plugin source folder (what a GitHub repo would contain). */
async function makePack(root: string, id: string, opts: { unprefixed?: boolean; problems: string[]; course: string[]; courseId?: string }) {
	const dir = path.join(root, id);
	await writeJson(path.join(dir, 'cojudge-plugin.json'), {
		id,
		name: id,
		version: '1.0.0',
		...(opts.unprefixed ? { unprefixedIds: true } : {})
	});
	for (const slug of opts.problems) await makeProblem(path.join(dir, 'problems', slug), slug, `${id} ${slug}`);
	await writeJson(path.join(dir, 'courses', opts.courseId ?? `${id}-course`, 'courseinfo.json'), {
		title: `${id} course`,
		'category-order': ['all'],
		'problems-of-category': { all: opts.course }
	});
	return dir;
}

describe('plugins', () => {
	let tmp: string;
	let bundled: string;
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(async () => {
		tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-plugins-'));
		bundled = path.join(tmp, 'bundled');
		originalEnv = { ...process.env };
		process.env.COJUDGE_CONTENT_DIR = path.join(tmp, 'user');
		delete process.env.COJUDGE_PLUGINS_DIR;
		vi.spyOn(process, 'cwd').mockReturnValue(bundled);
		await makeProblem(path.join(bundled, 'problems', 'two-sum'), 'two-sum', 'Core Two Sum');
		await makeProblem(path.join(bundled, 'problems', 'core-only'), 'core-only', 'Core Only');
		vi.resetModules();
	});

	afterEach(async () => {
		process.env = originalEnv;
		vi.restoreAllMocks();
		vi.resetModules();
		await fs.rm(tmp, { recursive: true, force: true });
	});

	it('keeps same-slug problems from different packs apart', async () => {
		const plugins = await import('./plugins');
		const google = await makePack(path.join(tmp, 'src'), 'google-prep', {
			problems: ['two-sum', 'g-only'],
			course: ['two-sum', 'g-only', 'core-only']
		});
		const ms = await makePack(path.join(tmp, 'src'), 'ms-prep', {
			problems: ['two-sum'],
			course: ['two-sum', 'google-prep/g-only']
		});
		await plugins.install(google);
		await plugins.install(ms);

		const cp = await import('./contentPaths');
		const ids = await cp.listProblemSlugs();
		expect(ids).toEqual(['core-only', 'google-prep/g-only', 'google-prep/two-sum', 'ms-prep/two-sum', 'two-sum']);

		// Each id reads its own pack's copy; the bare id stays core's.
		const title = async (id: string) => JSON.parse(await cp.readProblemFile(id, 'metadata.json')).title;
		expect(await title('two-sum')).toBe('Core Two Sum');
		expect(await title('google-prep/two-sum')).toBe('google-prep two-sum');
		expect(await title('ms-prep/two-sum')).toBe('ms-prep two-sum');

		// Courses resolve bare entries to their own pack first, then core;
		// fully qualified cross-pack references are kept.
		const { loadAllCourses, loadAllProblemSummaries } = await import('./courseCatalog');
		const courses = await loadAllCourses();
		const mapping = (id: string) => courses.find((c) => c.id === id)!.info['problems-of-category'].all;
		expect(mapping('google-prep-course')).toEqual(['google-prep/two-sum', 'google-prep/g-only', 'core-only']);
		expect(mapping('ms-prep-course')).toEqual(['ms-prep/two-sum', 'google-prep/g-only']);

		// Summaries carry the full id even though metadata says `two-sum`.
		const summaries = await loadAllProblemSummaries();
		expect(summaries.filter((s) => s.title.endsWith('two-sum') || s.title === 'Core Two Sum').map((s) => s.id).sort())
			.toEqual(['google-prep/two-sum', 'ms-prep/two-sum', 'two-sum']);
	});

	it('user edits of a prefixed plugin problem live under problems/@<plugin>/', async () => {
		const plugins = await import('./plugins');
		await plugins.install(await makePack(path.join(tmp, 'src'), 'google-prep', { problems: ['two-sum'], course: ['two-sum'] }));
		const cp = await import('./contentPaths');
		const userCopy = path.join(tmp, 'user', 'problems', '@google-prep', 'two-sum');
		await makeProblem(userCopy, 'two-sum', 'Edited');
		expect(await cp.resolveProblemDir('google-prep/two-sum')).toBe(userCopy);
		expect(await cp.getProblemSource('google-prep/two-sum')).toBe('modified');
		// The `@` folder is not a core problem.
		expect(await cp.listProblemSlugs()).not.toContain('@google-prep');
	});

	it('unprefixed packs keep bare ids; core wins collisions', async () => {
		const plugins = await import('./plugins');
		await plugins.install(
			await makePack(path.join(tmp, 'src'), 'legacy', { unprefixed: true, problems: ['two-sum', 'old'], course: ['old', 'two-sum'] })
		);
		const cp = await import('./contentPaths');
		expect(await cp.listProblemSlugs()).toEqual(['core-only', 'old', 'two-sum']);
		expect(JSON.parse(await cp.readProblemFile('two-sum', 'metadata.json')).title).toBe('Core Two Sum');
		expect(await cp.resolveProblemDir('legacy/old')).toContain('@invalid');
	});

	it('disable hides content, enable restores it, uninstall removes it', async () => {
		const plugins = await import('./plugins');
		await plugins.install(await makePack(path.join(tmp, 'src'), 'google-prep', { problems: ['g-only'], course: ['g-only'] }));
		const cp = await import('./contentPaths');
		expect(await cp.listCourseIds()).toContain('google-prep-course');
		plugins.setEnabled('google-prep', false);
		expect(await cp.listCourseIds()).not.toContain('google-prep-course');
		expect(await cp.listProblemSlugs()).not.toContain('google-prep/g-only');
		plugins.setEnabled('google-prep', true);
		expect(await cp.listProblemSlugs()).toContain('google-prep/g-only');
		plugins.uninstall('google-prep');
		expect(plugins.listInstalled()).toEqual([]);
	});

	it.each(['a fresh install', 'an in-place upgrade'])('uses only the current Windows bundle after %s', async (scenario) => {
		const upgrade = scenario === 'an in-place upgrade';
		const { ensureUserContentSeeded, __resetEnsureMemoForTests } = await import('./contentPaths');
		const plugins = await import('./plugins');
		const { loadAllCourses, loadAllProblemSummaries } = await import('./courseCatalog');
		const user = path.join(tmp, 'user');
		const courseInfo = (title: string, slug: string) => ({ title, 'problems-of-category': { all: [slug] } });
		const basicCourse = path.join('courses', 'basic50', 'courseinfo.json');
		const leetcodeCourse = path.join('courses', 'leetcode-1000', 'courseinfo.json');
		const legacyProblem = path.join('problems', 'archive-only');

		if (upgrade) {
			await writeJson(path.join(bundled, basicCourse), courseInfo('Old Basic 50', 'intro'));
			await writeJson(path.join(bundled, leetcodeCourse), courseInfo('Old LeetCode 1000', 'archive-only'));
			await makeProblem(path.join(bundled, 'problems', 'intro'), 'intro', 'Old Intro');
			await makeProblem(path.join(bundled, legacyProblem), 'archive-only', 'Old Archive Problem');
			await fs.writeFile(path.join(bundled, legacyProblem, 'solution.md'), 'Original solution');
			await ensureUserContentSeeded();
			await fs.writeFile(path.join(user, legacyProblem, 'solution.md'), 'My edits');
			await plugins.install(await makePack(path.join(tmp, 'src'), 'leetcode-1000', {
				unprefixed: true, problems: ['archive-only'], course: ['archive-only'], courseId: 'leetcode-1000'
			}));
			await plugins.install(await makePack(path.join(tmp, 'src'), 'basic-50', {
				unprefixed: true, problems: ['intro'], course: ['intro'], courseId: 'basic50'
			}));
			plugins.setEnabled('basic-50', false);
		}

		// Simulate NSIS laying down the new payload without uninstalling the old one.
		const installedBackend = upgrade ? bundled : path.join(tmp, 'fresh-backend');
		vi.mocked(process.cwd).mockReturnValue(installedBackend);
		const current = path.join(installedBackend, 'bundled-content');
		await makeProblem(path.join(current, 'problems', 'two-sum'), 'two-sum', 'Current Two Sum');
		await writeJson(path.join(current, 'courses', 'blind75', 'courseinfo.json'), courseInfo('Blind 75', 'two-sum'));
		__resetEnsureMemoForTests();
		await ensureUserContentSeeded();

		expect((await loadAllCourses()).map(({ id, info }) => [id, info.title])).toEqual(upgrade
			? [['blind75', 'Blind 75'], ['leetcode-1000', 'leetcode-1000 course']]
			: [['blind75', 'Blind 75']]);
		expect((await loadAllProblemSummaries()).map(({ id, title }) => [id, title])).toEqual(upgrade
			? [['archive-only', 'leetcode-1000 archive-only'], ['two-sum', 'Current Two Sum']]
			: [['two-sum', 'Current Two Sum']]);
		if (upgrade) {
			await expect(fs.access(path.join(user, basicCourse))).rejects.toMatchObject({ code: 'ENOENT' });
			await expect(fs.access(path.join(user, leetcodeCourse))).rejects.toMatchObject({ code: 'ENOENT' });
			await expect(fs.readFile(path.join(user, legacyProblem, 'solution.md'), 'utf8')).resolves.toBe('My edits');
			expect(plugins.getInstalled('basic-50')).toMatchObject({ enabled: false });
			await expect(fs.access(path.join(bundled, basicCourse))).resolves.toBeUndefined();
			plugins.setEnabled('basic-50', true);
			expect((await loadAllCourses()).find(({ id }) => id === 'basic50')?.info.title).toBe('basic-50 course');
			expect((await loadAllProblemSummaries()).find(({ id }) => id === 'intro')?.title).toBe('basic-50 intro');
		}
	});

	it('parses install sources and rejects bad ones', async () => {
		const { parseSource, parseProblemId } = await import('./plugins');
		expect(parseSource('cojudge/leetcode-1000')).toEqual({ kind: 'github', owner: 'cojudge', repo: 'leetcode-1000', ref: undefined });
		expect(parseSource('https://github.com/cojudge/leetcode-1000.git')).toMatchObject({ owner: 'cojudge', repo: 'leetcode-1000' });
		expect(parseSource('github.com/a/b@v1.2.0')).toMatchObject({ owner: 'a', repo: 'b', ref: 'v1.2.0' });
		expect(() => parseSource('https://evil.example/a/b/c')).toThrow();
		expect(parseProblemId('../x')).toBeNull();
		expect(parseProblemId('a/b/c')).toBeNull();
	});

	it('rejects plugins containing symlinks', async () => {
		const plugins = await import('./plugins');
		const dir = await makePack(path.join(tmp, 'src'), 'sneaky', { problems: ['p'], course: ['p'] });
		await fs.symlink('/etc/passwd', path.join(dir, 'problems', 'p', 'statement.md'));
		await expect(plugins.install(dir)).rejects.toThrow(/symlink/);
	});
});
