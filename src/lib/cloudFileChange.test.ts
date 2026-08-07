import { describe, expect, it } from 'vitest';
import {
	computeFileChanges,
	computeLineDiff,
	computeOtherChanges,
	computeWhiteboardChange,
	computeWorkspaceChanges,
	discardChange,
	discardFile,
	isBlobContent,
	CHECKBOXES_FILE_ID,
	GAME_RESULT_FILE_ID_PREFIX,
	SOLUTION_FILE_ID_PREFIX,
	TESTCASES_FILE_ID_PREFIX,
	USER_SETTINGS_FILE_ID,
	WHITEBOARD_FILE_ID,
	WORKSPACE_FILE_ID_PREFIX,
	type FileStore,
	type ProgressStore
} from './cloudFileChange';
import { collectProgressData, type ProgressData } from './progressBackup';

// Mirrors production: local and cloud data are cloud-sanitized (editor-only
// fields like `order` stripped) before any workspace-level comparison, see
// fileChangesAgainstCloud in cloudSync.ts.
function sanitized(data: ProgressStore): ProgressData {
	const keys = Object.keys(data);
	const storage = {
		length: keys.length,
		key: (index: number) => keys[index] ?? null,
		getItem: (key: string) => {
			if (!(key in data)) return null;
			const value = data[key];
			return typeof value === 'string' ? value : JSON.stringify(value);
		}
	};
	return collectProgressData(storage, { cloud: true });
}

function store(files: Array<{ fileId: string; fileName?: string; language: string; content: string }>): FileStore {
	return {
		playground: JSON.stringify(
			files.map((file) => ({ ...file, isOpen: true, isActive: false, lastUpdated: 100 }))
		)
	};
}

describe('computeFileChanges', () => {
	it('detects an added file', () => {
		const changes = computeFileChanges(
			store([{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' }]),
			{}
		);
		expect(changes).toHaveLength(1);
		expect(changes[0].fileName).toBe('Solution');
		expect(changes[0].languages).toHaveLength(1);
		expect(changes[0].languages[0].local).toBe(true);
		expect(changes[0].languages[0].cloud).toBe(false);
	});

	it('detects a modified file and renders a line diff', () => {
		const local = store([{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(2)' }]);
		const cloud = store([{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' }]);

		const changes = computeFileChanges(local, cloud);
		expect(changes).toHaveLength(1);
		const lines = changes[0].languages[0].lines;
		expect(lines).toContainEqual({ type: 'add', text: 'print(2)' });
		expect(lines).toContainEqual({ type: 'remove', text: 'print(1)' });
	});

	it('ignores files whose content matches the cloud', () => {
		const files = { fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' };
		expect(computeFileChanges(store([files]), store([files]))).toEqual([]);
	});
});

describe('computeLineDiff', () => {
	it('marks additions and removals', () => {
		const lines = computeLineDiff(['a', 'b'], ['a', 'c']);
		expect(lines).toEqual([
			{ type: 'same', text: 'a' },
			{ type: 'remove', text: 'b' },
			{ type: 'add', text: 'c' }
		]);
	});
});

describe('isBlobContent', () => {
	it('detects base64 data URLs', () => {
		expect(isBlobContent(`data:image/png;base64,${'A'.repeat(2000)}`)).toBe(true);
	});

	it('detects long single-line base64 strings', () => {
		expect(isBlobContent('A'.repeat(2000))).toBe(true);
	});

	it('ignores normal code', () => {
		expect(
			isBlobContent(`def solve():\n    return "hello"\ndef main():\n    print(solve())`)
		).toBe(false);
	});
});

describe('computeFileChanges', () => {
	it('drops diff lines and flags blob content while keeping the change', () => {
		const local = store([
			{ fileId: '1', fileName: 'board', language: 'image', content: `data:image/png;base64,${'A'.repeat(2000)}` }
		]);
		const cloud = store([
			{ fileId: '1', fileName: 'board', language: 'image', content: `data:image/png;base64,${'B'.repeat(2000)}` }
		]);

		const changes = computeFileChanges(local, cloud);
		expect(changes).toHaveLength(1);
		expect(changes[0].languages[0].blob).toBe(true);
		expect(changes[0].languages[0].lines).toEqual([]);
	});
});

describe('computeWhiteboardChange', () => {
	it('returns null when the boards match', () => {
		const board = { version: 1, elements: [], view: { panX: 0, panY: 0, zoom: 1 } };
		expect(computeWhiteboardChange(board, { ...board })).toBeNull();
	});

	it('returns a blob change with a discardable fileId when boards differ', () => {
		const change = computeWhiteboardChange(
			{ version: 1, elements: [{ id: 'a', imageData: `data:image/png;base64,${'A'.repeat(2000)}` }] },
			{ version: 1, elements: [] }
		);
		expect(change).not.toBeNull();
		expect(change?.fileId).toBe(WHITEBOARD_FILE_ID);
		expect(change?.fileName).toBe('Whiteboard');
		expect(change?.languages[0].blob).toBe(true);
		expect(change?.languages[0].lines).toEqual([]);
		expect(change?.languages[0].local).toBe(true);
		expect(change?.languages[0].cloud).toBe(true);
	});

	it('flags a board that only exists locally', () => {
		const change = computeWhiteboardChange({ version: 1, elements: [] }, null);
		expect(change).not.toBeNull();
		expect(change?.languages[0].local).toBe(true);
		expect(change?.languages[0].cloud).toBe(false);
		expect(change?.languages[0].blob).toBe(true);
	});

	it('treats boards with identical serialized content as equal', () => {
		const board = { version: 1, elements: [], view: { panX: 0, panY: 0, zoom: 1 } };
		expect(computeWhiteboardChange(board, JSON.parse(JSON.stringify(board)))).toBeNull();
	});
});

describe('discardFile', () => {
	it('reverts a modified file to the cloud version, keeping editor UI state', () => {
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(2)', isActive: true, isOpen: true, lastUpdated: 200 }
			])
		};
		const cloudStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' }
			])
		};

		const updated = discardFile(localStore, '1', cloudStore);
		const entries = JSON.parse(updated.playground) as Array<Record<string, unknown>>;
		expect(entries).toHaveLength(1);
		expect(entries[0].content).toBe('print(1)');
		expect(entries[0].isOpen).toBe(true);
		expect(entries[0].lastUpdated).toBe(200);
	});

	it('keeps the local order field when discarding', () => {
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(2)', order: 5, isOpen: true }
			])
		};
		const cloudStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)', order: 1 }
			])
		};

		const updated = discardFile(localStore, '1', cloudStore);
		const entries = JSON.parse(updated.playground) as Array<Record<string, unknown>>;
		expect(entries[0].content).toBe('print(1)');
		expect(entries[0].order).toBe(5);
		expect(entries[0].isOpen).toBe(true);
	});

	it('replaces a file in place so sibling order (and local-only files) stay put', () => {
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'A', language: 'python', content: 'local-a' },
				{ fileId: 'dot', fileName: '.env', language: 'text', content: 'SECRET=1' },
				{ fileId: '2', fileName: 'B', language: 'python', content: 'b' }
			])
		};
		const cloudStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'A', language: 'python', content: 'cloud-a' },
				{ fileId: '2', fileName: 'B', language: 'python', content: 'b' }
			])
		};

		const updated = discardFile(localStore, '1', cloudStore);
		const entries = JSON.parse(updated.playground) as Array<Record<string, unknown>>;
		expect(entries.map((entry) => entry.fileId)).toEqual(['1', 'dot', '2']);
		expect(entries[0].content).toBe('cloud-a');
		expect(entries[1].fileName).toBe('.env');
	});

	it('removes a local-only file when discarded', () => {
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Scratch', language: 'python', content: 'print(1)' },
				{ fileId: '2', fileName: 'Notes', language: 'text', content: 'keep me' }
			])
		};
		const updated = discardFile(localStore, '1', {});
		const entries = JSON.parse(updated.playground) as Array<Record<string, unknown>>;
		expect(entries).toHaveLength(1);
		expect(entries[0].fileId).toBe('2');
	});

	it('re-adds a file that was deleted locally but still exists in the cloud', () => {
		const cloudStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' }
			])
		};
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '2', fileName: 'Notes', language: 'text', content: 'keep me' }
			])
		};
		const updated = discardFile(localStore, '1', cloudStore);
		const entries = JSON.parse(updated.playground) as Array<Record<string, unknown>>;
		expect(entries).toHaveLength(2);
		expect(entries.map((entry) => entry.fileId).sort()).toEqual(['1', '2']);
	});
});

describe('computeOtherChanges', () => {
	it('detects a modified solution with a line diff', () => {
		const local: ProgressStore = { solutions: { 'two-sum': 'return 2;' } };
		const cloud: ProgressStore = { solutions: { 'two-sum': 'return 1;' } };
		const changes = computeOtherChanges(local, cloud);
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe(`${SOLUTION_FILE_ID_PREFIX}two-sum`);
		expect(changes[0].fileName).toBe('Solution');
		expect(changes[0].languages[0].lines).toContainEqual({ type: 'add', text: 'return 2;' });
		expect(changes[0].languages[0].lines).toContainEqual({ type: 'remove', text: 'return 1;' });
	});

	it('detects test cases that only exist locally', () => {
		const local: ProgressStore = { testcases: { 'two-sum': [{ input: '[2,7]' }] } };
		const changes = computeOtherChanges(local, {});
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe(`${TESTCASES_FILE_ID_PREFIX}two-sum`);
		expect(changes[0].languages[0].local).toBe(true);
		expect(changes[0].languages[0].cloud).toBe(false);
	});

	it('ignores test cases that match the cloud', () => {
		const cases = { 'two-sum': [{ input: '[2,7]' }] };
		expect(computeOtherChanges({ testcases: cases }, { testcases: cases })).toEqual([]);
	});

	it('detects game results differences', () => {
		const local: ProgressStore = { 'game-results': { 'two-sum': [{ totalScore: 90 }] } };
		const cloud: ProgressStore = { 'game-results': { 'two-sum': [] } };
		const changes = computeOtherChanges(local, cloud);
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe(`${GAME_RESULT_FILE_ID_PREFIX}two-sum`);
	});

	it('aggregates checkbox flips into one change', () => {
		const local: ProgressStore = { 'user-checkboxes': { 'two-sum': true } };
		const cloud: ProgressStore = { 'user-checkboxes': { 'two-sum': false, 'add-two-numbers': true } };
		const changes = computeOtherChanges(local, cloud);
		const checkbox = changes.find((change) => change.fileId === CHECKBOXES_FILE_ID);
		expect(checkbox).toBeDefined();
		const texts = checkbox!.languages[0].lines.map((line) => line.text);
		expect(texts).toContain('two-sum: unchecked → checked');
		expect(texts).toContain('add-two-numbers: checked → unchecked');
	});

	it('detects shared whiteboard keys', () => {
		const local: ProgressStore = { 'cojudge-whiteboard-v1:share:abc': { elements: [{}] } };
		const changes = computeOtherChanges(local, {});
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe('storage:cojudge-whiteboard-v1:share:abc');
		expect(changes[0].fileName).toContain('Shared whiteboard');
	});

	it('detects settings field changes with a readable diff', () => {
		const local: ProgressStore = { 'user-settings': { theme: 'dark', fontSize: 14 } };
		const cloud: ProgressStore = { 'user-settings': { theme: 'light', fontSize: 14 } };
		const changes = computeOtherChanges(local, cloud);
		const settings = changes.find((change) => change.fileId === USER_SETTINGS_FILE_ID);
		expect(settings).toBeDefined();
		const lines = settings!.languages[0].lines;
		expect(lines).toContainEqual({ type: 'remove', text: 'theme: "light"' });
		expect(lines).toContainEqual({ type: 'add', text: 'theme: "dark"' });
		expect(lines.some((line) => String(line.text).startsWith('fontSize'))).toBe(false);
	});
});

describe('computeWorkspaceChanges', () => {
	it('flags a rename that produces no content diff', () => {
		const local: ProgressStore = {
			files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Renamed', language: 'python', content: 'x=1' }]) }
		};
		const cloud: ProgressStore = {
			files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Original', language: 'python', content: 'x=1' }]) }
		};
		const changes = computeWorkspaceChanges(sanitized(local), sanitized(cloud), new Set());
		expect(changes).toHaveLength(1);
		expect(changes[0].fileId).toBe(`${WORKSPACE_FILE_ID_PREFIX}playground`);
	});

	it('skips workspaces already covered by a content change', () => {
		const local: ProgressStore = {
			files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Renamed', language: 'python', content: 'x=1' }]) }
		};
		const cloud: ProgressStore = {
			files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Original', language: 'python', content: 'x=1' }]) }
		};
		expect(computeWorkspaceChanges(sanitized(local), sanitized(cloud), new Set(['playground']))).toEqual([]);
	});

	it('ignores identical workspaces', () => {
		const files = { playground: JSON.stringify([{ fileId: '1', fileName: 'A', language: 'python', content: 'x=1' }]) };
		expect(computeWorkspaceChanges(sanitized({ files }), sanitized({ files }), new Set())).toEqual([]);
	});

	it('ignores order-only differences (tab reorder/close is not a cloud change)', () => {
		const local: ProgressStore = {
			files: {
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'A', language: 'python', content: 'x', order: 0 },
					{ fileId: '2', fileName: 'B', language: 'python', content: 'y', order: 1 }
				])
			}
		};
		const cloud: ProgressStore = {
			files: {
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'A', language: 'python', content: 'x', order: 1 },
					{ fileId: '2', fileName: 'B', language: 'python', content: 'y', order: 0 }
				])
			}
		};
		expect(computeWorkspaceChanges(sanitized(local), sanitized(cloud), new Set())).toEqual([]);
		expect(computeFileChanges(local.files as FileStore, cloud.files as FileStore)).toEqual([]);
	});
});

describe('discardChange', () => {
	it('restores a solution from the cloud', () => {
		const local: ProgressStore = { solutions: { 'two-sum': 'return 2;' } };
		const cloud: ProgressStore = { solutions: { 'two-sum': 'return 1;' } };
		const updated = discardChange(local, `${SOLUTION_FILE_ID_PREFIX}two-sum`, cloud);
		expect(updated.solutions).toEqual({ 'two-sum': 'return 1;' });
	});

	it('removes a solution that does not exist in the cloud', () => {
		const local: ProgressStore = { solutions: { 'two-sum': 'return 2;', other: 'x' } };
		const updated = discardChange(local, `${SOLUTION_FILE_ID_PREFIX}two-sum`, {});
		expect(updated.solutions).toEqual({ other: 'x' });
	});

	it('restores test cases from the cloud', () => {
		const local: ProgressStore = { testcases: { 'two-sum': [{ input: 'local' }] } };
		const cloud: ProgressStore = { testcases: { 'two-sum': [{ input: 'cloud' }] } };
		const updated = discardChange(local, `${TESTCASES_FILE_ID_PREFIX}two-sum`, cloud);
		expect(updated.testcases).toEqual({ 'two-sum': [{ input: 'cloud' }] });
	});

	it('restores the checkboxes map wholesale', () => {
		const local: ProgressStore = { 'user-checkboxes': { a: true } };
		const cloud: ProgressStore = { 'user-checkboxes': { b: true } };
		const updated = discardChange(local, CHECKBOXES_FILE_ID, cloud);
		expect(updated['user-checkboxes']).toEqual({ b: true });
	});

	it('removes a shared whiteboard that does not exist in the cloud', () => {
		const local: ProgressStore = { 'cojudge-whiteboard-v1:share:abc': { elements: [{}] } };
		const updated = discardChange(local, 'storage:cojudge-whiteboard-v1:share:abc', {});
		expect(updated['cojudge-whiteboard-v1:share:abc']).toBeUndefined();
	});

	it('restores a workspace files list from the cloud', () => {
		const local: ProgressStore = { files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Renamed' }]) } };
		const cloud: ProgressStore = { files: { playground: JSON.stringify([{ fileId: '1', fileName: 'Original' }]) } };
		const updated = discardChange(local, `${WORKSPACE_FILE_ID_PREFIX}playground`, cloud);
		expect(JSON.parse((updated.files as Record<string, string>).playground)[0].fileName).toBe('Original');
	});
});

describe('discard residual workspace noise', () => {
	it('does not leave a workspace change after discarding matching content in place', () => {
		// Mirrors cloud-sanitized comparison (production sanitizes before
		// comparing). Previously, discardFile appended restored entries and kept
		// local `order`, which made a phantom "Files (names or order)" change
		// appear after discard. `order` is local-only UI state now, so the
		// sanitized comparison must stay clean.
		const localStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'A', language: 'python', content: 'local', order: 2 },
				{ fileId: '2', fileName: 'B', language: 'python', content: 'b', order: 1 }
			])
		};
		const cloudStore: FileStore = {
			playground: JSON.stringify([
				{ fileId: '1', fileName: 'A', language: 'python', content: 'cloud', order: 0 },
				{ fileId: '2', fileName: 'B', language: 'python', content: 'b', order: 1 }
			])
		};

		const updated = discardFile(localStore, '1', cloudStore);
		expect(computeFileChanges(updated, cloudStore)).toEqual([]);
		expect(
			computeWorkspaceChanges(
				sanitized({ files: updated }),
				sanitized({ files: cloudStore }),
				new Set()
			)
		).toEqual([]);
	});
});