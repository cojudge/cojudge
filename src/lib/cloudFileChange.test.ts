import { describe, expect, it } from 'vitest';
import {
	computeFileChanges,
	computeLineDiff,
	computeWhiteboardChange,
	discardFile,
	isBlobContent,
	WHITEBOARD_FILE_ID,
	type FileStore
} from './cloudFileChange';

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