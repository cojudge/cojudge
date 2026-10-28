import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('examMode', () => {
	let tmpRoot: string;
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(async () => {
		tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-exam-'));
		originalEnv = { ...process.env };
		process.env.COJUDGE_CONTENT_DIR = tmpRoot;
		delete process.env.COJUDGE_EXAM_MODE;
		vi.resetModules();
	});

	afterEach(async () => {
		process.env = originalEnv;
		vi.resetModules();
		await fs.rm(tmpRoot, { recursive: true, force: true });
	});

	it('is off by default', async () => {
		const mod = await import('./examMode');
		expect(mod.isExamModeEnabled()).toBe(false);
	});

	it('is on via env var', async () => {
		process.env.COJUDGE_EXAM_MODE = '1';
		const mod = await import('./examMode');
		expect(mod.isExamModeEnabled()).toBe(true);
	});

	it('is on via lock file', async () => {
		const mod = await import('./examMode');
		expect(mod.isExamModeEnabled()).toBe(false);
		await fs.writeFile(mod.getExamLockPath(), 'exam\n');
		expect(mod.isExamModeEnabled()).toBe(true);
	});

	it('stores and verifies the exam password', async () => {
		const mod = await import('./examMode');
		expect(mod.hasExamPassword()).toBe(false);
		expect(mod.verifyExamPassword('anything')).toBe(false);
		mod.setExamPassword('teacher-pw');
		expect(mod.hasExamPassword()).toBe(true);
		expect(mod.verifyExamPassword('teacher-pw')).toBe(true);
		expect(mod.verifyExamPassword('wrong-pw')).toBe(false);
		mod.clearExamPassword();
		expect(mod.hasExamPassword()).toBe(false);
	});

	it('detects a manually removed lock file', async () => {
		const mod = await import('./examMode');
		expect(mod.isExamTampered()).toBe(false);
		mod.setExamPassword('teacher-pw');
		// Password set but no lock and no env mode: lock was removed manually.
		expect(mod.isExamTampered()).toBe(true);
		await fs.writeFile(mod.getExamLockPath(), 'exam\n');
		expect(mod.isExamTampered()).toBe(false);
	});

	it('round-trips stripped content byte-for-byte', async () => {
		const mod = await import('./examMode');
		const problemsDir = path.join(tmpRoot, 'problems');
		// Problem with hints + solution (note the quirky formatting).
		await fs.mkdir(path.join(problemsDir, 'prob-a'), { recursive: true });
		const metaA = '{\n  "id": "prob-a",\n  "hints": ["hint one"]\n}\n';
		const solA = '# solution\n\n```python\npass\n```\n';
		await fs.writeFile(path.join(problemsDir, 'prob-a', 'metadata.json'), metaA);
		await fs.writeFile(path.join(problemsDir, 'prob-a', 'solution.md'), solA);
		// Problem without hints or solution — must stay untouched.
		await fs.mkdir(path.join(problemsDir, 'prob-b'), { recursive: true });
		const metaB = '{"id":"prob-b"}';
		await fs.writeFile(path.join(problemsDir, 'prob-b', 'metadata.json'), metaB);

		const slugs = ['prob-a', 'prob-b'];
		const plans = new Map<string, Awaited<ReturnType<typeof mod.planSlug>>>();
		for (const slug of slugs) plans.set(slug, await mod.planSlug(slug));
		expect(plans.get('prob-a')).toMatchObject({ stripMeta: true, truncSol: true });
		expect(plans.get('prob-b')).toMatchObject({
			stripMeta: false,
			seedMeta: false,
			truncSol: false,
			seedSol: false,
		});

		const backup: mod.ExamBackup = { version: 1, slugs: {} };
		for (const [slug, plan] of plans) {
			if (plan.stripMeta || plan.seedMeta || plan.truncSol || plan.seedSol) {
				backup.slugs[slug] = {
					meta: plan.metaRaw,
					sol: plan.solRaw,
					seededMeta: plan.seedMeta,
					seededSol: plan.seedSol,
				};
			}
		}
		for (const [slug, plan] of plans) await mod.applyPlan(slug, plan);

		// Stripped state.
		expect(JSON.parse(await fs.readFile(path.join(problemsDir, 'prob-a', 'metadata.json'), 'utf8')).hints).toEqual([]);
		expect(await fs.readFile(path.join(problemsDir, 'prob-a', 'solution.md'), 'utf8')).toBe('');

		// Restore is byte-exact.
		let restored = 0;
		for (const slug of Object.keys(backup.slugs)) {
			if ((await mod.restoreSlug(slug, backup)) === 'restored') restored++;
		}
		expect(restored).toBe(1);
		expect(await fs.readFile(path.join(problemsDir, 'prob-a', 'metadata.json'), 'utf8')).toBe(metaA);
		expect(await fs.readFile(path.join(problemsDir, 'prob-a', 'solution.md'), 'utf8')).toBe(solA);
		expect(await fs.readFile(path.join(problemsDir, 'prob-b', 'metadata.json'), 'utf8')).toBe(metaB);
	});

	it('keeps mid-exam edits and merges hints back', async () => {
		const mod = await import('./examMode');
		const problemsDir = path.join(tmpRoot, 'problems');
		await fs.mkdir(path.join(problemsDir, 'prob-c'), { recursive: true });
		const metaC = '{"id":"prob-c","hints":["orig hint"]}\n';
		await fs.writeFile(path.join(problemsDir, 'prob-c', 'metadata.json'), metaC);
		await fs.writeFile(path.join(problemsDir, 'prob-c', 'solution.md'), 'orig solution');

		const plan = await mod.planSlug('prob-c');
		const backup: mod.ExamBackup = {
			version: 1,
			slugs: {
				'prob-c': { meta: plan.metaRaw, sol: plan.solRaw, seededMeta: false, seededSol: false },
			},
		};
		await mod.applyPlan('prob-c', plan);

		// Teacher edits metadata and solution mid-exam.
		await fs.writeFile(
			path.join(problemsDir, 'prob-c', 'metadata.json'),
			'{"id":"prob-c","hints":[],"notes":"added mid-exam"}'
		);
		await fs.writeFile(path.join(problemsDir, 'prob-c', 'solution.md'), 'teacher rewrite');

		expect(await mod.restoreSlug('prob-c', backup)).toBe('merged');
		const restoredMeta = JSON.parse(
			await fs.readFile(path.join(problemsDir, 'prob-c', 'metadata.json'), 'utf8')
		);
		expect(restoredMeta.hints).toEqual(['orig hint']);
		expect(restoredMeta.notes).toBe('added mid-exam');
		expect(await fs.readFile(path.join(problemsDir, 'prob-c', 'solution.md'), 'utf8')).toBe(
			'teacher rewrite'
		);
	});

	it('deletes seeded files on restore', async () => {
		const mod = await import('./examMode');
		const problemsDir = path.join(tmpRoot, 'problems');
		await fs.mkdir(path.join(problemsDir, 'prob-d'), { recursive: true });
		// Simulate seeded state: empty solution + stripped meta, absent before.
		await fs.writeFile(path.join(problemsDir, 'prob-d', 'metadata.json'), '{"id":"prob-d","hints":[]}');
		await fs.writeFile(path.join(problemsDir, 'prob-d', 'solution.md'), '');
		const backup: mod.ExamBackup = {
			version: 1,
			slugs: { 'prob-d': { meta: null, sol: null, seededMeta: true, seededSol: true } },
		};
		expect(await mod.restoreSlug('prob-d', backup)).toBe('restored');
		await expect(fs.access(path.join(problemsDir, 'prob-d', 'metadata.json'))).rejects.toThrow();
		await expect(fs.access(path.join(problemsDir, 'prob-d', 'solution.md'))).rejects.toThrow();
	});
});
