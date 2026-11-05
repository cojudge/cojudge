import { describe, expect, it } from 'vitest';
import {
	CLOUD_STASH_LIMIT,
	CLOUD_STASH_TTL_MS,
	chooseCloudStashBase,
	cloudStashListMode,
	collectStashChanges,
	collectStashImages,
	cloudStashIsExpired,
	cloudStashIsLeased,
	makeCloudStashId,
	normalizeCloudStashName,
	parseStashPayload,
	planStashPop,
	selectCloudStashIdsForCleanup,
	serializeStashPayload,
	type CloudStashSummary
} from './cloudStash';
import type { ProgressData } from './progressBackup';
import { PASTED_IMAGES_KEY } from './utils/imageStore';

function store(entries: Array<Record<string, unknown>>): ProgressData {
	return { files: { playground: JSON.stringify(entries) } };
}

function fileEntry(
	fileId: string,
	content: string,
	fileName = `${fileId}.py`,
	language = 'python'
): Record<string, unknown> {
	return { fileId, fileName, language, content };
}

function readEntries(data: ProgressData, slug = 'playground'): Array<Record<string, unknown>> {
	const fileStore = data.files as Record<string, string>;
	return JSON.parse(fileStore[slug]) as Array<Record<string, unknown>>;
}

describe('cloudStashListMode', () => {
	it('keeps an error visible instead of presenting an empty stash list', () => {
		expect(cloudStashListMode({
			error: 'Missing or insufficient permissions.',
			loading: false,
			count: 0
		})).toBe('error');
	});

	it('shows loading only when there are no cached stashes', () => {
		expect(cloudStashListMode({ error: '', loading: true, count: 0 })).toBe('loading');
		expect(cloudStashListMode({ error: '', loading: true, count: 2 })).toBe('list');
	});

	it('shows the list or empty state after a successful load', () => {
		expect(cloudStashListMode({ error: '', loading: false, count: 2 })).toBe('list');
		expect(cloudStashListMode({ error: '', loading: false, count: 0 })).toBe('empty');
	});
});

describe('collectStashChanges', () => {
	it('captures tracked modifications and untracked files without unrelated state', () => {
		const base = {
			...store([fileEntry('tracked', 'base'), fileEntry('kept', 'same')]),
			solutions: { 'two-sum': 'base solution' },
			'user-settings': { theme: 'dark' }
		};
		const local = {
			...store([fileEntry('tracked', 'local'), fileEntry('kept', 'same'), fileEntry('new', 'fresh')]),
			solutions: { 'two-sum': 'base solution' },
			'user-settings': { theme: 'dark' }
		};

		const changes = collectStashChanges(base, local);
		expect(changes.map((change) => [change.fileId, change.kind])).toEqual([
			['new', 'untracked'],
			['tracked', 'tracked']
		]);
		expect(changes[1].base).toEqual({
			present: true,
			value: [{ slug: 'playground', entries: [fileEntry('tracked', 'base')] }]
		});
		expect(changes[0].base).toEqual({ present: false, value: null });
	});

	it('captures deletions of tracked files', () => {
		const base = store([fileEntry('removed', 'old'), fileEntry('kept', 'same')]);
		const local = store([fileEntry('kept', 'same')]);
		const changes = collectStashChanges(base, local);
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe('removed');
		expect(changes[0].kind).toBe('tracked');
		expect(changes[0].local).toEqual({ present: false, value: null });
	});

	it('returns nothing for a clean working copy', () => {
		const data = store([fileEntry('one', 'same')]);
		expect(collectStashChanges(data, data)).toEqual([]);
	});

	it('does not leak hidden dotfiles into cloud stashes', () => {
		const base = store([]);
		const local = store([
			{ fileId: 'dot', fileName: '.env', language: 'text', content: 'SECRET=1' },
			fileEntry('visible', 'ok')
		]);
		const changes = collectStashChanges(base, local);
		expect(changes.map((change) => change.fileId)).toEqual(['visible']);
	});
});

describe('collectStashImages', () => {
	it('includes only pasted images referenced by files in the stash', () => {
		const base = store([fileEntry('doc', 'old', 'notes.md', 'markdown')]);
		const local = store([
			fileEntry('doc', '![diagram](cojudge://image/used)', 'notes.md', 'markdown')
		]);
		local[PASTED_IMAGES_KEY] = {
			used: 'data:image/png;base64,dXNlZA==',
			unused: 'data:image/png;base64,dW51c2Vk'
		};

		expect(collectStashImages(local, collectStashChanges(base, local))).toEqual({
			used: 'data:image/png;base64,dXNlZA=='
		});
	});

	it('ignores images referenced only by unchanged files', () => {
		const base = store([
			fileEntry('doc', '![kept](cojudge://image/kept)', 'notes.md', 'markdown'),
			fileEntry('changed', 'base')
		]);
		const local = store([
			fileEntry('doc', '![kept](cojudge://image/kept)', 'notes.md', 'markdown'),
			fileEntry('changed', 'local')
		]);
		local[PASTED_IMAGES_KEY] = { kept: 'data:image/png;base64,a2VwdA==' };

		expect(collectStashImages(local, collectStashChanges(base, local))).toEqual({});
	});
});

describe('chooseCloudStashBase', () => {
	const hash = (value: string) => value.repeat(64);

	it('prefers the cached clone that matches the last synced hash', () => {
		expect(chooseCloudStashBase({
			lastSyncedHash: hash('a'),
			cached: { checksum: hash('a') },
			remote: { checksum: hash('b') },
			history: []
		})).toEqual({ source: 'cached' });
	});

	it('uses the current remote when it is the last synced revision', () => {
		expect(chooseCloudStashBase({
			lastSyncedHash: hash('a'),
			cached: { checksum: hash('b') },
			remote: { checksum: hash('a') },
			history: []
		})).toEqual({ source: 'remote' });
	});

	it('falls back to a retained revision with the last synced checksum', () => {
		expect(chooseCloudStashBase({
			lastSyncedHash: hash('a'),
			cached: { checksum: hash('b') },
			remote: { checksum: hash('c') },
			history: [{ checksum: hash('a'), revisionId: 'revision-a' }]
		})).toEqual({ source: 'history', revisionId: 'revision-a' });
	});

	it('uses an empty base when neither device nor cloud has a baseline', () => {
		expect(chooseCloudStashBase({
			lastSyncedHash: null,
			cached: { checksum: hash('a') },
			remote: null,
			history: []
		})).toEqual({ source: 'empty' });
	});

	it('refuses to guess when the local baseline is unknown', () => {
		expect(chooseCloudStashBase({
			lastSyncedHash: hash('a'),
			cached: { checksum: hash('b') },
			remote: { checksum: hash('c') },
			history: []
		})).toEqual({ source: 'unknown' });
		expect(chooseCloudStashBase({
			lastSyncedHash: null,
			cached: { checksum: hash('b') },
			remote: { checksum: hash('c') },
			history: []
		})).toEqual({ source: 'unknown' });
	});
});

describe('planStashPop', () => {
	it('applies tracked edits and untracked files over an unchanged cloud copy', () => {
		const base = {
			...store([fileEntry('tracked', 'base'), fileEntry('other', 'untouched')]),
			solutions: { 'two-sum': 'base solution' }
		};
		const local = {
			...store([fileEntry('tracked', 'local'), fileEntry('other', 'untouched'), fileEntry('new', 'fresh')]),
			solutions: { 'two-sum': 'stashed solution' }
		};
		const changes = collectStashChanges(base, local);
		const plan = planStashPop(base, changes);

		expect(plan.conflicts).toEqual([]);
		expect(plan.applied.map((change) => change.fileId).sort()).toEqual([
			'new',
			'solution:two-sum',
			'tracked'
		]);
		const entries = readEntries(plan.data);
		expect(entries.find((entry) => entry.fileId === 'tracked')?.content).toBe('local');
		expect(entries.find((entry) => entry.fileId === 'new')?.content).toBe('fresh');
		expect(entries.find((entry) => entry.fileId === 'other')?.content).toBe('untouched');
		expect((plan.data.solutions as Record<string, string>)['two-sum']).toBe('stashed solution');
	});

	it('applies deletions from the stash safely', () => {
		const base = store([fileEntry('removed', 'old'), fileEntry('kept', 'same')]);
		const local = store([fileEntry('kept', 'same')]);
		const plan = planStashPop(base, collectStashChanges(base, local));

		expect(plan.conflicts).toEqual([]);
		expect(plan.applied.map((change) => change.fileId)).toEqual(['removed']);
		expect(readEntries(plan.data).map((entry) => entry.fileId)).toEqual(['kept']);
	});

	it('never overwrites a file changed after the stash was created', () => {
		const base = store([fileEntry('tracked', 'base')]);
		const local = store([fileEntry('tracked', 'stashed')]);
		const current = store([fileEntry('tracked', 'newer local work')]);
		const plan = planStashPop(current, collectStashChanges(base, local));

		expect(plan.applied).toEqual([]);
		expect(plan.conflicts).toEqual([
			{
				fileId: 'tracked',
				slug: 'playground',
				fileName: 'tracked.py',
				reason: 'changed-after-stash'
			}
		]);
		expect(readEntries(plan.data)[0].content).toBe('newer local work');
	});

	it('applies non-conflicting changes and leaves conflicting paths untouched', () => {
		const base = store([fileEntry('conflict', 'base')]);
		const local = store([fileEntry('conflict', 'stashed'), fileEntry('safe', 'new')]);
		const current = store([fileEntry('conflict', 'other')]);
		const plan = planStashPop(current, collectStashChanges(base, local));

		expect(plan.applied.map((change) => change.fileId)).toEqual(['safe']);
		expect(plan.conflicts.map((conflict) => conflict.fileId)).toEqual(['conflict']);
		const entries = readEntries(plan.data);
		expect(entries.find((entry) => entry.fileId === 'conflict')?.content).toBe('other');
		expect(entries.find((entry) => entry.fileId === 'safe')?.content).toBe('new');
	});

	it('reports a conflict when the current copy deleted a stashed file', () => {
		const base = store([fileEntry('tracked', 'base')]);
		const local = store([fileEntry('tracked', 'stashed')]);
		const current = store([]);
		const plan = planStashPop(current, collectStashChanges(base, local));
		expect(plan.conflicts[0].reason).toBe('deleted-after-stash');
	});

	it('reports a conflict when a local-only stash path was recreated differently', () => {
		const base = store([]);
		const local = store([fileEntry('new', 'stashed')]);
		const current = store([fileEntry('new', 'current')]);
		const plan = planStashPop(current, collectStashChanges(base, local));
		expect(plan.conflicts[0].reason).toBe('created-after-stash');
	});

	it('treats an already-applied stash as a no-op', () => {
		const base = store([fileEntry('tracked', 'base')]);
		const local = store([fileEntry('tracked', 'stashed')]);
		const changes = collectStashChanges(base, local);
		const plan = planStashPop(local, changes);
		expect(plan.applied).toEqual([]);
		expect(plan.conflicts).toEqual([]);
		expect(plan.alreadyApplied.map((change) => change.fileId)).toEqual(['tracked']);
	});
});

describe('stash payloads', () => {
	it('round-trips serialized changes and rejects malformed payloads', () => {
		const base = store([fileEntry('tracked', 'base')]);
		const local = store([fileEntry('tracked', 'local')]);
		const payload = {
			version: 1 as const,
			changes: collectStashChanges(base, local),
			images: { image: 'data:image/png;base64,aW1hZ2U=' }
		};
		const parsed = parseStashPayload(JSON.parse(serializeStashPayload(payload)));
		expect(parsed.changes).toHaveLength(1);
		expect(parsed.images).toEqual(payload.images);
		expect(() => parseStashPayload({ version: 1, changes: [{}] })).toThrow('invalid change');
		expect(() => parseStashPayload({ version: 2, changes: [] })).toThrow('unsupported');
		expect(() => parseStashPayload({ version: 1, changes: [], images: [] })).toThrow('image data');
	});

	it('creates stable ids and readable bounded names', () => {
		expect(makeCloudStashId()).toMatch(/^stash-[A-Za-z0-9-]+$/);
		expect(normalizeCloudStashName('  my   work  ', 1000)).toBe('my work');
		expect(normalizeCloudStashName('', 1000)).toBe('Stash 1970-01-01T00:00:01.000Z');
		expect(normalizeCloudStashName('x'.repeat(120))).toHaveLength(80);
	});
});

describe('stash cleanup', () => {
	function stash(
		stashId: string,
		createdAt: number,
		expiresAt = createdAt + CLOUD_STASH_TTL_MS,
		status: 'ready' | 'popping' = 'ready',
		leaseExpiresAt = 0
	): CloudStashSummary {
		return {
			stashId,
			name: stashId,
			workspaceId: 'workspace',
			repoId: 'repo',
			baseRevisionId: null,
			baseChecksum: null,
			checksum: 'a'.repeat(64),
			changeCount: 1,
			partCount: 1,
			totalBytes: 10,
			createdAt,
			expiresAt,
			status,
			leaseOwner: status === 'popping' ? 'device' : null,
			leaseExpiresAt
		};
	}

	it('expires old stashes and prunes the oldest beyond the limit', () => {
		const now = 100_000;
		const stashes = [
			stash('expired', 1, 50),
			...Array.from({ length: CLOUD_STASH_LIMIT + 2 }, (_, index) =>
				stash(`live-${index}`, 1000 + index)
			)
		];
		expect(cloudStashIsExpired(stashes[0], now)).toBe(true);
		expect(selectCloudStashIdsForCleanup(stashes, now)).toEqual([
			'expired',
			'live-0',
			'live-1'
		]);
	});

	it('does not clean up a stash that another device is actively popping', () => {
		const now = 100_000;
		const active = stash('active', 1, 50, 'popping', now + 10_000);
		expect(cloudStashIsLeased(active, now)).toBe(true);
		expect(selectCloudStashIdsForCleanup([active], now)).toEqual([]);
	});

	it('treats an expired lease as available for retry/cleanup', () => {
		const now = 100_000;
		const stale = stash('stale', 1, 50, 'popping', now - 1);
		expect(cloudStashIsLeased(stale, now)).toBe(false);
		expect(selectCloudStashIdsForCleanup([stale], now)).toEqual(['stale']);
	});
});
