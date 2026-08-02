export type ProgressData = Record<string, unknown>;

export type StorageReader = Pick<Storage, 'length' | 'key' | 'getItem'>;

export type ProgressStorage = StorageReader & Pick<Storage, 'removeItem'>;

export type ProgressCollectionOptions = {
	cloud?: boolean;
};

// Files with a leading `.` are treated as hidden: kept locally but left out of
// cloud backups and displayed faded in the playground.
export function isDotFileName(fileName: string): boolean {
	return fileName.startsWith('.');
}

const EXCLUDED_KEYS = new Set(['cojudge-firebase-settings']);
const EXCLUDED_PREFIXES = ['firebase:', 'cojudge-cloud-'];
const CLOUD_KEYS = new Set([
	'files',
	'game-results',
	'solutions',
	'testcases',
	'user-checkboxes',
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
const deferredStorageWrites = new Map<string, string>();

export function initializeCloudRestoreContext(): void {
	if (typeof window === 'undefined') return;
	deferredStorageWrites.clear();
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

export function writeProgressStorageItem(
	storage: Pick<Storage, 'setItem'>,
	key: string,
	value: string
): boolean {
	if (isCloudRestoreInProgress()) {
		deferredStorageWrites.set(key, value);
		return false;
	}
	deferredStorageWrites.delete(key);
	storage.setItem(key, value);
	return true;
}

export function resumeProgressStorageWrites(): void {
	if (typeof window === 'undefined') return;
	sessionStorage.removeItem(CLOUD_RESTORE_SESSION_KEY);
	if (isCloudRestoreInProgress()) return;
	for (const [key, value] of deferredStorageWrites) localStorage.setItem(key, value);
	deferredStorageWrites.clear();
}

function parseStoredValue(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}

// Only these FileEntry fields represent the file itself. Editor/runtime state
// like the open/active tab, cursors, run output, or touch timestamps must not
// affect the cloud data or its change checksum.
const CLOUD_FILE_FIELDS = ['fileName', 'content', 'language', 'fileId', 'order', 'type', 'sourceFileId', 'shareId'];

function cloudFileEntry(entry: unknown): unknown {
	if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
	const source = entry as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const field of CLOUD_FILE_FIELDS) {
		if (field in source) result[field] = source[field];
	}
	return result;
}

function sanitizeCloudFiles(data: ProgressData): ProgressData {
	if (!('files' in data)) return data;
	const store = data.files;
	if (!store || typeof store !== 'object' || Array.isArray(store)) return data;

	const filtered: Record<string, unknown> = {};
	for (const [slug, serialized] of Object.entries(store)) {
		let entries: unknown[] = [];
		try {
			entries = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
		} catch {
			filtered[slug] = serialized;
			continue;
		}
		if (!Array.isArray(entries)) {
			filtered[slug] = entries;
			continue;
		}
		if (entries.length === 0) {
			filtered[slug] = JSON.stringify(entries);
			continue;
		}
		const cleaned = entries
			.filter((entry) => {
				if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return true;
				const name = (entry as { fileName?: unknown }).fileName;
				return typeof name !== 'string' || !isDotFileName(name);
			})
			.map(cloudFileEntry);
		if (cleaned.length > 0) filtered[slug] = JSON.stringify(cleaned);
	}
	return { ...data, files: filtered };
}

// Returns the serialized `files` storage value trimmed down to only dotfile
// entries, or null when there are none (so callers can tell "empty" apart from
// "no dotfiles at all").
export function extractDotFilesData(storage: StorageReader): string | null {
	const raw = storage.getItem('files');
	if (!raw) return null;
	try {
		const store = JSON.parse(raw) as Record<string, unknown>;
		if (!store || typeof store !== 'object' || Array.isArray(store)) return null;
		const filtered: Record<string, unknown> = {};
		let found = false;
		for (const [slug, serialized] of Object.entries(store)) {
			if (typeof serialized !== 'string') continue;
			let entries: unknown;
			try {
				entries = JSON.parse(serialized);
			} catch {
				continue;
			}
			if (!Array.isArray(entries)) continue;
			const kept = entries.filter((entry) => {
				if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
				const name = (entry as { fileName?: unknown }).fileName;
				return typeof name === 'string' && isDotFileName(name);
			});
			if (kept.length === 0) continue;
			found = true;
			filtered[slug] = JSON.stringify(kept);
		}
		return found ? JSON.stringify(filtered) : null;
	} catch {
		return null;
	}
}

export function hasDotFiles(storage: StorageReader): boolean {
	return extractDotFilesData(storage) !== null;
}

// Lists the unique file names of the hidden (dotfile) entries present in local
// storage. Names are deduplicated since the same dotfile (e.g. `.env`) may be
// stored under multiple workspaces.
export function listDotFiles(storage: StorageReader): string[] {
	const raw = storage.getItem('files');
	if (!raw) return [];
	try {
		const store = JSON.parse(raw) as Record<string, unknown>;
		if (!store || typeof store !== 'object' || Array.isArray(store)) return [];
		const names = new Set<string>();
		for (const serialized of Object.values(store)) {
			if (typeof serialized !== 'string') continue;
			let entries: unknown;
			try {
				entries = JSON.parse(serialized);
			} catch {
				continue;
			}
			if (!Array.isArray(entries)) continue;
			for (const entry of entries) {
				if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
				const name = (entry as { fileName?: unknown }).fileName;
				if (typeof name === 'string' && isDotFileName(name)) names.add(name);
			}
		}
		return [...names];
	} catch {
		return [];
	}
}

// Re-inserts a previously extracted dotfile snapshot back into the `files`
// storage value after a cloud snapshot replaced it. Existing entries (matched
// by fileId) win; dotfile entries that still exist locally are re-added.
export function mergeDotFilesData(filesValue: string | null, dotFilesValue: string): string {
	try {
		const dotStore = JSON.parse(dotFilesValue) as Record<string, unknown>;
		if (!dotStore || typeof dotStore !== 'object' || Array.isArray(dotStore)) {
			return filesValue ?? dotFilesValue;
		}
		let merged: Record<string, unknown> = {};
		if (filesValue) {
			try {
				const parsed = JSON.parse(filesValue);
				if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
					merged = parsed as Record<string, unknown>;
				}
			} catch {
				// keep an empty merge base
			}
		}
		for (const [slug, serialized] of Object.entries(dotStore)) {
			if (typeof serialized !== 'string') continue;
			let dotEntries: unknown;
			try {
				dotEntries = JSON.parse(serialized);
			} catch {
				continue;
			}
			if (!Array.isArray(dotEntries) || dotEntries.length === 0) continue;

			let existing: unknown[] = [];
			if (typeof merged[slug] === 'string' && merged[slug]) {
				try {
					const parsed = JSON.parse(merged[slug] as string);
					if (Array.isArray(parsed)) existing = parsed;
				} catch {
					// keep existing empty
				}
			}
			const existingIds = new Set(existing.map((entry) => (entry as { fileId?: unknown })?.fileId));
			const additions = dotEntries.filter((entry) => {
				const id = (entry as { fileId?: unknown })?.fileId;
				return id !== undefined && !existingIds.has(id);
			});
			merged[slug] = JSON.stringify([...existing, ...additions]);
		}
		return JSON.stringify(merged);
	} catch {
		return filesValue ?? dotFilesValue;
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
	return options.cloud ? sanitizeCloudFiles(data) : data;
}

export function clearProgressStorage(storage: ProgressStorage): void {
	const keys: string[] = [];
	for (let index = 0; index < storage.length; index++) {
		const key = storage.key(index);
		if (key && isProgressStorageKey(key)) keys.push(key);
	}
	for (const key of keys) storage.removeItem(key);
}

export function serializeProgressData(data: ProgressData): string {
	const sorted: ProgressData = {};
	for (const key of Object.keys(data).sort()) sorted[key] = data[key];
	return JSON.stringify(sorted);
}

export function isMeaningfulProgress(data: ProgressData): boolean {
	const ignoredKeys = new Set([
		'banner-dismissed',
		'exec-pane-height',
		'open-groups',
		'pane-width',
		'user-settings'
	]);

	for (const [key, value] of Object.entries(data)) {
		if (ignoredKeys.has(key)) continue;
		if (Array.isArray(value) && value.length === 0) continue;
		if (value && typeof value === 'object' && Object.keys(value).length === 0) continue;
		if (value === '' || value === null || value === false) continue;
		return true;
	}
	return false;
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
