import { describe, expect, it } from 'vitest';
import {
	collectProgressData,
	decodeProgressParts,
	encodeProgressParts,
	hashProgress,
	isProgressStorageKey,
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
});
