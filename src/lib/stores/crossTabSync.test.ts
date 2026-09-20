import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { get } from 'svelte/store';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$lib/progressBackup', () => ({
	writeProgressStorageItem: (storage: Storage, key: string, value: string) => {
		storage.setItem(key, value);
		return true;
	},
	isDotFileName: (name: string) => name.startsWith('.')
}));

describe('cross-window persistence while offline', () => {
	let target: EventTarget;
	let storage: { getItem: Mock<[string], string | null>; setItem: Mock<[string, string], void> };

	beforeEach(() => {
		vi.resetModules();
		vi.useFakeTimers();
		const values = new Map<string, string>();
		storage = {
			getItem: vi.fn((key: string) => values.get(key) ?? null),
			setItem: vi.fn((key: string, value: string) => { values.set(key, value); })
		};
		target = new EventTarget();
		vi.stubGlobal('localStorage', storage);
		vi.stubGlobal('window', Object.assign(target, { localStorage: storage }));
		vi.stubGlobal('navigator', { onLine: false });
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	function deliver(key: string, newValue: string | null, storageArea: unknown = storage) {
		target.dispatchEvent(Object.assign(new Event('storage'), { key, newValue, storageArea }));
	}

	it('applies another window’s files without writing them back, then persists local edits', async () => {
		const { default: files, fileSyncVersion } = await import('./fileStore');
		const incoming = { playground: JSON.stringify([{ fileId: 'other', content: 'hello' }]) };
		const raw = JSON.stringify(incoming);
		storage.setItem('files', raw);
		storage.setItem.mockClear();

		deliver('files', raw);

		expect(get(files)).toEqual(incoming);
		expect(get(fileSyncVersion)).toBe(1);
		expect(storage.setItem).not.toHaveBeenCalled();

		files.update((state) => ({ ...state, 'two-sum': '[]' }));
		expect(storage.setItem).toHaveBeenCalledWith('files', JSON.stringify({ ...incoming, 'two-sum': '[]' }));
	});

	it('does not roll back fast typing when a delayed snapshot contains stale copies of different files', async () => {
		const { default: files, fileSyncVersion } = await import('./fileStore');
		const old = { playground: JSON.stringify([{ fileId: 'a', content: 'a' }]), 'two-sum': '[]' };
		const latest = { ...old, playground: JSON.stringify([{ fileId: 'a', content: 'abcdef' }]) };
		files.set(latest);
		storage.setItem.mockClear();

		// The other window's older whole-store event arrives after our latest save.
		deliver('files', JSON.stringify(old));

		expect(get(files)).toEqual(latest);
		expect(get(fileSyncVersion)).toBe(0);
		expect(storage.getItem('files')).toBe(JSON.stringify(latest));
		expect(storage.setItem).not.toHaveBeenCalled();
	});

	it('skips queued intermediate updates and applies the latest shared snapshot', async () => {
		const { default: files, fileSyncVersion } = await import('./fileStore');
		const latest = { playground: '[]', 'two-sum': '[]' };
		storage.setItem('files', JSON.stringify(latest));
		storage.setItem.mockClear();

		deliver('files', JSON.stringify({ playground: '[]' }));
		deliver('files', JSON.stringify(latest));

		expect(get(files)).toEqual(latest);
		expect(get(fileSyncVersion)).toBe(1);
		expect(storage.setItem).not.toHaveBeenCalled();
	});

	it('also prevents legacy solution-store echoes', async () => {
		const { default: solutions } = await import('./codeStore');
		const incoming = { 'two-sum:java': 'return answer;' };
		const raw = JSON.stringify(incoming);
		storage.setItem('solutions', raw);
		storage.setItem.mockClear();

		deliver('solutions', raw);
		expect(get(solutions)).toEqual(incoming);
		expect(storage.setItem).not.toHaveBeenCalled();

		solutions.set({ 'two-sum:java': 'return newerAnswer;' });
		expect(storage.setItem).toHaveBeenCalledTimes(1);
	});

	it('ignores session storage, removals and malformed snapshots', async () => {
		const { default: files, fileSyncVersion } = await import('./fileStore');
		storage.setItem('files', '{"playground":"[]"}');
		deliver('files', '{"playground":"[]"}', {});
		deliver('files', null);
		storage.setItem('files', 'invalid json');
		deliver('files', 'invalid json');
		expect(get(files)).toEqual({});
		expect(get(fileSyncVersion)).toBe(0);
	});
});
