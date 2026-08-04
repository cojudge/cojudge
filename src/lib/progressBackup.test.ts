import { describe, expect, it } from 'vitest';
import {
	clearProgressStorage,
	collectProgressData,
	decodeProgressParts,
	encodeProgressParts,
	extractDotFilesData,
	hashProgress,
	hasDotFiles,
	isMeaningfulProgress,
	isProgressStorageKey,
	listDotFiles,
	mergeDotFilesData,
	serializeProgressData
} from './progressBackup';

class MemoryStorage implements Storage {
	private values = new Map<string, string>();

	get length() {
		return this.values.size;
	}

	clear(): void {
		this.values.clear();
	}

	getItem(key: string): string | null {
		return this.values.get(key) ?? null;
	}

	key(index: number): string | null {
		return Array.from(this.values.keys())[index] ?? null;
	}

	removeItem(key: string): void {
		this.values.delete(key);
	}

	setItem(key: string, value: string): void {
		this.values.set(key, value);
	}
}

describe('progress backups', () => {
	it('collects application data while excluding auth and cloud bookkeeping', () => {
		const storage = new MemoryStorage();
		storage.setItem('solutions', JSON.stringify({ 'two-sum': 'return answer;' }));
		storage.setItem('plain-value', 'hello');
		storage.setItem('firebase:authUser:key', 'secret');
		storage.setItem('cojudge-cloud-sync-meta', '{}');
		storage.setItem('cojudge-firebase-settings', JSON.stringify({ projectId: 'custom' }));

		expect(collectProgressData(storage)).toEqual({
			'plain-value': 'hello',
			solutions: { 'two-sum': 'return answer;' }
		});
		expect(collectProgressData(storage, { cloud: true })).toEqual({
			solutions: { 'two-sum': 'return answer;' }
		});
	});

	it('recognizes protected cloud keys', () => {
		expect(isProgressStorageKey('files', { cloud: true })).toBe(true);
		expect(isProgressStorageKey('firebase:authUser:x', { cloud: true })).toBe(false);
		expect(isProgressStorageKey('cojudge-cloud-device', { cloud: true })).toBe(false);
		expect(isProgressStorageKey('cojudge-firebase-settings', { cloud: true })).toBe(false);
		expect(isProgressStorageKey('cojudge-firebase-settings')).toBe(false);
		expect(isProgressStorageKey('pane-width', { cloud: true })).toBe(false);
		expect(isProgressStorageKey('cojudge-whiteboard-v1:share:abc', { cloud: true })).toBe(true);
	});

	it('leaves local-only UI keys out of cloud sync and restore', () => {
		for (const key of ['selected-course', 'pane-width', 'open-groups', 'exec-pane-height']) {
			expect(isProgressStorageKey(key, { cloud: true })).toBe(false);
		}
	});

	it('clears local progress without removing Firebase or cloud metadata', () => {
		const storage = new MemoryStorage();
		storage.setItem('solutions', JSON.stringify({ 'two-sum': 'return answer;' }));
		storage.setItem('open-groups', JSON.stringify(['arrays']));
		storage.setItem('imported-key', 'value');
		storage.setItem('firebase:authUser:key', 'private-auth-state');
		storage.setItem('cojudge-cloud-sync-meta', JSON.stringify({ version: 2 }));
		storage.setItem('cojudge-firebase-settings', JSON.stringify({ projectId: 'custom' }));

		clearProgressStorage(storage);

		expect(collectProgressData(storage)).toEqual({});
		expect(storage.getItem('firebase:authUser:key')).toBe('private-auth-state');
		expect(storage.getItem('cojudge-cloud-sync-meta')).toBe('{"version":2}');
		expect(storage.getItem('cojudge-firebase-settings')).toBe('{"projectId":"custom"}');
	});

	it('serializes top-level keys deterministically', async () => {
		const first = serializeProgressData({ z: 1, a: { value: true } });
		const second = serializeProgressData({ a: { value: true }, z: 1 });
		expect(first).toBe(second);
		expect(await hashProgress(first)).toBe(await hashProgress(second));
	});

	it('round-trips chunked UTF-8 snapshots', () => {
		const serialized = JSON.stringify({ code: 'return "你好";', whiteboard: 'x'.repeat(100) });
		const encoded = encodeProgressParts(serialized, 17);
		expect(encoded.parts.length).toBeGreaterThan(1);
		expect(decodeProgressParts(encoded.parts, encoded.totalBytes)).toBe(serialized);
		expect(() => decodeProgressParts(encoded.parts.slice(1), encoded.totalBytes)).toThrow(
			'Cloud snapshot is incomplete.'
		);
	});

	it('distinguishes default-only storage from user work', () => {
		expect(isMeaningfulProgress({ solutions: {}, 'user-settings': { theme: 'dark' } })).toBe(false);
		expect(isMeaningfulProgress({ files: { 'two-sum': '[{"content":"code"}]' } })).toBe(true);
		expect(isMeaningfulProgress({ 'cojudge-whiteboard-v1': { elements: [{}] } })).toBe(true);
	});

	it('keeps dotfiles locally but leaves them out of cloud snapshots', () => {
		const storage = new MemoryStorage();
		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' },
					{ fileId: '2', fileName: '.env', language: 'text', content: 'SECRET=1' }
				])
			})
		);

		const local = collectProgressData(storage);
		const cloud = collectProgressData(storage, { cloud: true });

		const localFiles = local.files as Record<string, string>;
		const cloudFiles = cloud.files as Record<string, string>;

		expect(localFiles.playground).toContain('.env');
		expect(cloudFiles.playground).toContain('Solution');
		expect(cloudFiles.playground).not.toContain('.env');
	});

	it('keeps markdown preview tabs locally but leaves them out of cloud snapshots', () => {
		const storage = new MemoryStorage();
		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{
						fileId: '1',
						fileName: 'README',
						language: 'markdown',
						content: '# Hello',
						type: 'editor',
						sourceFileId: null
					},
					{
						fileId: '2',
						fileName: 'README',
						language: 'markdown',
						content: '<h1>Hello</h1>',
						type: 'preview',
						sourceFileId: '1'
					}
				])
			})
		);

		const local = collectProgressData(storage);
		const cloud = collectProgressData(storage, { cloud: true });

		const localFiles = local.files as Record<string, string>;
		const cloudFiles = cloud.files as Record<string, string>;

		const localEntries = JSON.parse(localFiles.playground) as Array<{ type?: string }>;
		const cloudEntries = JSON.parse(cloudFiles.playground) as Array<{ type?: string }>;
		expect(localEntries.some((entry) => entry.type === 'preview')).toBe(true);
		expect(cloudEntries.some((entry) => entry.type === 'preview')).toBe(false);
		expect(cloudEntries.some((entry) => entry.type === 'editor')).toBe(true);
	});

	it('extracts only dotfile entries for a sign-out "keep" decision', () => {
		const storage = new MemoryStorage();
		expect(hasDotFiles(storage)).toBe(false);
		expect(extractDotFilesData(storage)).toBeNull();

		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' },
					{ fileId: '2', fileName: '.env', language: 'text', content: 'SECRET=1' }
				]),
				notes: JSON.stringify([
					{ fileId: '3', fileName: '.gitignore', language: 'text', content: 'node_modules' }
				])
			})
		);

		const dotFiles = extractDotFilesData(storage);
		expect(hasDotFiles(storage)).toBe(true);
		expect(dotFiles).not.toBeNull();
		const parsed = JSON.parse(dotFiles!) as Record<string, string>;
		expect(parsed.playground).toContain('.env');
		expect(parsed.playground).not.toContain('Solution');
		expect(parsed.notes).toContain('.gitignore');
	});

	it('lists hidden file names for the delete confirmation', () => {
		const storage = new MemoryStorage();
		expect(listDotFiles(storage)).toEqual([]);

		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' },
					{ fileId: '2', fileName: '.env', language: 'text', content: 'SECRET=1' },
					{ fileId: '4', fileName: '.env', language: 'text', content: 'SECRET=1' }
				]),
				notes: JSON.stringify([
					{ fileId: '3', fileName: '.gitignore', language: 'text', content: 'node_modules' },
					{ fileId: '5', fileName: 'README', language: 'text', content: 'docs' }
				])
			})
		);

		expect(listDotFiles(storage)).toEqual(['.env', '.gitignore']);
	});

	it('merges dotfiles back after a cloud snapshot replaces local files', () => {
		const storage = new MemoryStorage();
		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(1)' },
					{ fileId: '2', fileName: '.env', language: 'text', content: 'SECRET=1' }
				])
			})
		);

		const dotFiles = extractDotFilesData(storage);
		expect(dotFiles).not.toBeNull();

		// Simulate a cloud download replacing local files without the dotfile.
		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '1', fileName: 'Solution', language: 'python', content: 'print(2)' },
					{ fileId: '3', fileName: 'Notes', language: 'text', content: 'hello' }
				])
			})
		);

		const merged = mergeDotFilesData(storage.getItem('files'), dotFiles!);
		const parsed = JSON.parse(merged) as Record<string, string>;
		expect(parsed.playground).toContain('.env');
		expect(parsed.playground).toContain('Solution');
		expect(parsed.playground).toContain('Notes');
	});

	it('treats empty file lists as empty for cloud sync', () => {
		const storage = new MemoryStorage();
		storage.setItem('files', JSON.stringify({ playground: JSON.stringify([]) }));

		const cloud = collectProgressData(storage, { cloud: true });
		expect(cloud.files).toEqual({});
		expect(isMeaningfulProgress(cloud)).toBe(false);
	});

	it('treats dotfile-only file lists as empty for cloud sync', () => {
		const storage = new MemoryStorage();
		storage.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{ fileId: '2', fileName: '.env', language: 'text', content: 'SECRET=1' }
				])
			})
		);

		const cloud = collectProgressData(storage, { cloud: true });
		expect(cloud.files).toEqual({});
		expect(isMeaningfulProgress(cloud)).toBe(false);
	});

	it('ignores tab open/active state when measuring cloud changes', async () => {
		const openTab = new MemoryStorage();
		openTab.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{
						fileId: '1',
						fileName: 'Solution',
						content: 'print(1)',
						language: 'python',
						isOpen: true,
						isActive: true,
						lastUpdated: 100,
						viewState: '1:5'
					}
				])
			})
		);
		const closedTab = new MemoryStorage();
		closedTab.setItem(
			'files',
			JSON.stringify({
				playground: JSON.stringify([
					{
						fileId: '1',
						fileName: 'Solution',
						content: 'print(1)',
						language: 'python',
						isOpen: false,
						isActive: false,
						lastUpdated: 200,
						viewState: '2:10'
					}
				])
			})
		);

		const openCloud = serializeProgressData(collectProgressData(openTab, { cloud: true }));
		const closedCloud = serializeProgressData(collectProgressData(closedTab, { cloud: true }));
		expect(openCloud).toBe(closedCloud);
		expect(await hashProgress(openCloud)).toBe(await hashProgress(closedCloud));
	});
});
