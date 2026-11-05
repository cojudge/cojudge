// Pure cloud-stash model. A stash is a three-way change set between the cloud
// copy that was current when the stash was created and the local working copy.
// Keeping this layer free of Firebase/storage access makes the risky merge and
// cleanup rules unit-testable.

import {
	applySelectedChanges,
	CHECKBOXES_FILE_ID,
	computeCloudChanges,
	GAME_RESULT_FILE_ID_PREFIX,
	SOLUTION_FILE_ID_PREFIX,
	STORAGE_FILE_ID_PREFIX,
	TESTCASES_FILE_ID_PREFIX,
	USER_SETTINGS_FILE_ID,
	WHITEBOARD_BOARD_KEY,
	WHITEBOARD_FILE_ID,
	WORKSPACE_FILE_ID_PREFIX,
	type FileStore,
	type ProgressStore
} from './cloudFileChange';
import { sanitizeCloudFiles, type ProgressData } from './progressBackup';
import { PASTED_IMAGES_KEY, findPastedImageLinks, parsePastedImageLink } from './utils/imageStore';

export const CLOUD_STASH_SCHEMA_VERSION = 1;
export const CLOUD_STASH_LIMIT = 10;
export const CLOUD_STASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const CLOUD_STASH_LEASE_MS = 60 * 1000;
export const MAX_CLOUD_STASH_BYTES = 6 * 1024 * 1024;
export const MAX_CLOUD_STASH_PARTS = 12;

export type CloudStashStatus = 'ready' | 'popping';

export type CloudStashSummary = {
	stashId: string;
	name: string;
	workspaceId: string;
	repoId: string;
	baseRevisionId: string | null;
	baseChecksum: string | null;
	checksum: string;
	changeCount: number;
	partCount: number;
	totalBytes: number;
	createdAt: number;
	expiresAt: number;
	status: CloudStashStatus;
	leaseOwner: string | null;
	leaseExpiresAt: number;
};

export type StashValue = {
	present: boolean;
	value: unknown;
};

export type StashChange = {
	fileId: string;
	slug: string;
	fileName: string;
	kind: 'tracked' | 'untracked';
	base: StashValue;
	local: StashValue;
};

export type StashPayload = {
	version: typeof CLOUD_STASH_SCHEMA_VERSION;
	changes: StashChange[];
	images: Record<string, string>;
};

export type StashConflictReason =
	| 'changed-after-stash'
	| 'deleted-after-stash'
	| 'created-after-stash';

export type StashConflict = {
	fileId: string;
	slug: string;
	fileName: string;
	reason: StashConflictReason;
};

export type StashPopPlan = {
	data: ProgressData;
	applied: StashChange[];
	alreadyApplied: StashChange[];
	conflicts: StashConflict[];
};

export type CloudStashBaseChoice =
	| { source: 'cached' }
	| { source: 'remote' }
	| { source: 'history'; revisionId: string }
	| { source: 'empty' }
	| { source: 'unknown' };

function stableValue(value: unknown): string {
	if (value === null) return 'null';
	if (typeof value === 'undefined') return 'undefined';
	if (typeof value !== 'object') return JSON.stringify(value) ?? String(value);
	if (Array.isArray(value)) return `[${value.map(stableValue).join(',')}]`;
	const entries = Object.entries(value as Record<string, unknown>)
		.filter(([, entry]) => entry !== undefined)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([key, entry]) => `${JSON.stringify(key)}:${stableValue(entry)}`);
	return `{${entries.join(',')}}`;
}

export function stashValuesEqual(a: StashValue, b: StashValue): boolean {
	return a.present === b.present && stableValue(a.value) === stableValue(b.value);
}

function recordFrom(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function parseEntries(store: FileStore, slug: string): Array<Record<string, unknown>> {
	const raw = store[slug];
	if (typeof raw !== 'string') return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((entry): entry is Record<string, unknown> =>
					Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry)
				)
			: [];
	} catch {
		return [];
	}
}

function nestedValue(data: ProgressData, key: string, slug: string): StashValue {
	const record = recordFrom(data[key]);
	return slug in record
		? { present: true, value: record[slug] }
		: { present: false, value: null };
}

function fileGroupValue(data: ProgressData, fileId: string): StashValue {
	const files = (data.files as FileStore | undefined) ?? {};
	const groups: Array<{ slug: string; entries: Array<Record<string, unknown>> }> = [];
	for (const slug of Object.keys(files).sort()) {
		const entries = parseEntries(files, slug).filter((entry) => entry['fileId'] === fileId);
		if (entries.length > 0) groups.push({ slug, entries });
	}
	return groups.length > 0
		? { present: true, value: groups }
		: { present: false, value: null };
}

export function stashValueFor(data: ProgressData, fileId: string): StashValue {
	if (fileId === WHITEBOARD_FILE_ID) {
		return WHITEBOARD_BOARD_KEY in data
			? { present: true, value: data[WHITEBOARD_BOARD_KEY] }
			: { present: false, value: null };
	}
	if (fileId.startsWith(SOLUTION_FILE_ID_PREFIX)) {
		return nestedValue(data, 'solutions', fileId.slice(SOLUTION_FILE_ID_PREFIX.length));
	}
	if (fileId.startsWith(TESTCASES_FILE_ID_PREFIX)) {
		return nestedValue(data, 'testcases', fileId.slice(TESTCASES_FILE_ID_PREFIX.length));
	}
	if (fileId.startsWith(GAME_RESULT_FILE_ID_PREFIX)) {
		return nestedValue(data, 'game-results', fileId.slice(GAME_RESULT_FILE_ID_PREFIX.length));
	}
	if (fileId.startsWith(WORKSPACE_FILE_ID_PREFIX)) {
		return nestedValue(data, 'files', fileId.slice(WORKSPACE_FILE_ID_PREFIX.length));
	}
	if (fileId.startsWith(STORAGE_FILE_ID_PREFIX)) {
		const key = fileId.slice(STORAGE_FILE_ID_PREFIX.length);
		return key in data
			? { present: true, value: data[key] }
			: { present: false, value: null };
	}
	if (fileId === CHECKBOXES_FILE_ID) {
		return 'user-checkboxes' in data
			? { present: true, value: data['user-checkboxes'] }
			: { present: false, value: null };
	}
	if (fileId === USER_SETTINGS_FILE_ID) {
		return 'user-settings' in data
			? { present: true, value: data['user-settings'] }
			: { present: false, value: null };
	}
	return fileGroupValue(data, fileId);
}

// Captures only changes from the cloud baseline: modified tracked files,
// deletions, and local-only files. Unchanged and hidden dotfiles are omitted.
export function collectStashChanges(base: ProgressData, local: ProgressData): StashChange[] {
	const cloud = sanitizeCloudFiles(base);
	const working = sanitizeCloudFiles(local);
	const changes: StashChange[] = [];

	for (const change of computeCloudChanges(working, cloud)) {
		const baseValue = stashValueFor(cloud, change.fileId);
		const localValue = stashValueFor(working, change.fileId);
		if (stashValuesEqual(baseValue, localValue)) continue;
		changes.push({
			fileId: change.fileId,
			slug: change.slug,
			fileName: change.fileName,
			kind: baseValue.present ? 'tracked' : 'untracked',
			base: baseValue,
			local: localValue
		});
	}

	return changes.sort((a, b) => a.fileId.localeCompare(b.fileId));
}

// Picks out only pasted-image payloads referenced by markdown entries that are
// part of this stash, keeping the stash small and avoiding unrelated blobs.
export function collectStashImages(
	localData: ProgressData,
	changes: readonly StashChange[]
): Record<string, string> {
	const available = recordFrom(localData[PASTED_IMAGES_KEY]);
	const ids = new Set<string>();
	const collectEntries = (entries: unknown) => {
		if (!Array.isArray(entries)) return;
		for (const entry of entries) {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
			const file = entry as Record<string, unknown>;
			if (file.language !== 'markdown' || typeof file.content !== 'string') continue;
			for (const link of findPastedImageLinks(file.content)) {
				const id = parsePastedImageLink(link);
				if (id) ids.add(id);
			}
		}
	};
	for (const change of changes) {
		if (!change.local.present) continue;
		if (change.fileId.startsWith(WORKSPACE_FILE_ID_PREFIX)) {
			if (typeof change.local.value === 'string') {
				try {
					collectEntries(JSON.parse(change.local.value));
				} catch {
					// A malformed workspace payload is rejected later by validation.
				}
			}
			continue;
		}
		if (change.fileId === WHITEBOARD_FILE_ID
			|| change.fileId.startsWith(SOLUTION_FILE_ID_PREFIX)
			|| change.fileId.startsWith(TESTCASES_FILE_ID_PREFIX)
			|| change.fileId.startsWith(GAME_RESULT_FILE_ID_PREFIX)
			|| change.fileId.startsWith(STORAGE_FILE_ID_PREFIX)
			|| change.fileId === CHECKBOXES_FILE_ID
			|| change.fileId === USER_SETTINGS_FILE_ID) continue;
		if (Array.isArray(change.local.value)) {
			for (const group of change.local.value as Array<{ entries?: unknown }>) {
				collectEntries(group.entries);
			}
		}
	}
	const images: Record<string, string> = {};
	for (const id of ids) {
		const value = available[id];
		if (typeof value === 'string') images[id] = value;
	}
	return images;
}

// A stash is a three-way diff, so it must be based on the cloud revision the
// local copy was last synced to, not on whatever is newest now. Prefer the
// cached clone; if a background check replaced it, fall back to a retained
// revision with the same checksum. Never guess: an unknown base could turn
// someone else's cloud edits into local deletions when the stash is popped.
export function chooseCloudStashBase(options: {
	lastSyncedHash: string | null;
	cached: { checksum: string } | null;
	remote: { checksum: string } | null;
	history: ReadonlyArray<{ checksum: string; revisionId: string }>;
}): CloudStashBaseChoice {
	const { lastSyncedHash, cached, remote, history } = options;
	if (cached && lastSyncedHash && cached.checksum === lastSyncedHash) {
		return { source: 'cached' };
	}
	if (remote && lastSyncedHash === remote.checksum) {
		return { source: 'remote' };
	}
	if (lastSyncedHash) {
		const retained = history.find((revision) => revision.checksum === lastSyncedHash);
		if (retained) return { source: 'history', revisionId: retained.revisionId };
		return { source: 'unknown' };
	}
	if (!remote) return { source: 'empty' };
	return { source: 'unknown' };
}

function setNestedValue(source: ProgressStore, key: string, slug: string, value: unknown): void {
	const record = { ...recordFrom(source[key]), [slug]: value };
	source[key] = record;
}

function sourceForStashChanges(changes: readonly StashChange[]): ProgressStore {
	const source: ProgressStore = {};
	for (const change of changes) {
		if (!change.local.present) continue;
		if (change.fileId === WHITEBOARD_FILE_ID) {
			source[WHITEBOARD_BOARD_KEY] = change.local.value;
		} else if (change.fileId.startsWith(SOLUTION_FILE_ID_PREFIX)) {
			setNestedValue(source, 'solutions', change.fileId.slice(SOLUTION_FILE_ID_PREFIX.length), change.local.value);
		} else if (change.fileId.startsWith(TESTCASES_FILE_ID_PREFIX)) {
			setNestedValue(source, 'testcases', change.fileId.slice(TESTCASES_FILE_ID_PREFIX.length), change.local.value);
		} else if (change.fileId.startsWith(GAME_RESULT_FILE_ID_PREFIX)) {
			setNestedValue(source, 'game-results', change.fileId.slice(GAME_RESULT_FILE_ID_PREFIX.length), change.local.value);
		} else if (change.fileId.startsWith(WORKSPACE_FILE_ID_PREFIX)) {
			setNestedValue(source, 'files', change.fileId.slice(WORKSPACE_FILE_ID_PREFIX.length), change.local.value);
		} else if (change.fileId.startsWith(STORAGE_FILE_ID_PREFIX)) {
			source[change.fileId.slice(STORAGE_FILE_ID_PREFIX.length)] = change.local.value;
		} else if (change.fileId === CHECKBOXES_FILE_ID) {
			source['user-checkboxes'] = change.local.value;
		} else if (change.fileId === USER_SETTINGS_FILE_ID) {
			source['user-settings'] = change.local.value;
		} else {
			const files = (source.files as FileStore | undefined) ?? {};
			for (const group of change.local.value as Array<{
				slug: string;
				entries: Array<Record<string, unknown>>;
			}>) {
				const existing = parseEntries(files, group.slug).filter(
					(entry) => entry['fileId'] !== change.fileId
				);
				files[group.slug] = JSON.stringify([...existing, ...group.entries]);
			}
			source.files = files;
		}
	}
	return source;
}

function conflictReason(base: StashValue, local: StashValue, current: StashValue): StashConflictReason {
	if (base.present && !current.present) return 'deleted-after-stash';
	if (!base.present && current.present) return 'created-after-stash';
	if (!local.present && current.present) return 'changed-after-stash';
	return 'changed-after-stash';
}

// Plans a pop without mutating storage. A path is only applied when the current
// value still matches the stash baseline (or already matches the stashed value).
// Every other path is reported as a conflict and left untouched.
export function planStashPop(currentData: ProgressData, changes: readonly StashChange[]): StashPopPlan {
	const current = sanitizeCloudFiles(currentData);
	const applicable: StashChange[] = [];
	const alreadyApplied: StashChange[] = [];
	const conflicts: StashConflict[] = [];

	for (const change of changes) {
		const currentValue = stashValueFor(current, change.fileId);
		if (stashValuesEqual(currentValue, change.local)) {
			alreadyApplied.push(change);
		} else if (stashValuesEqual(currentValue, change.base)) {
			applicable.push(change);
		} else {
			conflicts.push({
				fileId: change.fileId,
				slug: change.slug,
				fileName: change.fileName,
				reason: conflictReason(change.base, change.local, currentValue)
			});
		}
	}

	const data = applicable.length > 0
		? (applySelectedChanges(currentData, applicable.map((change) => change.fileId), sourceForStashChanges(applicable)) as ProgressData)
		: currentData;

	return { data, applied: applicable, alreadyApplied, conflicts };
}

export function cloudStashIsExpired(stash: Pick<CloudStashSummary, 'expiresAt'>, now = Date.now()): boolean {
	return stash.expiresAt <= now;
}

export function cloudStashIsLeased(stash: CloudStashSummary, now = Date.now()): boolean {
	return stash.status === 'popping' && stash.leaseExpiresAt > now;
}

export function selectCloudStashIdsForCleanup(
	stashes: readonly CloudStashSummary[],
	now = Date.now(),
	limit = CLOUD_STASH_LIMIT
): string[] {
	const expired: CloudStashSummary[] = [];
	const retained: CloudStashSummary[] = [];
	for (const stash of stashes) {
		if (cloudStashIsLeased(stash, now)) continue;
		if (cloudStashIsExpired(stash, now)) expired.push(stash);
		else retained.push(stash);
	}
	retained.sort((a, b) => b.createdAt - a.createdAt || a.stashId.localeCompare(b.stashId));
	const excess = retained
		.slice(Math.max(0, limit))
		.sort((a, b) => a.createdAt - b.createdAt || a.stashId.localeCompare(b.stashId));
	return [
		...expired.map((stash) => stash.stashId),
		...excess.map((stash) => stash.stashId)
	];
}

export function makeCloudStashId(): string {
	const random = globalThis.crypto?.randomUUID?.()
		?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
	return `stash-${random.replace(/[^A-Za-z0-9-]/g, '').slice(0, 80)}`;
}

export function normalizeCloudStashName(value: unknown, now = Date.now()): string {
	if (typeof value === 'string') {
		const trimmed = value.trim().replace(/\s+/g, ' ');
		if (trimmed) return trimmed.slice(0, 80);
	}
	return `Stash ${new Date(now).toISOString()}`;
}

export function serializeStashPayload(payload: StashPayload): string {
	return JSON.stringify({
		version: CLOUD_STASH_SCHEMA_VERSION,
		changes: payload.changes,
		images: payload.images
	});
}

function validStashValue(value: unknown): value is StashValue {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const record = value as Record<string, unknown>;
	return typeof record.present === 'boolean' && 'value' in record;
}

export function parseStashPayload(value: unknown): StashPayload {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Cloud stash has an invalid format.');
	}
	const record = value as Record<string, unknown>;
	if (record.version !== CLOUD_STASH_SCHEMA_VERSION || !Array.isArray(record.changes)) {
		throw new Error('Cloud stash has an unsupported format.');
	}
	const images: Record<string, string> = {};
	if (record.images !== undefined) {
		if (!record.images || typeof record.images !== 'object' || Array.isArray(record.images)) {
			throw new Error('Cloud stash has invalid image data.');
		}
		for (const [id, dataUrl] of Object.entries(record.images)) {
			if (typeof dataUrl !== 'string') throw new Error('Cloud stash has invalid image data.');
			images[id] = dataUrl;
		}
	}
	const changes = record.changes.map((entry): StashChange => {
		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
			throw new Error('Cloud stash contains an invalid change.');
		}
		const change = entry as Record<string, unknown>;
		if (
			typeof change.fileId !== 'string'
			|| typeof change.slug !== 'string'
			|| typeof change.fileName !== 'string'
			|| (change.kind !== 'tracked' && change.kind !== 'untracked')
			|| !validStashValue(change.base)
			|| !validStashValue(change.local)
		) {
			throw new Error('Cloud stash contains an invalid change.');
		}
		return {
			fileId: change.fileId,
			slug: change.slug,
			fileName: change.fileName,
			kind: change.kind,
			base: change.base,
			local: change.local
		};
	});
	return { version: CLOUD_STASH_SCHEMA_VERSION, changes, images };
}
