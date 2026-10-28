import { existsSync } from 'node:fs';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import {
	ensureUserContentSeeded,
	getBundledProblemsDir,
	getProblemsDir,
	listProblemSlugs,
} from './contentPaths';

/**
 * Exam mode hides hints and reference solutions
 *
 * Enabled either via `COJUDGE_EXAM_MODE=1|true|yes` or by the presence of
 * a `.exam-lock` file in the content root (`~/cojudge` by default,
 * overridable via `COJUDGE_CONTENT_DIR` / `COJUDGE_HOME`). The file form is
 * managed through the Exam mode menu item (backed by `POST /api/exam`),
 * which sets a teacher password and strips hints/solutions on enable, and
 * restores everything byte-for-byte on proper disable.
 *
 * This is friction for juniors, not tamper-proof: anyone with host
 * filesystem access can delete the lock and `sync --reset`. It must be
 * enforced server-side (never trust a client toggle) — the problem page
 * strips hints/solution from `__data.json` and the reset/reveal
 * endpoints return 403.
 */

export const EXAM_LOCK_FILENAME = '.exam-lock';

function contentRoot(): string {
	const override =
		process.env.COJUDGE_CONTENT_DIR?.trim() || process.env.COJUDGE_HOME?.trim();
	if (override) return path.resolve(override);
	return path.join(os.homedir(), 'cojudge');
}

export function getExamLockPath(): string {
	return path.join(contentRoot(), EXAM_LOCK_FILENAME);
}

export function isEnvExamMode(): boolean {
	const env = (process.env.COJUDGE_EXAM_MODE ?? '').trim().toLowerCase();
	return env === '1' || env === 'true' || env === 'yes' || env === 'on';
}

export function isExamModeEnabled(): boolean {
	if (isEnvExamMode()) return true;
	try {
		return existsSync(getExamLockPath());
	} catch {
		return false;
	}
}

/**
 * Teacher password for exam mode, stored as a salted scrypt hash in
 * `<contentRoot>/.exam-pass` — deliberately separate from the `.exam-lock`
 * file. Disabling exam mode through the UI/API requires it, so a student
 * clicking around can't turn exam mode off. It is NOT tamper-proof: anyone
 * with host filesystem access can delete both files (see isTampered).
 */
export const EXAM_PASS_FILENAME = '.exam-pass';

export function getExamPassPath(): string {
	return path.join(contentRoot(), EXAM_PASS_FILENAME);
}

export function hasExamPassword(): boolean {
	try {
		return existsSync(getExamPassPath());
	} catch {
		return false;
	}
}

export function setExamPassword(password: string): void {
	const salt = randomBytes(16);
	const hash = scryptSync(password, salt, 64);
	fsSync.mkdirSync(path.dirname(getExamPassPath()), { recursive: true });
	fsSync.writeFileSync(
		getExamPassPath(),
		JSON.stringify({ salt: salt.toString('hex'), hash: hash.toString('hex') }),
		'utf8'
	);
}

export function verifyExamPassword(password: string): boolean {
	try {
		const parsed = JSON.parse(fsSync.readFileSync(getExamPassPath(), 'utf8')) as {
			salt?: unknown;
			hash?: unknown;
		};
		if (typeof parsed.salt !== 'string' || typeof parsed.hash !== 'string') return false;
		const expected = Buffer.from(parsed.hash, 'hex');
		const actual = scryptSync(password, Buffer.from(parsed.salt, 'hex'), 64);
		return expected.length === actual.length && timingSafeEqual(expected, actual);
	} catch {
		return false;
	}
}

export function clearExamPassword(): void {
	try {
		fsSync.rmSync(getExamPassPath(), { force: true });
	} catch {
		// ignore
	}
}

/**
 * True when a password was set but the lock is gone without env mode —
 * i.e. someone deleted `.exam-lock` from the filesystem to dodge the
 * password prompt. Surfaced in the UI so the teacher knows to check.
 */
export function isExamTampered(): boolean {
	if (isEnvExamMode()) return false;
	return hasExamPassword() && !existsSync(getExamLockPath());
}

export function writeExamLock(): void {
	fsSync.mkdirSync(path.dirname(getExamLockPath()), { recursive: true });
	fsSync.writeFileSync(getExamLockPath(), `exam mode enabled at ${new Date().toISOString()}\n`, 'utf8');
}

export function removeExamLock(): void {
	try {
		fsSync.rmSync(getExamLockPath(), { force: true });
	} catch {
		// ignore
	}
}

let stripping = false;

export function isExamStripping(): boolean {
	return stripping;
}

/**
 * Exam-mode content backup. Enabling exam mode strips `hints` from
 * `metadata.json` and empties `solution.md` across the user content dir;
 * disabling must put everything back byte-for-byte so no "Modified" badges
 * linger afterwards. Raw bytes (not parsed values) are stored so restored
 * files compare identical to the bundled copies.
 *
 * - `meta[slug]` / `sol[slug]`: original user-file bytes, or `null` when the
 *   file didn't exist (we may seed an empty/stripped copy — restore deletes
 *   it again). Only slugs we actually touch are recorded.
 */
export const EXAM_BACKUP_FILENAME = '.exam-backup.json';

export type ExamBackupSlug = {
	/** Original user-file bytes, or `null` when the file didn't exist. */
	meta: string | null;
	sol: string | null;
	/** True when exam mode created the file (restore deletes it again). */
	seededMeta: boolean;
	seededSol: boolean;
};

export type ExamBackup = {
	version: 1;
	slugs: Record<string, ExamBackupSlug>;
};

export function getExamBackupPath(): string {
	return path.join(contentRoot(), EXAM_BACKUP_FILENAME);
}

export function readBackupFile(): ExamBackup | null {
	try {
		const parsed = JSON.parse(fsSync.readFileSync(getExamBackupPath(), 'utf8')) as {
			version?: unknown;
			slugs?: unknown;
		};
		if (parsed.version !== 1 || typeof parsed.slugs !== 'object' || parsed.slugs === null) {
			return null;
		}
		return { version: 1, slugs: parsed.slugs as ExamBackup['slugs'] };
	} catch {
		return null;
	}
}

export function writeBackupFile(backup: ExamBackup): void {
	fsSync.mkdirSync(path.dirname(getExamBackupPath()), { recursive: true });
	fsSync.writeFileSync(getExamBackupPath(), JSON.stringify(backup), 'utf8');
}

export function clearBackupFile(): void {
	try {
		fsSync.rmSync(getExamBackupPath(), { force: true });
	} catch {
		// ignore
	}
}

type SlugPlan = {
	metaRaw: string | null;
	solRaw: string | null;
	stripMeta: boolean;
	seedMeta: boolean;
	truncSol: boolean;
	seedSol: boolean;
};

function hasHintsValue(data: unknown): boolean {
	if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
	const hints = (data as { hints?: unknown }).hints;
	return (
		(Array.isArray(hints) && hints.length > 0) ||
		(typeof hints === 'string' && hints.trim().length > 0)
	);
}

async function readIfExists(filePath: string): Promise<string | null> {
	try {
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		return null;
	}
}

/** Read-only probe of what enabling exam mode would change for one slug. */
export async function planSlug(slug: string): Promise<SlugPlan> {
	const metaPath = path.join(getProblemsDir(), slug, 'metadata.json');
	const solPath = path.join(getProblemsDir(), slug, 'solution.md');
	const [metaRaw, solRaw] = await Promise.all([readIfExists(metaPath), readIfExists(solPath)]);
	let stripMeta = false;
	if (metaRaw !== null) {
		try {
			stripMeta = hasHintsValue(JSON.parse(metaRaw));
		} catch {
			stripMeta = false;
		}
	}
	let seedMeta = false;
	if (metaRaw === null) {
		const bundledMeta = await readIfExists(path.join(getBundledProblemsDir(), slug, 'metadata.json'));
		try {
			seedMeta = bundledMeta !== null && hasHintsValue(JSON.parse(bundledMeta));
		} catch {
			seedMeta = false;
		}
	}
	const truncSol = solRaw !== null && solRaw.length > 0;
	let seedSol = false;
	if (solRaw === null) {
		try {
			await fs.access(path.join(getBundledProblemsDir(), slug, 'solution.md'));
			seedSol = true;
		} catch {
			seedSol = false;
		}
	}
	return { metaRaw, solRaw, stripMeta, seedMeta, truncSol, seedSol };
}

export function strippedMetaBytes(raw: string): string | null {	try {
		const data = JSON.parse(raw) as { hints?: unknown };
		data.hints = [];
		return JSON.stringify(data, null, 2) + '\n';
	} catch {
		return null;
	}
}

/** Apply a plan (writes). Only touches hints/solution files. */
export async function applyPlan(slug: string, plan: SlugPlan): Promise<{ hints: boolean; solution: boolean }> {
	let hints = false;
	let solution = false;
	const metaPath = path.join(getProblemsDir(), slug, 'metadata.json');
	const solPath = path.join(getProblemsDir(), slug, 'solution.md');
	if (plan.stripMeta && plan.metaRaw !== null) {
		const stripped = strippedMetaBytes(plan.metaRaw);
		if (stripped !== null) {
			await fs.writeFile(metaPath, stripped, 'utf8');
			hints = true;
		}
	} else if (plan.seedMeta) {
		// No user copy: seed a hints-stripped copy so the bundled hints
		// don't leak through the user-wins fallback.
		const bundledMeta = await readIfExists(path.join(getBundledProblemsDir(), slug, 'metadata.json'));
		if (bundledMeta !== null) {
			const stripped = strippedMetaBytes(bundledMeta);
			if (stripped !== null) {
				await fs.mkdir(path.dirname(metaPath), { recursive: true });
				await fs.writeFile(metaPath, stripped, 'utf8');
				hints = true;
			}
		}
	}
	if (plan.truncSol) {
		// Truncate (don't delete): deleted files are re-seeded from the
		// bundled copy on next start, while an empty file is preserved as a
		// user edit and hides the Reference Solution button (empty is falsy).
		await fs.writeFile(solPath, '', 'utf8');
		solution = true;
	} else if (plan.seedSol) {
		await fs.mkdir(path.dirname(solPath), { recursive: true });
		await fs.writeFile(solPath, '', 'utf8');
		solution = true;
	}
	return { hints, solution };
}

/** Restore one slug from the backup.
 *
 * - Untouched since stripping → byte-exact restore (`'restored'`), so no
 *   lingering "Modified" badges.
 * - Edited mid-exam (e.g. the teacher fixed something during the event) →
 *   their work wins: hints are merged back into the current `metadata.json`,
 *   a rewritten `solution.md` is kept (`'merged'`, correctly shows Modified).
 * - Seeded files the teacher then edited are likewise kept.
 */
export async function restoreSlug(
	slug: string,
	backup: ExamBackup
): Promise<'restored' | 'merged' | 'skipped'> {
	try {
		const rec = backup.slugs[slug];
		if (!rec) return 'skipped';
		const metaPath = path.join(getProblemsDir(), slug, 'metadata.json');
		const solPath = path.join(getProblemsDir(), slug, 'solution.md');
		let merged = false;

		if (rec.seededMeta) {
			const cur = await readIfExists(metaPath);
			if (cur === null || (await isSeededMetaState(slug, cur))) {
				await fs.rm(metaPath, { force: true });
			} else {
				merged = true; // teacher edited the seeded file — keep it
			}
		} else if (rec.meta !== null) {
			const cur = await readIfExists(metaPath);
			const expectedStripped = strippedMetaBytes(rec.meta);
			if (cur === null || cur === rec.meta || (expectedStripped !== null && cur === expectedStripped)) {
				if (cur !== rec.meta) {
					await fs.mkdir(path.dirname(metaPath), { recursive: true });
					await fs.writeFile(metaPath, rec.meta, 'utf8');
				}
			} else {
				// Edited mid-exam: merge original hints into the current file.
				if (!(await mergeHints(metaPath, cur, rec.meta))) return 'skipped';
				merged = true;
			}
		}
		// rec.meta === null && !seededMeta: we never touched it — leave alone.

		if (rec.seededSol) {
			const cur = await readIfExists(solPath);
			if (cur === null || cur === '') {
				await fs.rm(solPath, { force: true });
			} else {
				merged = true; // teacher wrote a solution mid-exam — keep it
			}
		} else if (rec.sol !== null) {
			const cur = await readIfExists(solPath);
			if (cur === null || cur === '') {
				await fs.mkdir(path.dirname(solPath), { recursive: true });
				await fs.writeFile(solPath, rec.sol, 'utf8');
			} else if (cur !== rec.sol) {
				merged = true; // teacher rewrote it mid-exam — keep it
			}
		}
		return merged ? 'merged' : 'restored';
	} catch {
		return 'skipped';
	}
}

/** True when the metadata parses and carries no hints (our stripped state). */
function metaIsStripped(raw: string): boolean {
	try {
		return !hasHintsValue(JSON.parse(raw));
	} catch {
		return false;
	}
}

/** True when the file still holds the seeded stripped copy of bundled metadata. */
async function isSeededMetaState(slug: string, currentRaw: string): Promise<boolean> {
	const bundledMeta = await readIfExists(path.join(getBundledProblemsDir(), slug, 'metadata.json'));
	if (bundledMeta === null) return metaIsStripped(currentRaw);
	const expected = strippedMetaBytes(bundledMeta);
	return expected !== null && currentRaw === expected;
}

/** Set `hints` in the current metadata to the backup's original value. */
async function mergeHints(metaPath: string, currentRaw: string, backupRaw: string): Promise<boolean> {
	try {
		const current = JSON.parse(currentRaw) as { hints?: unknown };
		let originalHints: unknown;
		try {
			originalHints = (JSON.parse(backupRaw) as { hints?: unknown }).hints;
		} catch {
			return false;
		}
		if (originalHints === undefined) delete current.hints;
		else current.hints = originalHints;
		await fs.writeFile(metaPath, JSON.stringify(current, null, 2) + '\n', 'utf8');
		return true;
	} catch {
		return false;
	}
}

/**
 * Strip hints/solutions from the user content dir. Backs up originals first
 * (kept across re-enables) so disabling restores everything byte-for-byte.
 * Idempotent and slow (1000+ problems) — callers should run it in the
 * background after writing the lock file, since the lock alone already
 * hides everything server-side.
 */
export async function stripExamContent(): Promise<{ hints: number; solutions: number }> {
	if (stripping) return { hints: 0, solutions: 0 };
	stripping = true;
	try {
		await ensureUserContentSeeded();
		const slugs = await listProblemSlugs();
		const plans = new Map<string, SlugPlan>();
		for (const slug of slugs) {
			plans.set(slug, await planSlug(slug));
		}
		if (readBackupFile() === null) {
			const backup: ExamBackup = { version: 1, slugs: {} };
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
			writeBackupFile(backup);
		}
		let hints = 0;
		let solutions = 0;
		for (const [slug, plan] of plans) {
			const r = await applyPlan(slug, plan);
			if (r.hints) hints++;
			if (r.solution) solutions++;
		}
		return { hints, solutions };
	} finally {
		stripping = false;
	}
}

/**
 * Restore originals from the backup (proper disable path). Returns
 * `missing: true` when there is no backup (e.g. pre-backup locks) — then
 * the teacher restores via Reset in Manage Problems as before.
 */
export async function restoreExamContent(): Promise<{
	restored: number;
	merged: number;
	skipped: number;
	missing: boolean;
}> {
	const backup = readBackupFile();
	if (!backup) return { restored: 0, merged: 0, skipped: 0, missing: true };
	let restored = 0;
	let merged = 0;
	let skipped = 0;
	for (const slug of Object.keys(backup.slugs)) {
		const outcome = await restoreSlug(slug, backup);
		if (outcome === 'restored') restored++;
		else if (outcome === 'merged') merged++;
		else skipped++;
	}
	clearBackupFile();
	return { restored, merged, skipped, missing: false };
}
