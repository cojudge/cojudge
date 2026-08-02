export type ProgressData = Record<string, unknown>;

export type StorageReader = Pick<Storage, 'length' | 'key' | 'getItem'>;

export type ProgressCollectionOptions = {
	cloud?: boolean;
};

const EXCLUDED_KEYS = new Set(['cojudge-firebase-settings']);
const EXCLUDED_PREFIXES = ['firebase:', 'cojudge-cloud-'];
const CLOUD_KEYS = new Set([
	'files',
	'game-results',
	'selected-course',
	'solutions',
	'testcases',
	'user-checkboxes',
	'user-settings',
	'cojudge-whiteboard-v1'
]);
const CLOUD_KEY_PREFIXES = ['cojudge-whiteboard-v1:share:'];

export const CLOUD_SNAPSHOT_VERSION = 1;
export const CLOUD_SNAPSHOT_CHUNK_BYTES = 600 * 1024;
export const CLOUD_RESTORE_SESSION_KEY = 'cojudge-cloud-restoring';
export const CLOUD_FLUSH_EVENT = 'cojudge:cloud-flush';
export const CLOUD_RESTORE_LOCK_KEY = 'cojudge-cloud-restore-lock';
export const CLOUD_RESTORE_COMPLETE_KEY = 'cojudge-cloud-restore-complete';
export const CLOUD_RESTORE_CONTEXT_KEY = 'cojudge-cloud-context-epoch';

let staleContextReloadScheduled = false;

export function initializeCloudRestoreContext(): void {
	if (typeof window === 'undefined') return;
	const previousEpoch = sessionStorage.getItem(CLOUD_RESTORE_CONTEXT_KEY);
	const currentEpoch = localStorage.getItem(CLOUD_RESTORE_COMPLETE_KEY) || '';
	const resumedAfterRestore = sessionStorage.getItem(CLOUD_RESTORE_SESSION_KEY) === '1'
		|| (previousEpoch !== null && previousEpoch !== currentEpoch);
	const lockStartedAt = Number(localStorage.getItem(CLOUD_RESTORE_LOCK_KEY));
	const completedAt = Number(currentEpoch);
	sessionStorage.setItem(CLOUD_RESTORE_CONTEXT_KEY, currentEpoch);
	sessionStorage.removeItem(CLOUD_RESTORE_SESSION_KEY);
	staleContextReloadScheduled = false;
	if (resumedAfterRestore || (Number.isFinite(completedAt) && completedAt >= lockStartedAt)) {
		localStorage.removeItem(CLOUD_RESTORE_LOCK_KEY);
	}
}

export function isCloudRestoreInProgress(): boolean {
	if (typeof window === 'undefined') return false;
	if (sessionStorage.getItem(CLOUD_RESTORE_SESSION_KEY) === '1') return true;
	const contextEpoch = sessionStorage.getItem(CLOUD_RESTORE_CONTEXT_KEY);
	const currentEpoch = localStorage.getItem(CLOUD_RESTORE_COMPLETE_KEY) || '';
	if (contextEpoch !== null && contextEpoch !== currentEpoch) {
		sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
		if (!staleContextReloadScheduled) {
			staleContextReloadScheduled = true;
			setTimeout(() => window.location.reload(), 0);
		}
		return true;
	}
	const startedAt = Number(localStorage.getItem(CLOUD_RESTORE_LOCK_KEY));
	if (Number.isFinite(startedAt) && Date.now() - startedAt < 10_000) return true;
	localStorage.removeItem(CLOUD_RESTORE_LOCK_KEY);
	return false;
}

function parseStoredValue(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}

export function isProgressStorageKey(key: string, options: ProgressCollectionOptions = {}): boolean {
	if (EXCLUDED_KEYS.has(key)) return false;
	if (EXCLUDED_PREFIXES.some((prefix) => key.startsWith(prefix))) return false;
	if (options.cloud) {
		return CLOUD_KEYS.has(key) || CLOUD_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
	}
	return true;
}

export function collectProgressData(
	storage: StorageReader,
	options: ProgressCollectionOptions = {}
): ProgressData {
	const keys: string[] = [];
	for (let index = 0; index < storage.length; index++) {
		const key = storage.key(index);
		if (key && isProgressStorageKey(key, options)) keys.push(key);
	}

	keys.sort();
	const data: ProgressData = {};
	for (const key of keys) {
		const value = storage.getItem(key);
		if (value !== null) data[key] = parseStoredValue(value);
	}
	return data;
}

export function serializeProgressData(data: ProgressData): string {
	const sorted: ProgressData = {};
	for (const key of Object.keys(data).sort()) sorted[key] = data[key];
	return JSON.stringify(sorted);
}

export async function hashProgress(serialized: string): Promise<string> {
	const bytes = new TextEncoder().encode(serialized);
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes: Uint8Array): string {
	let binary = '';
	const blockSize = 0x8000;
	for (let offset = 0; offset < bytes.length; offset += blockSize) {
		binary += String.fromCharCode(...bytes.subarray(offset, offset + blockSize));
	}
	return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
	return bytes;
}

export function encodeProgressParts(
	serialized: string,
	chunkBytes = CLOUD_SNAPSHOT_CHUNK_BYTES
): { parts: string[]; totalBytes: number } {
	if (!Number.isSafeInteger(chunkBytes) || chunkBytes <= 0) {
		throw new Error('Snapshot chunk size must be a positive integer.');
	}

	const bytes = new TextEncoder().encode(serialized);
	const parts: string[] = [];
	for (let offset = 0; offset < bytes.length; offset += chunkBytes) {
		parts.push(bytesToBase64(bytes.subarray(offset, offset + chunkBytes)));
	}
	if (parts.length === 0) parts.push('');
	return { parts, totalBytes: bytes.length };
}

export function decodeProgressParts(parts: string[], totalBytes: number): string {
	if (!Number.isSafeInteger(totalBytes) || totalBytes < 0) {
		throw new Error('Cloud snapshot has an invalid size.');
	}

	const decoded = parts.map(base64ToBytes);
	const actualBytes = decoded.reduce((total, part) => total + part.length, 0);
	if (actualBytes !== totalBytes) throw new Error('Cloud snapshot is incomplete.');

	const combined = new Uint8Array(actualBytes);
	let offset = 0;
	for (const part of decoded) {
		combined.set(part, offset);
		offset += part.length;
	}
	return new TextDecoder('utf-8', { fatal: true }).decode(combined);
}
