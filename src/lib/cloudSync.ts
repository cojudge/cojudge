import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { onIdTokenChanged, type Auth, type Unsubscribe, type User } from 'firebase/auth';
import {
	Bytes,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	updateDoc,
	writeBatch,
	type Firestore
} from 'firebase/firestore/lite';
import { initFirebase, signInWithGoogle, signOutFirebase } from '$lib/firebase';
import {
	CLOUD_HISTORY_LIMIT,
	isSameCloudOperation,
	needsCloudAccountConfirmation,
	needsSignOutDataChoice,
	nextCloudSnapshotSlot,
	resolveSyncDirection,
	type SyncIntent
} from '$lib/cloudSyncPolicy';
import {
	clearProgressStorage,
	collectProgressData,
	extractDotFilesData,
	mergeDotFilesData,
	CLOUD_FLUSH_EVENT,
	CLOUD_RESTORE_COMPLETE_KEY,
	CLOUD_RESTORE_LOCK_KEY,
	CLOUD_RESTORE_SESSION_KEY,
	CLOUD_SNAPSHOT_LEGACY_VERSION,
	CLOUD_SNAPSHOT_SIDECAR_VERSION,
	CLOUD_SNAPSHOT_VERSION,
	decodeProgressParts,
	encodeProgressParts,
	hashProgress,
	initializeCloudRestoreContext,
	isCloudRestoreInProgress,
	isMeaningfulProgress,
	resumeProgressStorageWrites,
	sanitizeCloudFiles,
	serializeProgressData,
	type ProgressData
} from '$lib/progressBackup';
import {
	CLOUD_ASSET_CHUNK_BYTES,
	MAX_CLOUD_ASSET_BYTES,
	MAX_CLOUD_ASSET_PARTS,
	decodeCloudAssetParts,
	encodeCloudAssetParts,
	extractCloudAssets,
	hashCloudAssetBytes,
	hydrateCloudAssets
} from '$lib/cloudAssets';
import { applyProgressData } from '$lib/progressBackupClient';
import {
	PASTED_IMAGES_KEY,
	parsePastedImageLink,
	findPastedImageLinks,
	getAllPastedImages,
	importPastedImages,
	extractPastedImages
} from '$lib/utils/imageStore';
import { FORK_TRANSFER_STORAGE_KEY } from '$lib/forkTransfer';
import fileStore, { fileSyncVersion } from '$lib/stores/fileStore';
import {
	CLOUD_FILE_DISCARDED_EVENT,
	applySelectedChanges,
	computeCloudChanges,
	WHITEBOARD_BOARD_KEY,
	WHITEBOARD_FILE_ID,
	WHITEBOARD_RESTORED_EVENT,
	type FileChange,
	type FileStore,
	type ProgressStore
} from '$lib/cloudFileChange';
import {
	CLOUD_STASH_LEASE_MS,
	CLOUD_STASH_SCHEMA_VERSION,
	CLOUD_STASH_TTL_MS,
	MAX_CLOUD_STASH_BYTES,
	MAX_CLOUD_STASH_PARTS,
	chooseCloudStashBase,
	cloudStashIsExpired,
	cloudStashIsLeased,
	collectStashChanges,
	collectStashImages,
	makeCloudStashId,
	normalizeCloudStashName,
	parseStashPayload,
	planStashPop,
	selectCloudStashIdsForCleanup,
	serializeStashPayload,
	type CloudStashSummary,
	type StashChange,
	type StashConflict,
	type StashPayload
} from '$lib/cloudStash';

const DEVICE_META_KEY = 'cojudge-cloud-sync-meta';
const CLOUD_CLONE_KEY = 'cojudge-cloud-clone';
const LOCAL_CLEAR_COMPLETE_KEY = 'cojudge-cloud-local-clear-complete';
const SYNC_INTERVAL_MS = 5 * 60 * 1000;
const MAX_SNAPSHOT_BYTES = 6 * 1024 * 1024;
const MAX_SNAPSHOT_PARTS = 12;
const CLOUD_ASSET_SET_VERSION = 1;
const CLOUD_ASSET_BATCH_PARTS = 8;
const CLOUD_ASSET_STALE_WAIT_MS = 5 * 60 * 1000;
const CLOUD_ASSET_READY_WAIT_MS = CLOUD_ASSET_STALE_WAIT_MS + 60 * 1000;
const CLOUD_RESTORE_WEB_LOCK = 'cojudge-cloud-restore';
const CLOUD_STASH_WEB_LOCK = 'cojudge-cloud-stash';
const CLOUD_STASH_REPO_ID = 'cojudge-progress';
const CLOUD_STASH_CLEANUP_LIMIT = 25;

type CloudAuthStatus = 'initializing' | 'unavailable' | 'signed-out' | 'signing-in' | 'signed-in';
type CloudOperationStatus = 'idle' | 'syncing' | 'offline' | 'error';
export type CloudRemoteStatus = 'unknown' | 'loading' | 'absent' | 'present' | 'error';
export type CloudResolution = 'account' | 'local-changes' | 'conflict';
export type CloudSignOutCheck = 'matching' | 'unsynced' | 'unknown';
export type CloudDisconnectResult = 'signed-out' | Exclude<CloudSignOutCheck, 'matching'>;

export type CloudRevision = {
	revisionId: string;
	createdAt: number;
	current: boolean;
	totalBytes: number;
};

export type CloudUser = {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
};

export type CloudProgress = {
	label: string;
	value: number | null;
};

export type CloudStashPopResult = {
	stash: CloudStashSummary;
	applied: StashChange[];
	alreadyApplied: StashChange[];
	conflicts: StashConflict[];
	dropped: boolean;
};

export type CloudSyncState = {
	authStatus: CloudAuthStatus;
	syncStatus: CloudOperationStatus;
	user: CloudUser | null;
	lastSyncedAt: number | null;
	resolution: CloudResolution | null;
	remoteStatus: CloudRemoteStatus;
	history: CloudRevision[];
	error: string | null;
	progress: CloudProgress | null;
};

type DeviceUserMeta = {
	lastSyncedHash: string | null;
	lastSyncedAt: number | null;
};

type DeviceMeta = {
	version: 2;
	workspaceId: string | null;
	users: Record<string, DeviceUserMeta>;
};

type LocalSnapshot = {
	data: ProgressData;
	serialized: string;
	// localStorage-only serialization (no pasted-images key), used by the
	// pre-apply integrity check that compares against a fresh re-read.
	storageSerialized: string;
	checksum: string;
	meaningful: boolean;
	meta: DeviceUserMeta;
};

type UploadSnapshot = Pick<LocalSnapshot, 'data' | 'checksum' | 'meaningful'>;

type RemoteSnapshotMeta = {
	schemaVersion: number;
	snapshotId: string;
	revisionId: string;
	parentRevisionId: string | null;
	checksum: string;
	payloadChecksum: string;
	partCount: number;
	totalBytes: number;
	assetStorage: 'none' | 'revision' | 'shared';
	assetSetId: string | null;
	assetPartCount: number;
	assetBytes: number;
	assetChecksum: string | null;
	updatedAt: number;
	meaningful: boolean;
};

type CloudAssetSet = {
	storage: 'revision' | 'shared';
	snapshotId: string | null;
	assetSetId: string;
	partCount: number;
	totalBytes: number;
	checksum: string;
};

type CloudCloneRecord = {
	accountId: string;
	checksum: string;
	revisionId: string | null;
	serialized: string;
};

type DownloadedSnapshot = {
	data: ProgressData;
	serialized: string;
};

type SyncMode = SyncIntent | 'force-upload' | 'force-download';

type OperationContext = {
	auth: Auth;
	db: Firestore;
	projectId: string;
	uid: string;
	authEpoch: number;
	generation: number;
};

type LockManager = {
	request<T>(
		name: string,
		options: { mode: 'exclusive'; ifAvailable: true },
		callback: (lock: object | null) => Promise<T>
	): Promise<T>;
};

type CoordinationAction = 'flush' | 'prepare' | 'clear';

const initialState: CloudSyncState = {
	authStatus: 'initializing',
	syncStatus: 'idle',
	user: null,
	lastSyncedAt: null,
	resolution: null,
	remoteStatus: 'unknown',
	history: [],
	error: null,
	progress: null
};

export const cloudSyncState = writable<CloudSyncState>(initialState);

function setCloudProgress(label: string, value: number | null): void {
	cloudSyncState.update((state) => ({ ...state, progress: { label, value } }));
}

function clearCloudProgress(): void {
	cloudSyncState.update((state) => (state.progress ? { ...state, progress: null } : state));
}

let activeAuth: Auth | null = null;
let activeDb: Firestore | null = null;
let authUnsubscribe: Unsubscribe | null = null;
let syncInterval: ReturnType<typeof setInterval> | null = null;
let onlineListener: (() => void) | null = null;
let storageListener: ((event: StorageEvent) => void) | null = null;
let fileStoreUnsubscribe: (() => void) | null = null;
let dirtyRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let coordinationChannel: BroadcastChannel | null = null;
let restoreReloadScheduled = false;
let coordinationContextId = '';
let startPromise: Promise<void> | null = null;
let syncPromise: Promise<void> | null = null;
let syncContext: OperationContext | null = null;
let authEpoch = 0;
let generation = 0;
let observedAuthIdentity = '';
let memoryCloudClone: CloudCloneRecord | null = null;

function userView(user: User): CloudUser {
	return {
		uid: user.uid,
		displayName: user.displayName,
		email: user.email,
		photoURL: user.photoURL
	};
}

function errorMessage(error: unknown): string {
	if (typeof error === 'string' && error.trim()) return error;
	if (error instanceof Error && error.message) return error.message;
	if (error && typeof error === 'object' && 'message' in error) return String(error.message);
	return 'Cloud sync failed.';
}

function captureOperationContext(): OperationContext | null {
	const auth = activeAuth;
	const db = activeDb;
	const user = auth?.currentUser;
	const projectId = db?.app.options.projectId;
	if (!auth || !db || !projectId || !user || user.isAnonymous) return null;
	return { auth, db, projectId, uid: user.uid, authEpoch, generation };
}

function isOperationCurrent(context: OperationContext): boolean {
	const currentUser = context.auth.currentUser;
	if (!currentUser) return false;
	return isSameCloudOperation(
			{
				projectId: context.projectId,
				uid: context.uid,
				authEpoch: context.authEpoch,
				generation: context.generation
			},
			{
				projectId: context.db.app.options.projectId ?? '',
				uid: currentUser.uid,
				authEpoch,
				generation
			}
		)
		&& activeAuth === context.auth
		&& activeDb === context.db
		&& currentUser.isAnonymous === false;
}

function defaultUserMeta(): DeviceUserMeta {
	return {
		lastSyncedHash: null,
		lastSyncedAt: null
	};
}

function cloudAccountId(projectId: string, uid: string): string {
	return JSON.stringify([projectId, uid]);
}

function readDeviceMeta(): DeviceMeta {
	if (!browser) return { version: 2, workspaceId: null, users: {} };
	try {
		const parsed = JSON.parse(localStorage.getItem(DEVICE_META_KEY) || 'null');
		if (parsed?.version === 2 && parsed.users && typeof parsed.users === 'object') {
			return {
				version: 2,
				workspaceId: typeof parsed.workspaceId === 'string' ? parsed.workspaceId : null,
				users: parsed.users
			};
		}
	} catch (error) {
		console.warn('Ignoring invalid Cojudge Cloud metadata:', error);
	}
	return { version: 2, workspaceId: null, users: {} };
}

function writeDeviceMeta(meta: DeviceMeta): void {
	localStorage.setItem(DEVICE_META_KEY, JSON.stringify(meta));
}

function saveUserMeta(context: OperationContext, userMeta: DeviceUserMeta): void {
	const meta = readDeviceMeta();
	meta.users[cloudAccountId(context.projectId, context.uid)] = userMeta;
	writeDeviceMeta(meta);
}

function parseCloudCloneRecord(raw: string | null): CloudCloneRecord | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Partial<CloudCloneRecord>;
		if (
			typeof parsed.accountId !== 'string'
			|| typeof parsed.checksum !== 'string'
			|| typeof parsed.serialized !== 'string'
			|| (parsed.revisionId !== null && typeof parsed.revisionId !== 'string' && parsed.revisionId !== undefined)
		) {
			return null;
		}
		return {
			accountId: parsed.accountId,
			checksum: parsed.checksum,
			revisionId: typeof parsed.revisionId === 'string' ? parsed.revisionId : null,
			serialized: parsed.serialized
		};
	} catch {
		return null;
	}
}

function readCloudClone(accountId: string): { checksum: string; revisionId: string | null; data: ProgressData } | null {
	const record =
		memoryCloudClone?.accountId === accountId
			? memoryCloudClone
			: parseCloudCloneRecord(browser ? localStorage.getItem(CLOUD_CLONE_KEY) : null);
	if (!record || record.accountId !== accountId) return null;
	if (memoryCloudClone?.accountId !== accountId) memoryCloudClone = record;
	try {
		const parsed = JSON.parse(record.serialized);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
		return {
			checksum: record.checksum,
			revisionId: record.revisionId,
			data: parsed as ProgressData
		};
	} catch {
		return null;
	}
}

function writeCloudClone(
	accountId: string,
	checksum: string,
	serialized: string,
	revisionId: string | null = null
): void {
	const record: CloudCloneRecord = { accountId, checksum, revisionId, serialized };
	memoryCloudClone = record;
	if (!browser) return;
	try {
		localStorage.setItem(CLOUD_CLONE_KEY, JSON.stringify(record));
	} catch (error) {
		console.warn('Cojudge Cloud could not persist the local cloud clone:', error);
	}
}

function clearCloudClone(): void {
	memoryCloudClone = null;
	if (browser) localStorage.removeItem(CLOUD_CLONE_KEY);
}

function referencedPastedImageIds(filesValue: unknown): Set<string> {
	const ids = new Set<string>();
	if (filesValue && typeof filesValue === 'object' && !Array.isArray(filesValue)) {
		for (const serialized of Object.values(filesValue)) {
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
				const file = entry as Record<string, unknown>;
				if (file.language !== 'markdown' || typeof file.content !== 'string') continue;
				for (const link of findPastedImageLinks(file.content)) {
					const id = parsePastedImageLink(link);
					if (id) ids.add(id);
				}
			}
		}
	}
	return ids;
}

// Collects the IndexedDB-backed pasted images referenced by markdown file
// contents, as { [id]: dataUrl }. Returns null when none are referenced so the
// snapshot stays image-free (and checksums unchanged) for image-less documents.
async function collectReferencedPastedImages(filesValue: unknown): Promise<Record<string, string> | null> {
	const ids = referencedPastedImageIds(filesValue);
	if (ids.size === 0) return null;

	const all = await getAllPastedImages();
	const record: Record<string, string> = {};
	const missing: string[] = [];
	for (const id of ids) {
		const dataUrl = all[id];
		if (dataUrl) record[id] = dataUrl;
		else missing.push(id);
	}
	if (missing.length > 0) {
		throw new Error(
			`${missing.length} pasted ${missing.length === 1 ? 'image is' : 'images are'} unavailable locally. Remove or paste ${missing.length === 1 ? 'it' : 'them'} again before syncing.`
		);
	}
	return Object.keys(record).length > 0 ? record : null;
}

function retainReferencedPastedImages(
	data: ProgressData,
	sources: Array<Record<string, string> | null>
): ProgressData {
	const result = { ...data };
	const images: Record<string, string> = {};
	for (const id of referencedPastedImageIds(result.files)) {
		for (const source of sources) {
			const dataUrl = source?.[id];
			if (!dataUrl) continue;
			images[id] = dataUrl;
			break;
		}
	}
	if (Object.keys(images).length > 0) result[PASTED_IMAGES_KEY] = images;
	else delete result[PASTED_IMAGES_KEY];
	return result;
}

async function readLocalSnapshot(
	context: OperationContext,
	options: { flush?: boolean } = {}
): Promise<LocalSnapshot> {
	if (options.flush !== false) window.dispatchEvent(new Event(CLOUD_FLUSH_EVENT));
	const data = collectProgressData(localStorage, { cloud: true });
	const storageSerialized = serializeProgressData(data);
	const pastedImages = await collectReferencedPastedImages(data.files);
	if (pastedImages) data[PASTED_IMAGES_KEY] = pastedImages;
	const serialized = serializeProgressData(data);
	const checksum = await hashProgress(serialized);
	const meaningful = isMeaningfulProgress(data);
	const device = readDeviceMeta();
	const meta = {
		...defaultUserMeta(),
		...device.users[cloudAccountId(context.projectId, context.uid)]
	};

	return { data, serialized, storageSerialized, checksum, meaningful, meta };
}

function reloadForCloudRestore(): void {
	if (restoreReloadScheduled) return;
	restoreReloadScheduled = true;
	sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
	setTimeout(() => window.location.reload(), 0);
}

function announceCloudRestore(localDataCleared = false, reload = true): void {
	const completedAt = Date.now().toString();
	try {
		if (localDataCleared) localStorage.setItem(LOCAL_CLEAR_COMPLETE_KEY, completedAt);
		localStorage.setItem(CLOUD_RESTORE_COMPLETE_KEY, completedAt);
		coordinationChannel?.postMessage({ type: 'restore', completedAt, localDataCleared });
	} catch (error) {
		console.warn('Cojudge Cloud could not notify another open window:', error);
	}
	if (reload) reloadForCloudRestore();
	else resumeAfterCloudMutation();
}

function startCoordination(): void {
	if (typeof BroadcastChannel !== 'undefined') {
		coordinationContextId = crypto.randomUUID();
		coordinationChannel = new BroadcastChannel('cojudge-cloud-sync');
		coordinationChannel.addEventListener('message', (event) => {
			const message = event.data;
			if (!message || message.from === coordinationContextId) return;
			if (message.type === 'probe') {
				coordinationChannel?.postMessage({
					type: 'probe-ack',
					requestId: message.requestId,
					from: coordinationContextId
				});
			} else if (message.type === 'flush' || message.type === 'prepare' || message.type === 'clear') {
				window.dispatchEvent(new Event(CLOUD_FLUSH_EVENT));
				if (message.type !== 'flush') {
					sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
					setTimeout(() => {
						if (!localStorage.getItem(CLOUD_RESTORE_LOCK_KEY)) {
							resumeProgressStorageWrites();
						}
					}, 10_000);
				}
				coordinationChannel?.postMessage({
					type: `${message.type}-ack`,
					requestId: message.requestId,
					from: coordinationContextId
				});
			} else if (message.type === 'resume') {
				resumeProgressStorageWrites();
			} else if (message.type === 'restore') {
				if (message.localDataCleared) sessionStorage.removeItem(FORK_TRANSFER_STORAGE_KEY);
				reloadForCloudRestore();
			}
		});
	}

	storageListener = (event) => {
		if (event.key === CLOUD_RESTORE_LOCK_KEY && event.newValue) {
			sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
		} else if (event.key === LOCAL_CLEAR_COMPLETE_KEY && event.newValue) {
			sessionStorage.removeItem(FORK_TRANSFER_STORAGE_KEY);
			reloadForCloudRestore();
		} else if (event.key === CLOUD_RESTORE_COMPLETE_KEY && event.newValue) {
			reloadForCloudRestore();
		}
	};
	window.addEventListener('storage', storageListener);
}

function stopCoordination(): void {
	coordinationChannel?.close();
	coordinationChannel = null;
	if (storageListener) window.removeEventListener('storage', storageListener);
	storageListener = null;
	restoreReloadScheduled = false;
	coordinationContextId = '';
}

function wait(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function resumeAfterCloudMutation(): void {
	localStorage.removeItem(CLOUD_RESTORE_LOCK_KEY);
	resumeProgressStorageWrites();
	coordinationChannel?.postMessage({ type: 'resume', from: coordinationContextId });
}

async function coordinateOtherContexts(type: CoordinationAction): Promise<void> {
	const channel = coordinationChannel;
	if (!channel) return;

	const requestId = crypto.randomUUID();
	const peers = new Set<string>();
	const handleProbe = (event: MessageEvent) => {
		if (event.data?.type === 'probe-ack' && event.data.requestId === requestId) {
			peers.add(String(event.data.from));
		}
	};
	channel.addEventListener('message', handleProbe);
	channel.postMessage({ type: 'probe', requestId, from: coordinationContextId });
	await wait(150);
	channel.removeEventListener('message', handleProbe);
	if (peers.size === 0) return;

	const acknowledgements = new Set<string>();
	const handleAck = (event: MessageEvent) => {
		if (event.data?.type === `${type}-ack` && event.data.requestId === requestId) {
			acknowledgements.add(String(event.data.from));
		}
	};
	channel.addEventListener('message', handleAck);
	channel.postMessage({ type, requestId, from: coordinationContextId });
	const deadline = Date.now() + 1_000;
	while (acknowledgements.size < peers.size && Date.now() < deadline) await wait(20);
	channel.removeEventListener('message', handleAck);
	if ([...peers].some((peer) => !acknowledgements.has(peer))) {
		if (type !== 'flush') channel.postMessage({ type: 'resume', from: coordinationContextId });
		throw new Error('Another Cojudge window is busy. Close it or try syncing again.');
	}
}

function latestRef(db: Firestore, uid: string) {
	return doc(db, 'users', uid, 'cloud', 'latest');
}

function snapshotRef(db: Firestore, uid: string, snapshotId: string) {
	return doc(db, 'users', uid, 'snapshots', snapshotId);
}

function partsRef(db: Firestore, uid: string, snapshotId: string) {
	return collection(db, 'users', uid, 'snapshots', snapshotId, 'parts');
}

function revisionAssetSetRef(db: Firestore, uid: string, snapshotId: string, revisionId: string) {
	return doc(db, 'users', uid, 'snapshots', snapshotId, 'assetSets', revisionId);
}

function revisionAssetPartsRef(db: Firestore, uid: string, snapshotId: string, revisionId: string) {
	return collection(
		db,
		'users',
		uid,
		'snapshots',
		snapshotId,
		'assetSets',
		revisionId,
		'parts'
	);
}

function sharedAssetSetRef(db: Firestore, uid: string, assetSetId: string) {
	return doc(db, 'users', uid, 'cloudAssets', assetSetId);
}

function sharedAssetPartsRef(db: Firestore, uid: string, assetSetId: string) {
	return collection(db, 'users', uid, 'cloudAssets', assetSetId, 'parts');
}

function cloudAssetSetRef(db: Firestore, uid: string, assetSet: CloudAssetSet) {
	return assetSet.storage === 'shared'
		? sharedAssetSetRef(db, uid, assetSet.assetSetId)
		: revisionAssetSetRef(db, uid, assetSet.snapshotId!, assetSet.assetSetId);
}

function cloudAssetPartsRef(db: Firestore, uid: string, assetSet: CloudAssetSet) {
	return assetSet.storage === 'shared'
		? sharedAssetPartsRef(db, uid, assetSet.assetSetId)
		: revisionAssetPartsRef(db, uid, assetSet.snapshotId!, assetSet.assetSetId);
}

function cloudStashesRef(db: Firestore, uid: string) {
	return collection(db, 'users', uid, 'cloudStashes');
}

function cloudStashRef(db: Firestore, uid: string, stashId: string) {
	return doc(db, 'users', uid, 'cloudStashes', stashId);
}

function cloudStashPartsRef(db: Firestore, uid: string, stashId: string) {
	return collection(db, 'users', uid, 'cloudStashes', stashId, 'parts');
}

function stashContext(context: OperationContext): { workspaceId: string; repoId: string } {
	return {
		workspaceId: cloudAccountId(context.projectId, context.uid),
		repoId: CLOUD_STASH_REPO_ID
	};
}

function validStashId(value: string): boolean {
	return /^stash-[A-Za-z0-9-]{8,100}$/.test(value);
}

function parseCloudStashMeta(stashId: string, data: Record<string, unknown>): CloudStashSummary {
	const status = data.status;
	const baseRevisionId = typeof data.baseRevisionId === 'string' ? data.baseRevisionId : null;
	const baseChecksum = typeof data.baseChecksum === 'string' ? data.baseChecksum : null;
	const leaseOwner = typeof data.leaseOwner === 'string' ? data.leaseOwner : null;
	const leaseExpiresAt = data.leaseExpiresAt;
	const createdAt = data.createdAt;
	const expiresAt = data.expiresAt;
	const changeCount = data.changeCount;
	const partCount = data.partCount;
	const totalBytes = data.totalBytes;
	const checksum = data.checksum;
	if (
		data.schemaVersion !== CLOUD_STASH_SCHEMA_VERSION
		|| !validStashId(stashId)
		|| data.stashId !== stashId
		|| typeof data.name !== 'string'
		|| typeof data.workspaceId !== 'string'
		|| typeof data.repoId !== 'string'
		|| (status !== 'ready' && status !== 'popping')
		|| (baseRevisionId !== null && !validRevisionId(baseRevisionId))
		|| (baseChecksum !== null && !/^[a-f0-9]{64}$/.test(baseChecksum))
		|| typeof checksum !== 'string'
		|| !/^[a-f0-9]{64}$/.test(checksum)
		|| !Number.isSafeInteger(changeCount)
		|| (changeCount as number) < 0
		|| !Number.isSafeInteger(partCount)
		|| (partCount as number) < 1
		|| (partCount as number) > MAX_CLOUD_STASH_PARTS
		|| !Number.isSafeInteger(totalBytes)
		|| (totalBytes as number) < 0
		|| (totalBytes as number) > MAX_CLOUD_STASH_BYTES
		|| !Number.isSafeInteger(createdAt)
		|| (createdAt as number) <= 0
		|| !Number.isSafeInteger(expiresAt)
		|| (expiresAt as number) <= 0
		|| !Number.isSafeInteger(leaseExpiresAt)
		|| (leaseExpiresAt as number) < 0
		|| (leaseOwner !== null && leaseOwner.length === 0)
	) {
		throw new Error('Cloud stash metadata is invalid.');
	}
	return {
		stashId,
		name: data.name,
		workspaceId: data.workspaceId,
		repoId: data.repoId,
		baseRevisionId,
		baseChecksum,
		checksum,
		changeCount: changeCount as number,
		partCount: partCount as number,
		totalBytes: totalBytes as number,
		createdAt: createdAt as number,
		expiresAt: expiresAt as number,
		status,
		leaseOwner,
		leaseExpiresAt: leaseExpiresAt as number
	};
}

async function readCloudStashes(db: Firestore, uid: string): Promise<CloudStashSummary[]> {
	const result = await getDocs(
		query(
			cloudStashesRef(db, uid),
			orderBy('createdAt', 'desc'),
			limit(CLOUD_STASH_CLEANUP_LIMIT)
		)
	);
	const stashes: CloudStashSummary[] = [];
	for (const item of result.docs) {
		try {
			stashes.push(parseCloudStashMeta(item.id, item.data()));
		} catch {
			// A malformed/foreign record must not block the rest of the stash list.
		}
	}
	return stashes;
}

async function deleteCloudStash(db: Firestore, uid: string, stashId: string): Promise<void> {
	const parts = await getDocs(query(cloudStashPartsRef(db, uid, stashId), orderBy('index')));
	const batch = writeBatch(db);
	for (const part of parts.docs) batch.delete(part.ref);
	batch.delete(cloudStashRef(db, uid, stashId));
	await batch.commit();
}

async function deleteCloudStashQuietly(db: Firestore, uid: string, stashId: string): Promise<boolean> {
	try {
		await deleteCloudStash(db, uid, stashId);
		return true;
	} catch (error) {
		console.warn(`Cojudge Cloud could not clean up stash ${stashId}:`, error);
		return false;
	}
}

async function cleanupCloudStashes(
	context: OperationContext,
	stashes: readonly CloudStashSummary[]
): Promise<Set<string>> {
	const deleted = new Set<string>();
	for (const stashId of selectCloudStashIdsForCleanup(stashes)) {
		if (!isOperationCurrent(context)) break;
		if (await deleteCloudStashQuietly(context.db, context.uid, stashId)) {
			deleted.add(stashId);
		}
	}
	return deleted;
}

async function uploadCloudStash(
	context: OperationContext,
	name: string,
	baseRevisionId: string | null,
	baseChecksum: string | null,
	changes: StashChange[],
	images: Record<string, string>
): Promise<CloudStashSummary> {
	const payload: StashPayload = { version: CLOUD_STASH_SCHEMA_VERSION, changes, images };
	const serialized = serializeStashPayload(payload);
	const encoded = encodeProgressParts(serialized);
	if (encoded.totalBytes > MAX_CLOUD_STASH_BYTES || encoded.parts.length > MAX_CLOUD_STASH_PARTS) {
		throw new Error('These local changes are too large to stash in Cojudge Cloud.');
	}

	const stashId = makeCloudStashId();
	const checksum = await hashProgress(serialized);
	const now = Date.now();
	const meta: CloudStashSummary = {
		stashId,
		name,
		...stashContext(context),
		baseRevisionId,
		baseChecksum,
		checksum,
		changeCount: changes.length,
		partCount: encoded.parts.length,
		totalBytes: encoded.totalBytes,
		createdAt: now,
		expiresAt: now + CLOUD_STASH_TTL_MS,
		status: 'ready',
		leaseOwner: null,
		leaseExpiresAt: 0
	};
	const partsBatch = writeBatch(context.db);
	for (let index = 0; index < encoded.parts.length; index++) {
		partsBatch.set(
			doc(cloudStashPartsRef(context.db, context.uid, stashId), index.toString().padStart(4, '0')),
			{ index, data: encoded.parts[index] }
		);
	}
	try {
		await partsBatch.commit();
		await setDoc(cloudStashRef(context.db, context.uid, stashId), {
			schemaVersion: CLOUD_STASH_SCHEMA_VERSION,
			stashId,
			name: meta.name,
			workspaceId: meta.workspaceId,
			repoId: meta.repoId,
			baseRevisionId: meta.baseRevisionId,
			baseChecksum: meta.baseChecksum,
			checksum: meta.checksum,
			changeCount: meta.changeCount,
			partCount: meta.partCount,
			totalBytes: meta.totalBytes,
			createdAt: meta.createdAt,
			expiresAt: meta.expiresAt,
			status: meta.status,
			leaseOwner: meta.leaseOwner,
			leaseExpiresAt: meta.leaseExpiresAt
		});
	} catch (error) {
		await deleteCloudStashQuietly(context.db, context.uid, stashId);
		throw error;
	}
	return meta;
}

async function downloadCloudStash(
	db: Firestore,
	uid: string,
	stash: CloudStashSummary
): Promise<StashPayload> {
	const result = await getDocs(
		query(cloudStashPartsRef(db, uid, stash.stashId), orderBy('index'))
	);
	if (result.size !== stash.partCount) throw new Error('Cloud stash is incomplete.');
	const parts = result.docs.map((part, index) => {
		const data = part.data();
		if (data.index !== index || typeof data.data !== 'string') {
			throw new Error('Cloud stash contains an invalid part.');
		}
		return data.data;
	});
	const serialized = decodeProgressParts(parts, stash.totalBytes);
	if ((await hashProgress(serialized)) !== stash.checksum) {
		throw new Error('Cloud stash failed its integrity check.');
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(serialized);
	} catch {
		throw new Error('Cloud stash has an invalid format.');
	}
	return parseStashPayload(parsed);
}

async function claimCloudStash(
	context: OperationContext,
	stashId: string,
	owner: string
): Promise<CloudStashSummary> {
	return runTransaction(context.db, async (transaction) => {
		const reference = cloudStashRef(context.db, context.uid, stashId);
		const result = await transaction.get(reference);
		if (!result.exists()) throw new Error('That stash is no longer available.');
		const stash = parseCloudStashMeta(stashId, result.data());
		const scope = stashContext(context);
		if (stash.workspaceId !== scope.workspaceId || stash.repoId !== scope.repoId) {
			throw new Error('That stash belongs to another cloud workspace.');
		}
		const now = Date.now();
		if (cloudStashIsLeased(stash, now)) {
			throw new Error('That stash is being restored on another device. Try again shortly.');
		}
		if (cloudStashIsExpired(stash, now)) {
			throw new Error('That stash has expired. It can only be deleted.');
		}
		const leaseExpiresAt = now + CLOUD_STASH_LEASE_MS;
		transaction.update(reference, {
			status: 'popping',
			leaseOwner: owner,
			leaseExpiresAt
		});
		return {
			...stash,
			status: 'popping' as const,
			leaseOwner: owner,
			leaseExpiresAt
		};
	});
}

async function releaseCloudStash(
	context: OperationContext,
	stashId: string,
	owner: string,
	drop: boolean
): Promise<boolean> {
	const changed = await runTransaction(context.db, async (transaction) => {
		const reference = cloudStashRef(context.db, context.uid, stashId);
		const result = await transaction.get(reference);
		if (!result.exists()) return false;
		const data = result.data();
		if (data.status !== 'popping' || data.leaseOwner !== owner) return false;
		if (drop) transaction.delete(reference);
		else {
			transaction.update(reference, {
				status: 'ready',
				leaseOwner: null,
				leaseExpiresAt: 0
			});
		}
		return true;
	});
	if (changed && drop) {
		const parts = await getDocs(query(cloudStashPartsRef(context.db, context.uid, stashId), orderBy('index')));
		for (let offset = 0; offset < parts.docs.length; offset += 400) {
			const batch = writeBatch(context.db);
			for (const part of parts.docs.slice(offset, offset + 400)) batch.delete(part.ref);
			await batch.commit();
		}
	}
	return changed;
}

function integer(value: unknown, minimum: number, maximum: number, label: string): number {
	if (!Number.isSafeInteger(value) || (value as number) < minimum || (value as number) > maximum) {
		throw new Error(`Cloud snapshot has an invalid ${label}.`);
	}
	return value as number;
}

function timestampMillis(data: Record<string, unknown>, key: string): number {
	const value = data[key] as { toMillis?: () => number } | undefined;
	const timestamp = value?.toMillis?.() ?? 0;
	if (!Number.isFinite(timestamp) || timestamp <= 0) {
		throw new Error('Cloud snapshot has no valid update time.');
	}
	return timestamp;
}

function validSnapshotId(value: string): boolean {
	return /^slot-[0-4]$/.test(value) || /^[a-z0-9-]{8,100}$/i.test(value);
}

function validRevisionId(value: string): boolean {
	return /^[a-z0-9-]{8,100}$/i.test(value);
}

function parseSnapshotMeta(
	snapshotId: string,
	data: Record<string, unknown>,
	timestampKey: 'updatedAt' | 'createdAt'
): RemoteSnapshotMeta {
	const schemaVersion = data.schemaVersion;
	const revisionId = typeof data.revisionId === 'string' ? data.revisionId : snapshotId;
	const parentRevisionId = typeof data.parentRevisionId === 'string' ? data.parentRevisionId : null;
	const checksum = typeof data.checksum === 'string' ? data.checksum : '';
	if (
		(
			schemaVersion !== CLOUD_SNAPSHOT_LEGACY_VERSION
			&& schemaVersion !== CLOUD_SNAPSHOT_SIDECAR_VERSION
			&& schemaVersion !== CLOUD_SNAPSHOT_VERSION
		) ||
		!validSnapshotId(snapshotId) ||
		!validRevisionId(revisionId) ||
		(parentRevisionId !== null && !validRevisionId(parentRevisionId)) ||
		!/^[a-f0-9]{64}$/.test(checksum)
	) {
		throw new Error('Cloud snapshot metadata is invalid.');
	}

	let payloadChecksum = checksum;
	let assetStorage: RemoteSnapshotMeta['assetStorage'] = 'none';
	let assetSetId: string | null = null;
	let assetPartCount = 0;
	let assetBytes = 0;
	let assetChecksum: string | null = null;
	if (schemaVersion !== CLOUD_SNAPSHOT_LEGACY_VERSION) {
		payloadChecksum = typeof data.payloadChecksum === 'string' ? data.payloadChecksum : '';
		assetPartCount = integer(data.assetPartCount, 0, MAX_CLOUD_ASSET_PARTS, 'image part count');
		assetBytes = integer(data.assetBytes, 0, MAX_CLOUD_ASSET_BYTES, 'image size');
		const expectedPartCount = assetBytes === 0 ? 0 : Math.ceil(assetBytes / CLOUD_ASSET_CHUNK_BYTES);
		if (!/^[a-f0-9]{64}$/.test(payloadChecksum) || assetPartCount !== expectedPartCount) {
			throw new Error('Cloud snapshot image metadata is invalid.');
		}

		if (schemaVersion === CLOUD_SNAPSHOT_SIDECAR_VERSION) {
			const assetRevisionId = typeof data.assetRevisionId === 'string' ? data.assetRevisionId : null;
			assetChecksum = typeof data.assetChecksum === 'string' ? data.assetChecksum : null;
			if (assetPartCount === 0
				? assetRevisionId !== null || assetChecksum !== null
				: assetRevisionId !== revisionId || !assetChecksum || !/^[a-f0-9]{64}$/.test(assetChecksum)) {
				throw new Error('Cloud snapshot image metadata is invalid.');
			}
			if (assetPartCount > 0) {
				assetStorage = 'revision';
				assetSetId = assetRevisionId;
			}
		} else {
			const sharedAssetSetId = typeof data.assetSetId === 'string' ? data.assetSetId : null;
			if (assetPartCount === 0
				? sharedAssetSetId !== null
				: !sharedAssetSetId || !/^[a-f0-9]{64}$/.test(sharedAssetSetId)) {
				throw new Error('Cloud snapshot image metadata is invalid.');
			}
			if (assetPartCount > 0) {
				assetStorage = 'shared';
				assetSetId = sharedAssetSetId;
				assetChecksum = sharedAssetSetId;
			}
		}
	}

	return {
		schemaVersion: schemaVersion as number,
		snapshotId,
		revisionId,
		parentRevisionId,
		checksum,
		payloadChecksum,
		partCount: integer(data.partCount, 1, MAX_SNAPSHOT_PARTS, 'part count'),
		totalBytes: integer(data.totalBytes, 0, MAX_SNAPSHOT_BYTES, 'size'),
		assetStorage,
		assetSetId,
		assetPartCount,
		assetBytes,
		assetChecksum,
		updatedAt: timestampMillis(data, timestampKey),
		meaningful: data.meaningful === true
	};
}

function parseRemoteMeta(data: Record<string, unknown>): RemoteSnapshotMeta {
	const snapshotId = typeof data.snapshotId === 'string' ? data.snapshotId : '';
	return parseSnapshotMeta(snapshotId, data, 'updatedAt');
}

function parseHistoryMeta(snapshotId: string, data: Record<string, unknown>): RemoteSnapshotMeta | null {
	try {
		if (data.status !== 'ready') return null;
		return parseSnapshotMeta(snapshotId, data, 'createdAt');
	} catch {
		return null;
	}
}

async function readRemoteMeta(db: Firestore, uid: string): Promise<RemoteSnapshotMeta | null> {
	const result = await getDoc(latestRef(db, uid));
	return result.exists() ? parseRemoteMeta(result.data()) : null;
}

async function readRemoteHistory(
	db: Firestore,
	uid: string,
	current: RemoteSnapshotMeta | null | Promise<RemoteSnapshotMeta | null>
): Promise<RemoteSnapshotMeta[]> {
	const [result, resolvedCurrent] = await Promise.all([
		getDocs(
			query(
				collection(db, 'users', uid, 'snapshots'),
				orderBy('createdAt', 'desc'),
				limit(CLOUD_HISTORY_LIMIT)
			)
		),
		current
	]);
	const history = result.docs
		.map((snapshot) => parseHistoryMeta(snapshot.id, snapshot.data()))
		.filter((snapshot): snapshot is RemoteSnapshotMeta => snapshot !== null);
	if (resolvedCurrent && !history.some((snapshot) => snapshot.revisionId === resolvedCurrent.revisionId)) {
		history.unshift(resolvedCurrent);
	}
	return history.slice(0, CLOUD_HISTORY_LIMIT);
}

function publishHistory(history: RemoteSnapshotMeta[], currentRevisionId: string | null): void {
	cloudSyncState.update((state) => ({
		...state,
		remoteStatus: currentRevisionId === null ? 'absent' : 'present',
		history: history.map((revision) => ({
			revisionId: revision.revisionId,
			createdAt: revision.updatedAt,
			current: revision.revisionId === currentRevisionId,
			totalBytes: revision.totalBytes + revision.assetBytes
		}))
	}));
}

function makeRevisionId(): string {
	const random = crypto.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
	return `${Date.now().toString(36)}-${random.replaceAll('-', '')}`;
}

function cloudAssetSet(meta: RemoteSnapshotMeta | null): CloudAssetSet | null {
	if (!meta?.assetSetId || meta.assetPartCount === 0 || !meta.assetChecksum) return null;
	return {
		storage: meta.assetStorage === 'shared' ? 'shared' : 'revision',
		snapshotId: meta.assetStorage === 'revision' ? meta.snapshotId : null,
		assetSetId: meta.assetSetId,
		partCount: meta.assetPartCount,
		totalBytes: meta.assetBytes,
		checksum: meta.assetChecksum
	};
}

function cloudAssetManifestMatches(data: Record<string, unknown>, assetSet: CloudAssetSet): boolean {
	return data.schemaVersion === CLOUD_ASSET_SET_VERSION
		&& data.partCount === assetSet.partCount
		&& data.totalBytes === assetSet.totalBytes
		&& data.checksum === assetSet.checksum
		&& (assetSet.storage === 'shared'
			? data.assetSetId === assetSet.assetSetId
				&& typeof data.uploadId === 'string'
				&& validRevisionId(data.uploadId)
			: data.snapshotId === assetSet.snapshotId && data.revisionId === assetSet.assetSetId);
}

function sharedAssetUploadState(data: Record<string, unknown>): { uploadId: string; updatedAt: number } {
	const uploadId = typeof data.uploadId === 'string' ? data.uploadId : '';
	const timestamp = data.updatedAt as { toMillis?: () => number } | undefined;
	const updatedAt = timestamp?.toMillis?.() ?? 0;
	if (!validRevisionId(uploadId) || !Number.isFinite(updatedAt) || updatedAt <= 0) {
		throw new Error('Cloud image upload metadata is invalid.');
	}
	return { uploadId, updatedAt };
}

async function deleteCloudAssetSet(db: Firestore, uid: string, assetSet: CloudAssetSet): Promise<void> {
	const result = await getDocs(
		query(cloudAssetPartsRef(db, uid, assetSet), orderBy('index'))
	);
	for (let offset = 0; offset < result.docs.length; offset += CLOUD_ASSET_BATCH_PARTS) {
		const batch = writeBatch(db);
		for (const part of result.docs.slice(offset, offset + CLOUD_ASSET_BATCH_PARTS)) {
			batch.delete(part.ref);
		}
		await batch.commit();
	}
	await deleteDoc(cloudAssetSetRef(db, uid, assetSet));
}

async function deleteCloudAssetSetQuietly(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet,
	label: string
): Promise<void> {
	try {
		await deleteCloudAssetSet(db, uid, assetSet);
	} catch (error) {
		console.warn(`Cojudge Cloud could not clean up ${label} image data:`, error);
	}
}

async function stageSharedCloudAssetSet(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet,
	parts: readonly Uint8Array[]
): Promise<void> {
	const reference = cloudAssetSetRef(db, uid, assetSet);
	// The generation ID and heartbeat let another device distinguish an abandoned
	// staging upload from a live one before reclaiming the content-addressed path.
	const uploadId = makeRevisionId();
	let manifestCreated = false;
	try {
		await setDoc(reference, {
			schemaVersion: CLOUD_ASSET_SET_VERSION,
			status: 'staging',
			assetSetId: assetSet.assetSetId,
			uploadId,
			partCount: assetSet.partCount,
			totalBytes: assetSet.totalBytes,
			checksum: assetSet.checksum,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		manifestCreated = true;
		for (let offset = 0; offset < parts.length; offset += CLOUD_ASSET_BATCH_PARTS) {
			const batch = writeBatch(db);
			for (let index = offset; index < Math.min(parts.length, offset + CLOUD_ASSET_BATCH_PARTS); index++) {
				batch.set(
					doc(
						cloudAssetPartsRef(db, uid, assetSet),
						index.toString().padStart(4, '0')
					),
					{ index, data: Bytes.fromUint8Array(parts[index]), uploadId }
				);
			}
			batch.update(reference, { updatedAt: serverTimestamp() });
			await batch.commit();
		}
		await updateDoc(reference, { status: 'ready', updatedAt: serverTimestamp() });
	} catch (error) {
		if (manifestCreated) {
			const current = await getDoc(reference).catch(() => null);
			if (current?.exists()) {
				const data = current.data();
				if (data.status === 'ready' && cloudAssetManifestMatches(data, assetSet)) return;
				try {
					const currentUpload = sharedAssetUploadState(data);
					if (currentUpload.uploadId === uploadId) {
						const marked = data.status === 'deleting'
							|| await markSharedCloudAssetUploadDeleting(
								db,
								uid,
								assetSet,
								currentUpload
							);
						if (marked) {
							await deleteCloudAssetSetQuietly(db, uid, assetSet, 'an incomplete upload');
						}
					}
				} catch (cleanupError) {
					console.warn('Cojudge Cloud could not abandon an incomplete image upload:', cleanupError);
				}
			}
		}
		throw error;
	}
}

async function markSharedCloudAssetUploadDeleting(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet,
	expected: { uploadId: string; updatedAt: number }
): Promise<boolean> {
	return runTransaction(db, async (transaction) => {
		const reference = cloudAssetSetRef(db, uid, assetSet);
		const manifest = await transaction.get(reference);
		if (!manifest.exists()) return false;
		const data = manifest.data();
		if (!cloudAssetManifestMatches(data, assetSet)) {
			throw new Error('Cloud image metadata is invalid.');
		}
		const current = sharedAssetUploadState(data);
		if (current.uploadId !== expected.uploadId) return false;
		if (data.status === 'deleting') return true;
		if (data.status !== 'staging' || current.updatedAt !== expected.updatedAt) return false;
		transaction.update(reference, { status: 'deleting', updatedAt: serverTimestamp() });
		return true;
	});
}

async function waitForSharedCloudAssetSet(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet
): Promise<'ready' | 'absent'> {
	const reference = cloudAssetSetRef(db, uid, assetSet);
	const deadline = Date.now() + CLOUD_ASSET_READY_WAIT_MS;
	let observedUpload = '';
	let unchangedSince = Date.now();
	while (Date.now() < deadline) {
		const result = await getDoc(reference);
		if (!result.exists()) return 'absent';
		const data = result.data();
		if (!cloudAssetManifestMatches(data, assetSet)) {
			throw new Error('An existing cloud image set has invalid metadata.');
		}
		if (data.status === 'ready') return 'ready';
		if (data.status !== 'staging' && data.status !== 'deleting') {
			throw new Error('An existing cloud image set has an invalid status.');
		}

		const upload = sharedAssetUploadState(data);
		if (data.status === 'deleting') {
			// Finish an interrupted collector before this canonical path is reused.
			await deleteCloudAssetSet(db, uid, assetSet).catch(() => undefined);
			observedUpload = '';
			unchangedSince = Date.now();
			await wait(100);
			continue;
		}

		const observation = `${upload.uploadId}:${upload.updatedAt}`;
		if (observation !== observedUpload) {
			observedUpload = observation;
			unchangedSince = Date.now();
		} else if (Date.now() - unchangedSince >= CLOUD_ASSET_STALE_WAIT_MS) {
			const marked = await markSharedCloudAssetUploadDeleting(db, uid, assetSet, upload);
			if (marked) await deleteCloudAssetSet(db, uid, assetSet).catch(() => undefined);
			observedUpload = '';
			unchangedSince = Date.now();
		}
		await wait(500);
	}
	throw new Error('Another device is still preparing or cleaning the same cloud images. Try syncing again shortly.');
}

async function ensureSharedCloudAssetSet(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet,
	parts: readonly Uint8Array[]
): Promise<boolean> {
	for (let attempt = 0; attempt < 3; attempt++) {
		const state = await waitForSharedCloudAssetSet(db, uid, assetSet);
		if (state === 'ready') return false;
		try {
			await stageSharedCloudAssetSet(db, uid, assetSet, parts);
			return true;
		} catch (error) {
			const raced = await waitForSharedCloudAssetSet(db, uid, assetSet);
			if (raced === 'ready') return false;
			if (attempt === 2) throw error;
		}
	}
	throw new Error('Cojudge Cloud could not prepare image data.');
}

function retainedSnapshotRefs(db: Firestore, uid: string) {
	return Array.from({ length: CLOUD_HISTORY_LIMIT }, (_, index) =>
		snapshotRef(db, uid, `slot-${index}`)
	);
}

async function markSharedCloudAssetSetDeleting(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet
): Promise<boolean> {
	return runTransaction(db, async (transaction) => {
		const reference = cloudAssetSetRef(db, uid, assetSet);
		const [manifest, snapshots] = await Promise.all([
			transaction.get(reference),
			Promise.all(retainedSnapshotRefs(db, uid).map((snapshot) => transaction.get(snapshot)))
		]);
		if (!manifest.exists()) return false;
		const data = manifest.data();
		if (!cloudAssetManifestMatches(data, assetSet)) {
			throw new Error('Cloud image metadata is invalid.');
		}
		if (snapshots.some((snapshot) => {
			if (!snapshot.exists()) return false;
			const snapshotData = snapshot.data();
			return snapshotData.schemaVersion === CLOUD_SNAPSHOT_VERSION
				&& snapshotData.assetSetId === assetSet.assetSetId;
		})) return false;
		if (data.status === 'deleting') return true;
		if (data.status !== 'ready') return false;
		transaction.update(reference, { status: 'deleting', updatedAt: serverTimestamp() });
		return true;
	});
}

async function collectSharedCloudAssetSet(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet
): Promise<void> {
	const reference = cloudAssetSetRef(db, uid, assetSet);
	const current = await getDoc(reference);
	if (!current.exists()) return;
	const data = current.data();
	if (!cloudAssetManifestMatches(data, assetSet)) {
		throw new Error('Cloud image metadata is invalid.');
	}
	if (data.status === 'staging') return;
	if (data.status === 'deleting') {
		await deleteCloudAssetSet(db, uid, assetSet);
		return;
	}
	if (data.status !== 'ready') throw new Error('Cloud image metadata is invalid.');
	if (!await markSharedCloudAssetSetDeleting(db, uid, assetSet)) return;
	await deleteCloudAssetSet(db, uid, assetSet);
}

async function collectSharedCloudAssetSetQuietly(
	db: Firestore,
	uid: string,
	assetSet: CloudAssetSet,
	label: string
): Promise<void> {
	try {
		await collectSharedCloudAssetSet(db, uid, assetSet);
	} catch (error) {
		console.warn(`Cojudge Cloud could not collect ${label} shared image data:`, error);
	}
}

async function uploadSnapshot(
	db: Firestore,
	uid: string,
	local: UploadSnapshot,
	previous: RemoteSnapshotMeta | null
): Promise<string> {
	const extracted = await extractCloudAssets(local.data);
	const payloadSerialized = serializeProgressData(extracted.data);
	const payloadChecksum = await hashProgress(payloadSerialized);
	const { parts, totalBytes } = encodeProgressParts(payloadSerialized);
	if (totalBytes > MAX_SNAPSHOT_BYTES || parts.length > MAX_SNAPSHOT_PARTS) {
		throw new Error('Progress text is too large for Cojudge Cloud even after images were separated.');
	}
	const assetParts = encodeCloudAssetParts(extracted.bytes);
	if (extracted.bytes.length > MAX_CLOUD_ASSET_BYTES || assetParts.length > MAX_CLOUD_ASSET_PARTS) {
		throw new Error('Cloud images exceed the 64 MB limit.');
	}

	const snapshotId = nextCloudSnapshotSlot(previous?.snapshotId ?? null);
	const revisionId = makeRevisionId();
	const parentRevisionId = previous?.revisionId ?? null;
	const manifest = snapshotRef(db, uid, snapshotId);
	const assetChecksum = extracted.bytes.length > 0
		? await hashCloudAssetBytes(extracted.bytes)
		: null;
	const preparedAssetSet: CloudAssetSet | null = assetChecksum
		? {
				storage: 'shared',
				snapshotId: null,
				assetSetId: assetChecksum,
				partCount: assetParts.length,
				totalBytes: extracted.bytes.length,
				checksum: assetChecksum
			}
		: null;
	const assetSetCreated = preparedAssetSet
		? await ensureSharedCloudAssetSet(db, uid, preparedAssetSet, assetParts)
		: false;

	let replacedAssetSet: CloudAssetSet | null = null;
	try {
		replacedAssetSet = await runTransaction(db, async (transaction) => {
			const reference = latestRef(db, uid);
			const current = await transaction.get(reference);
			const previousManifest = await transaction.get(manifest);
			const previousPartCount = previousManifest.exists()
				? integer(previousManifest.data().partCount, 1, MAX_SNAPSHOT_PARTS, 'part count')
				: 0;
			const previousMeta = previousManifest.exists()
				? parseHistoryMeta(previousManifest.id, previousManifest.data())
				: null;
			const currentData = current.exists() ? current.data() : null;
			const currentSnapshotId = typeof currentData?.snapshotId === 'string' ? currentData.snapshotId : null;
			const currentRevisionId = typeof currentData?.revisionId === 'string'
				? currentData.revisionId
				: currentSnapshotId;
			if (currentRevisionId !== parentRevisionId) {
				throw new Error('Cloud progress changed on another device. Sync again.');
			}

			const assetMetadata = {
				payloadChecksum,
				assetSetId: preparedAssetSet?.assetSetId ?? null,
				assetPartCount: preparedAssetSet?.partCount ?? 0,
				assetBytes: preparedAssetSet?.totalBytes ?? 0
			};
			transaction.set(manifest, {
				schemaVersion: CLOUD_SNAPSHOT_VERSION,
				status: 'ready',
				revisionId,
				parentRevisionId,
				checksum: local.checksum,
				...assetMetadata,
				partCount: parts.length,
				totalBytes,
				meaningful: local.meaningful,
				createdAt: serverTimestamp()
			});
			for (let index = 0; index < MAX_SNAPSHOT_PARTS; index++) {
				const part = doc(partsRef(db, uid, snapshotId), index.toString().padStart(4, '0'));
				if (index < parts.length) transaction.set(part, { index, data: parts[index] });
				else if (index < previousPartCount) transaction.delete(part);
			}
			transaction.set(reference, {
				schemaVersion: CLOUD_SNAPSHOT_VERSION,
				snapshotId,
				revisionId,
				parentRevisionId,
				checksum: local.checksum,
				...assetMetadata,
				partCount: parts.length,
				totalBytes,
				storageUsed: totalBytes + (preparedAssetSet?.totalBytes ?? 0),
				meaningful: local.meaningful,
				updatedAt: serverTimestamp()
			});
			return cloudAssetSet(previousMeta);
		});
	} catch (error) {
		if (assetSetCreated && preparedAssetSet) {
			await collectSharedCloudAssetSetQuietly(db, uid, preparedAssetSet, 'the rejected upload');
		}
		throw error;
	}
	if (replacedAssetSet?.storage === 'revision') {
		await deleteCloudAssetSetQuietly(db, uid, replacedAssetSet, 'an expired revision');
	} else if (
		replacedAssetSet?.storage === 'shared'
		&& replacedAssetSet.assetSetId !== preparedAssetSet?.assetSetId
	) {
		await collectSharedCloudAssetSetQuietly(db, uid, replacedAssetSet, 'an expired revision');
	}
	return revisionId;
}

async function downloadCloudAssetSet(
	db: Firestore,
	uid: string,
	meta: RemoteSnapshotMeta
): Promise<Uint8Array> {
	const assetSet = cloudAssetSet(meta);
	if (!assetSet) return new Uint8Array();

	const manifest = await getDoc(cloudAssetSetRef(db, uid, assetSet));
	const manifestData = manifest.exists() ? manifest.data() : null;
	if (
		!manifestData
		|| manifestData.status !== 'ready'
		|| !cloudAssetManifestMatches(manifestData, assetSet)
	) {
		throw new Error('Cloud image metadata is invalid.');
	}

	const result = await getDocs(
		query(cloudAssetPartsRef(db, uid, assetSet), orderBy('index'))
	);
	if (result.size !== assetSet.partCount) throw new Error('Cloud image download is incomplete.');
	const sharedUploadId = assetSet.storage === 'shared'
		? sharedAssetUploadState(manifestData).uploadId
		: null;
	const parts = result.docs.map((part, index) => {
		const data = part.data();
		if (
			data.index !== index
			|| !(data.data instanceof Bytes)
			|| (sharedUploadId !== null && data.uploadId !== sharedUploadId)
		) {
			throw new Error('Cloud image download contains an invalid part.');
		}
		return data.data.toUint8Array();
	});
	const bytes = decodeCloudAssetParts(parts, assetSet.totalBytes);
	if ((await hashCloudAssetBytes(bytes)) !== assetSet.checksum) {
		throw new Error('Cloud images failed their integrity check.');
	}
	return bytes;
}

async function downloadSnapshot(
	db: Firestore,
	uid: string,
	meta: RemoteSnapshotMeta
): Promise<DownloadedSnapshot> {
	const result = await getDocs(query(partsRef(db, uid, meta.snapshotId), orderBy('index')));
	if (result.size !== meta.partCount) throw new Error('Cloud snapshot is incomplete.');

	const parts = result.docs.map((part, index) => {
		const data = part.data();
		if (data.index !== index || typeof data.data !== 'string') {
			throw new Error('Cloud snapshot contains an invalid part.');
		}
		return data.data;
	});
	const payloadSerialized = decodeProgressParts(parts, meta.totalBytes);
	if ((await hashProgress(payloadSerialized)) !== meta.payloadChecksum) {
		throw new Error('Cloud snapshot failed its integrity check.');
	}

	const parsed = JSON.parse(payloadSerialized);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Cloud snapshot has an invalid format.');
	}
	if (meta.schemaVersion === CLOUD_SNAPSHOT_LEGACY_VERSION) {
		return { data: parsed as ProgressData, serialized: payloadSerialized };
	}

	const assetBytes = await downloadCloudAssetSet(db, uid, meta);
	const data = await hydrateCloudAssets(parsed as ProgressData, assetBytes);
	const serialized = serializeProgressData(data);
	if ((await hashProgress(serialized)) !== meta.checksum) {
		throw new Error('Cloud snapshot failed its hydrated integrity check.');
	}
	return { data, serialized };
}

async function ensureCloudClone(
	context: OperationContext,
	remote: RemoteSnapshotMeta
): Promise<ProgressData> {
	const accountId = cloudAccountId(context.projectId, context.uid);
	const cached = readCloudClone(accountId);
	if (cached && cached.checksum === remote.checksum) return cached.data;

	const downloaded = await downloadSnapshot(context.db, context.uid, remote);
	if (!isOperationCurrent(context)) return downloaded.data;
	writeCloudClone(accountId, remote.checksum, downloaded.serialized, remote.revisionId);
	return downloaded.data;
}

function markSynced(
	context: OperationContext,
	baseHash: string,
	resolution: CloudResolution | null = null
): boolean {
	if (!isOperationCurrent(context)) return false;
	const meta: DeviceUserMeta = {
		lastSyncedHash: baseHash,
		lastSyncedAt: Date.now()
	};
	saveUserMeta(context, meta);
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'idle',
		lastSyncedAt: meta.lastSyncedAt,
		resolution,
		error: null,
		progress: null
	}));
	return true;
}

async function finalizeCloudRevision(context: OperationContext, baseHash: string): Promise<void> {
	const currentLocal = await readLocalSnapshot(context);
	if (!isOperationCurrent(context)) return;
	markSynced(
		context,
		baseHash,
		currentLocal.checksum === baseHash ? null : 'local-changes'
	);
}

async function applyDownloadedSnapshot(
	context: OperationContext,
	downloaded: ProgressData,
	expectedLocal: LocalSnapshot,
	baseHash: string,
	options: { resolution?: CloudResolution | null; reload?: boolean } = {}
): Promise<void> {
	const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
	if (!lockManager) {
		throw new Error('This browser cannot safely coordinate a cloud restore. Update it and try again.');
	}

	await lockManager.request(
		CLOUD_RESTORE_WEB_LOCK,
		{ mode: 'exclusive', ifAvailable: true },
		async (lock) => {
			if (!lock) throw new Error('Another Cojudge window is restoring progress. Try again shortly.');
			await coordinateOtherContexts('prepare');
			let applied = false;
			let announced = false;
			try {
				if (!isOperationCurrent(context)) return;
				const latestLocal = await readLocalSnapshot(context);
				if (!isOperationCurrent(context)) return;
				window.dispatchEvent(new Event(CLOUD_FLUSH_EVENT));
				const finalSerialized = serializeProgressData(
					collectProgressData(localStorage, { cloud: true })
				);
				// The re-read snapshot includes IndexedDB pasted images, so the
				// "did anything change" check compares the localStorage-only
				// serialization against the fresh localStorage read.
				if (
					latestLocal.checksum !== expectedLocal.checksum
					|| finalSerialized !== latestLocal.storageSerialized
				) {
					throw new Error('Local progress changed during sync. Sync again to reconcile it safely.');
				}
				if (!isOperationCurrent(context)) return;

				const localDotFiles = extractDotFilesData(localStorage);
				localStorage.setItem(CLOUD_RESTORE_LOCK_KEY, Date.now().toString());
				sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
				applyProgressData(downloaded, { replace: true });
				if (localDotFiles !== null) {
					localStorage.setItem('files', mergeDotFilesData(localStorage.getItem('files'), localDotFiles));
				}
				// The markdown files may reference pasted images; write the payloads
				// back into IndexedDB before the reload so previews can resolve them.
				const pastedImages = extractPastedImages(downloaded);
				if (pastedImages) await importPastedImages(pastedImages);
				applied = true;
				markSynced(context, baseHash, options.resolution ?? null);
				announceCloudRestore(false, options.reload !== false);
				announced = true;
			} catch (error) {
				if (applied) {
					announceCloudRestore(false, options.reload !== false);
					announced = true;
				}
				throw error;
			} finally {
				if (!announced) {
					resumeAfterCloudMutation();
				}
			}
		}
	);
}

async function refreshRemoteState(
	db: Firestore,
	uid: string
): Promise<{ remote: RemoteSnapshotMeta | null; history: RemoteSnapshotMeta[] }> {
	const remotePromise = readRemoteMeta(db, uid);
	const [remote, history] = await Promise.all([
		remotePromise,
		readRemoteHistory(db, uid, remotePromise)
	]);
	return { remote, history };
}

async function runSync(mode: SyncMode, context: OperationContext): Promise<void> {
	if (!browser || !isOperationCurrent(context)) return;
	if (isCloudRestoreInProgress()) return;
	if (!navigator.onLine) {
		if (isOperationCurrent(context)) {
			cloudSyncState.update((state) => ({ ...state, syncStatus: 'offline', error: null, progress: null }));
		}
		if (mode !== 'fetch') throw new Error('Connect to the internet before updating cloud progress.');
		return;
	}

	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		remoteStatus: 'loading',
		error: null,
		progress: { label: 'Preparing progress…', value: 10 }
	}));
	try {
		await coordinateOtherContexts('flush');
		if (!isOperationCurrent(context)) return;
		const local = await readLocalSnapshot(context);
		if (!isOperationCurrent(context)) return;
		setCloudProgress('Reading cloud state…', 35);
		const device = readDeviceMeta();
		const accountId = cloudAccountId(context.projectId, context.uid);
		const accountNeedsConfirmation = needsCloudAccountConfirmation(device.workspaceId, accountId);
		const { remote, history } = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		publishHistory(history, remote?.revisionId ?? null);

		if (accountNeedsConfirmation) {
			cloudSyncState.update((state) => ({
				...state,
				resolution: 'account',
				syncStatus: 'idle',
				error: null,
				progress: null
			}));
			return;
		}
		if (!device.workspaceId) {
			device.workspaceId = accountId;
			writeDeviceMeta(device);
		}

		const direction = mode === 'force-upload'
			? 'upload'
			: mode === 'force-download'
				? 'download'
				: resolveSyncDirection(
						{
							checksum: local.checksum,
							meaningful: local.meaningful,
							lastSyncedHash: local.meta.lastSyncedHash
						},
						remote,
						mode
					);
		if (direction === 'none') {
			if (remote) {
				if (local.checksum === remote.checksum) {
					writeCloudClone(
						cloudAccountId(context.projectId, context.uid),
						remote.checksum,
						local.serialized,
						remote.revisionId
					);
				}
				await finalizeCloudRevision(context, remote.checksum);
			} else {
				if (!isOperationCurrent(context)) return;
				cloudSyncState.update((state) => ({
					...state,
					syncStatus: 'idle',
					resolution: null,
					error: null,
					progress: null
				}));
			}
			return;
		}
		if (direction === 'pending-upload') {
			if (remote) {
				setCloudProgress('Caching cloud copy…', 70);
				try {
					await ensureCloudClone(context, remote);
				} catch {
					// Compare can still fall back to a live download later.
				}
				if (!isOperationCurrent(context)) return;
			}
			cloudSyncState.update((state) => ({
				...state,
				resolution: 'local-changes',
				syncStatus: 'idle',
				error: null,
				progress: null
			}));
			return;
		}
		if (direction === 'conflict') {
			if (remote) {
				setCloudProgress('Caching cloud copy…', 70);
				try {
					await ensureCloudClone(context, remote);
				} catch {
					// Compare can still fall back to a live download later.
				}
				if (!isOperationCurrent(context)) return;
			}
			cloudSyncState.update((state) => ({
				...state,
				resolution: 'conflict',
				syncStatus: 'idle',
				error: null,
				progress: null
			}));
			return;
		}
		if (direction === 'upload') {
			setCloudProgress('Uploading progress…', 55);
			const revisionId = await uploadSnapshot(context.db, context.uid, local, remote);
			if (!isOperationCurrent(context)) return;
			setCloudProgress('Finalizing…', 85);
			const updated = await refreshRemoteState(context.db, context.uid);
			if (!isOperationCurrent(context)) return;
			const uploaded = updated.remote;
			if (!uploaded || uploaded.revisionId !== revisionId) {
				throw new Error('Cojudge Cloud could not confirm the uploaded snapshot.');
			}
			writeCloudClone(
				cloudAccountId(context.projectId, context.uid),
				uploaded.checksum,
				local.serialized,
				uploaded.revisionId
			);
			setCloudProgress('Finalizing…', 95);
			publishHistory(updated.history, uploaded.revisionId);
			await finalizeCloudRevision(context, uploaded.checksum);
			return;
		}
		if (!remote) {
			throw new Error('No Cojudge Cloud snapshot exists for this account yet.');
		}

		setCloudProgress('Downloading from cloud…', 55);
		const downloaded = await downloadSnapshot(context.db, context.uid, remote);
		if (!isOperationCurrent(context)) return;
		writeCloudClone(
			cloudAccountId(context.projectId, context.uid),
			remote.checksum,
			downloaded.serialized,
			remote.revisionId
		);
		setCloudProgress('Applying cloud data…', 85);
		const latest = await readRemoteMeta(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		if (!latest || latest.revisionId !== remote.revisionId) {
			throw new Error('Cloud progress changed while downloading. Try again.');
		}
		await applyDownloadedSnapshot(context, downloaded.data, local, latest.checksum);
		clearCloudProgress();
	} catch (error) {
		if (!isOperationCurrent(context)) return;
		const offline = !navigator.onLine;
		cloudSyncState.update((state) => ({
			...state,
			syncStatus: offline ? 'offline' : 'error',
			remoteStatus: offline ? state.remoteStatus : 'error',
			error: offline ? null : errorMessage(error),
			progress: null
		}));
		throw error;
	}
}

function queueSync(
	mode: SyncMode,
	requestedContext: OperationContext | null = captureOperationContext()
): Promise<void> {
	if (!requestedContext || !isOperationCurrent(requestedContext)) return Promise.resolve();
	if (syncPromise) {
		if (
			mode === 'fetch'
			&& syncContext?.uid === requestedContext.uid
			&& syncContext.authEpoch === requestedContext.authEpoch
		) {
			return syncPromise;
		}
		return syncPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(requestedContext)) return;
			return queueSync(mode, requestedContext);
		});
	}
	const pending = runSync(mode, requestedContext).finally(() => {
		if (syncPromise === pending) {
			syncPromise = null;
			syncContext = null;
		}
	});
	syncPromise = pending;
	syncContext = requestedContext;
	return syncPromise;
}

export function checkCloudNow(): Promise<void> {
	return queueSync('fetch');
}

export function syncCloudNow(): Promise<void> {
	return queueSync('push');
}

export async function refreshCloudLocalState(options: { flush?: boolean } = {}): Promise<boolean> {
	const context = captureOperationContext();
	if (!browser || !context || isCloudRestoreInProgress()) return false;
	const local = await readLocalSnapshot(context, options);
	if (!isOperationCurrent(context)) return false;
	const dirty = local.meta.lastSyncedHash
		? local.checksum !== local.meta.lastSyncedHash
		: local.meaningful;
	cloudSyncState.update((state) => {
		if (state.resolution === 'account' || state.resolution === 'conflict') return state;
		return { ...state, resolution: dirty ? 'local-changes' : null };
	});
	return dirty;
}

function readLocalFilesStore(): FileStore {
	try {
		const raw = localStorage.getItem('files');
		const parsed = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
			? (parsed as FileStore)
			: {};
	} catch {
		return {};
	}
}

function fileChangesAgainstCloud(local: ProgressData, cloud: ProgressData): FileChange[] {
	// Re-sanitizing happens in computeCloudChanges so snapshots uploaded by
	// older builds cannot surface phantom editor-only changes.
	return computeCloudChanges(local, cloud);
}

export async function fetchCloudFileChanges(): Promise<FileChange[]> {
	const context = captureOperationContext();
	if (!browser || !context || isCloudRestoreInProgress()) return [];
	const local = await readLocalSnapshot(context);
	if (!isOperationCurrent(context)) return [];
	const accountId = cloudAccountId(context.projectId, context.uid);

	// Prefer the local cloud clone so diffs never wait on the network when the
	// last-synced cloud copy is already cached (the common local-changes case).
	const cached = readCloudClone(accountId);
	if (cached && local.meta.lastSyncedHash && cached.checksum === local.meta.lastSyncedHash) {
		return fileChangesAgainstCloud(local.data, cached.data);
	}

	const remote = await readRemoteMeta(context.db, context.uid);
	if (!isOperationCurrent(context)) return [];

	if (!remote) {
		return computeCloudChanges(local.data, {});
	}

	const cloudData = await ensureCloudClone(context, remote);
	if (!isOperationCurrent(context)) return [];
	return fileChangesAgainstCloud(local.data, cloudData);
}

async function runSelectedFilePush(
	fileIds: readonly string[],
	context: OperationContext
): Promise<void> {
	if (!browser || !isOperationCurrent(context) || isCloudRestoreInProgress()) return;
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		error: null,
		progress: { label: 'Preparing selected changes…', value: 10 }
	}));

	try {
		if (!navigator.onLine) {
			throw new Error('Connect to the internet before pushing selected changes.');
		}
		const resolution = get(cloudSyncState).resolution;
		if (resolution === 'account' || resolution === 'conflict') {
			throw new Error('Resolve the current cloud workspace choice before pushing selected changes.');
		}

		await coordinateOtherContexts('flush');
		if (!isOperationCurrent(context)) return;
		const local = await readLocalSnapshot(context);
		if (!isOperationCurrent(context)) return;

		setCloudProgress('Reading cloud state…', 30);
		const { remote, history } = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		publishHistory(history, remote?.revisionId ?? null);

		let cloudData: ProgressData = {};
		if (remote) {
			setCloudProgress('Merging selected changes…', 45);
			cloudData = await ensureCloudClone(context, remote);
			if (!isOperationCurrent(context)) return;
		}

		let mergedData = applySelectedChanges(cloudData, fileIds, local.data) as ProgressData;
		mergedData = sanitizeCloudFiles(mergedData);
		mergedData = retainReferencedPastedImages(mergedData, [
			extractPastedImages(cloudData),
			extractPastedImages(local.data)
		]);
		const serialized = serializeProgressData(mergedData);
		const upload: UploadSnapshot = {
			data: mergedData,
			checksum: await hashProgress(serialized),
			meaningful: isMeaningfulProgress(mergedData)
		};
		if (!isOperationCurrent(context)) return;

		if (remote && upload.checksum === remote.checksum) {
			writeCloudClone(
				cloudAccountId(context.projectId, context.uid),
				remote.checksum,
				serialized,
				remote.revisionId
			);
			await finalizeCloudRevision(context, remote.checksum);
			return;
		}

		setCloudProgress('Uploading selected changes…', 60);
		const revisionId = await uploadSnapshot(context.db, context.uid, upload, remote);
		if (!isOperationCurrent(context)) return;
		setCloudProgress('Finalizing…', 85);
		const updated = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		const uploaded = updated.remote;
		if (!uploaded || uploaded.revisionId !== revisionId) {
			throw new Error('Cojudge Cloud could not confirm the selected changes.');
		}
		writeCloudClone(
			cloudAccountId(context.projectId, context.uid),
			uploaded.checksum,
			serialized,
			uploaded.revisionId
		);
		publishHistory(updated.history, uploaded.revisionId);
		await finalizeCloudRevision(context, uploaded.checksum);
	} catch (error) {
		if (!isOperationCurrent(context)) return;
		const offline = !navigator.onLine;
		cloudSyncState.update((state) => ({
			...state,
			syncStatus: offline ? 'offline' : 'error',
			remoteStatus: offline ? state.remoteStatus : 'error',
			error: offline ? null : errorMessage(error),
			progress: null
		}));
		throw error;
	}
}

export function pushLocalFileChanges(fileIds: readonly string[]): Promise<void> {
	const selectedFileIds = [...new Set(fileIds.filter((fileId) => fileId.length > 0))];
	const requestedContext = captureOperationContext();
	if (selectedFileIds.length === 0 || !requestedContext) return Promise.resolve();
	if (syncPromise) {
		return syncPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(requestedContext)) return;
			return pushLocalFileChanges(selectedFileIds);
		});
	}
	const pending = runSelectedFilePush(selectedFileIds, requestedContext).finally(() => {
		if (syncPromise === pending) {
			syncPromise = null;
			syncContext = null;
		}
	});
	syncPromise = pending;
	syncContext = requestedContext;
	return pending;
}

export async function discardLocalFileChanges(fileIds: readonly string[]): Promise<void> {
	const selectedFileIds = [...new Set(fileIds.filter((fileId) => fileId.length > 0))];
	if (selectedFileIds.length === 0) return;
	const context = captureOperationContext();
	if (!browser || !context || isCloudRestoreInProgress()) return;
	if (!navigator.onLine) {
		throw new Error('Connect to the internet to restore the change from the cloud.');
	}
	const remote = await readRemoteMeta(context.db, context.uid);
	if (!isOperationCurrent(context)) return;
	if (!remote) {
		throw new Error('No Cojudge Cloud snapshot exists for this account yet.');
	}
	const downloaded = await ensureCloudClone(context, remote);
	if (!isOperationCurrent(context)) return;

	// Reverted markdown may reference pasted images; make sure the payloads are
	// available locally before the cloud content is applied.
	const pastedImages = extractPastedImages(downloaded);
	if (pastedImages) await importPastedImages(pastedImages);

	// Dotfiles are local-only and stripped from cloud snapshots. Capture them
	// before any discard path that rewrites `files` so secrets like `.env` are
	// never wiped when restoring cloud content.
	const localDotFiles = extractDotFilesData(localStorage);
	const contextSnapshot = await readLocalSnapshot(context);
	if (!isOperationCurrent(context)) return;
	const localData: ProgressStore = {
		...contextSnapshot.data,
		files: readLocalFilesStore()
	};
	const updated = applySelectedChanges(localData, selectedFileIds, downloaded);
	applyProgressData(updated, { replace: true });

	if (localDotFiles !== null) {
		const merged = mergeDotFilesData(localStorage.getItem('files'), localDotFiles);
		localStorage.setItem('files', merged);
		try {
			const parsed = JSON.parse(merged) as FileStore;
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				fileStore.set(parsed);
				fileSyncVersion.update((version) => version + 1);
			}
		} catch {
			// keep whatever apply wrote if the merge payload is malformed
		}
	}

	if (selectedFileIds.includes(WHITEBOARD_FILE_ID)) {
		window.dispatchEvent(new CustomEvent(WHITEBOARD_RESTORED_EVENT));
	}

	// Active editors keep their own in-memory values. Notify them after every
	// selected restore is complete and before the next cloud flush compares it.
	for (const fileId of selectedFileIds) {
		window.dispatchEvent(new CustomEvent(CLOUD_FILE_DISCARDED_EVENT, { detail: { fileId } }));
	}
	await refreshCloudLocalState();
}

export function discardLocalFileChange(fileId: string): Promise<void> {
	return discardLocalFileChanges([fileId]);
}

function queueStashOperation<T>(
	context: OperationContext,
	operation: () => Promise<T>
): Promise<T> {
	if (syncPromise) {
		return syncPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(context)) {
				throw new Error('The signed-in account changed. Try again.');
			}
			return queueStashOperation(context, operation);
		});
	}
	const pending = operation();
	const barrier = pending
		.then(() => undefined, () => undefined)
		.finally(() => {
			if (syncPromise === barrier) {
				syncPromise = null;
				syncContext = null;
			}
		});
	syncPromise = barrier;
	syncContext = context;
	return pending;
}

function announceStashApplied(changes: readonly StashChange[]): void {
	if (changes.some((change) => change.fileId === WHITEBOARD_FILE_ID)) {
		window.dispatchEvent(new CustomEvent(WHITEBOARD_RESTORED_EVENT));
	}
	for (const change of changes) {
		window.dispatchEvent(new CustomEvent(CLOUD_FILE_DISCARDED_EVENT, { detail: { fileId: change.fileId } }));
	}
}

function cloudStashFailure(error: unknown): void {
	if (!browser) return;
	const offline = !navigator.onLine;
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: offline ? 'offline' : 'error',
		remoteStatus: offline ? state.remoteStatus : 'error',
		error: offline ? null : errorMessage(error),
		progress: null
	}));
}

async function resolveCloudStashBase(
	context: OperationContext,
	local: LocalSnapshot,
	remote: RemoteSnapshotMeta | null,
	history: readonly RemoteSnapshotMeta[]
): Promise<{ data: ProgressData; revisionId: string | null; checksum: string | null }> {
	const cached = readCloudClone(cloudAccountId(context.projectId, context.uid));
	const choice = chooseCloudStashBase({
		lastSyncedHash: local.meta.lastSyncedHash,
		cached,
		remote,
		history
	});
	if (choice.source === 'unknown') {
		throw new Error(
			'Cojudge Cloud cannot verify which cloud version these local changes are based on. Sync or resolve the cloud changes first, then try stashing again.'
		);
	}
	if (choice.source === 'empty') {
		return { data: {}, revisionId: null, checksum: null };
	}
	if (choice.source === 'cached') {
		if (!cached) throw new Error('The cached cloud baseline is unavailable. Sync again before stashing.');
		return {
			data: cached.data,
			revisionId: cached.revisionId,
			checksum: cached.checksum
		};
	}
	if (choice.source === 'remote') {
		if (!remote) throw new Error('The cloud working copy is no longer available. Try again.');
		const data = await ensureCloudClone(context, remote);
		if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
		return { data, revisionId: remote.revisionId, checksum: remote.checksum };
	}

	const retained = history.find((revision) => revision.revisionId === choice.revisionId);
	if (!retained) {
		throw new Error('The cloud revision these changes are based on is no longer retained. Sync or resolve the cloud changes first.');
	}
	const downloaded = await downloadSnapshot(context.db, context.uid, retained);
	if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
	return {
		data: downloaded.data,
		revisionId: retained.revisionId,
		checksum: retained.checksum
	};
}

async function runStashLocalChanges(
	context: OperationContext,
	name: string | undefined
): Promise<CloudStashSummary> {
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		error: null,
		progress: { label: 'Preparing stash…', value: 10 }
	}));
	try {
		if (!navigator.onLine) throw new Error('Connect to the internet before stashing local changes.');
		if (get(cloudSyncState).resolution === 'account') {
			throw new Error('Choose the account workspace before stashing local changes.');
		}
		const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
		if (!lockManager) {
			throw new Error('This browser cannot safely coordinate a stash. Update it and try again.');
		}
		return await lockManager.request(
			CLOUD_STASH_WEB_LOCK,
			{ mode: 'exclusive', ifAvailable: true },
			async (lock) => {
				if (!lock) throw new Error('Another Cojudge window is stashing or restoring changes. Try again shortly.');
				await coordinateOtherContexts('flush');
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				const local = await readLocalSnapshot(context);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				setCloudProgress('Reading cloud state…', 30);
				const { remote, history } = await refreshRemoteState(context.db, context.uid);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				const base = await resolveCloudStashBase(context, local, remote, history);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				const changes = collectStashChanges(base.data, local.data);
				if (changes.length === 0) {
					throw new Error('Nothing to stash: the local working copy already matches the cloud version.');
				}
				const images = collectStashImages(local.data, changes);
				setCloudProgress('Uploading stash…', 55);
				const summary = await uploadCloudStash(
					context,
					normalizeCloudStashName(name),
					base.revisionId,
					base.checksum,
					changes,
					images
				);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				try {
					await cleanupCloudStashes(context, await readCloudStashes(context.db, context.uid));
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
					setCloudProgress('Restoring cloud working copy…', 80);
					const latestRemote = await readRemoteMeta(context.db, context.uid);
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
					const latest = latestRemote ? await ensureCloudClone(context, latestRemote) : {};
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
					const latestHash = latestRemote?.checksum
						?? (await hashProgress(serializeProgressData({})));
					await applyDownloadedSnapshot(context, latest, local, latestHash, {
						resolution: null,
						reload: false
					});
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				} catch (error) {
					throw new Error(
						`Your changes were saved as stash “${summary.name}”, but Cojudge Cloud could not restore the latest working copy: ${errorMessage(error)} The stash was kept; pop it when ready.`
					);
				}
				announceStashApplied(changes);
				clearCloudProgress();
				return summary;
			}
		);
	} catch (error) {
		if (isOperationCurrent(context)) cloudStashFailure(error);
		throw error;
	}
}

export function stashLocalChanges(name?: string): Promise<CloudStashSummary> {
	const context = captureOperationContext();
	if (!context) return Promise.reject(new Error('Sign in to Cojudge Cloud before stashing changes.'));
	return queueStashOperation(context, () => runStashLocalChanges(context, name));
}

async function runPopCloudStash(
	context: OperationContext,
	stashId: string,
	owner: string
): Promise<CloudStashPopResult> {
	let claimed = false;
	let released = false;
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		error: null,
		progress: { label: 'Preparing stash restore…', value: 10 }
	}));
	try {
		if (!navigator.onLine) throw new Error('Connect to the internet before popping a stash.');
		if (!validStashId(stashId)) throw new Error('That stash id is invalid.');
		if (get(cloudSyncState).resolution === 'account') {
			throw new Error('Choose the account workspace before popping a stash.');
		}
		const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
		if (!lockManager) {
			throw new Error('This browser cannot safely coordinate a stash restore. Update it and try again.');
		}
		return await lockManager.request(
			CLOUD_STASH_WEB_LOCK,
			{ mode: 'exclusive', ifAvailable: true },
			async (lock) => {
				if (!lock) throw new Error('Another Cojudge window is restoring a stash. Try again shortly.');
				const stash = await claimCloudStash(context, stashId, owner);
				claimed = true;
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				setCloudProgress('Downloading stash…', 40);
				const payload = await downloadCloudStash(context.db, context.uid, stash);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				if (Object.keys(payload.images).length > 0) {
					setCloudProgress('Restoring stashed images…', 55);
					try {
						await importPastedImages(payload.images);
					} catch (error) {
						throw new Error(`The stash could not be restored and was kept: ${errorMessage(error)}`);
					}
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				}
				const local = await readLocalSnapshot(context);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				const plan = planStashPop(local.data, payload.changes);
				const remote = await readRemoteMeta(context.db, context.uid);
				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');

				let resolution: CloudResolution | null = plan.conflicts.length > 0 ? 'local-changes' : null;
				if (plan.applied.length > 0) {
					setCloudProgress('Applying stash…', 75);
					const mergedSerialized = serializeProgressData(plan.data);
					const mergedChecksum = await hashProgress(mergedSerialized);
					const baseHash = remote?.checksum ?? (await hashProgress(serializeProgressData({})));
					if (mergedChecksum !== baseHash || plan.conflicts.length > 0) resolution = 'local-changes';
					try {
						await applyDownloadedSnapshot(context, plan.data, local, baseHash, {
							resolution,
							reload: false
						});
					} catch (error) {
						throw new Error(`The stash could not be applied safely and was kept: ${errorMessage(error)}`);
					}
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
					announceStashApplied(plan.applied);
				} else {
					await refreshCloudLocalState({ flush: false });
					if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				}

				if (!isOperationCurrent(context)) throw new Error('The signed-in account changed. Try again.');
				const dropped = plan.conflicts.length === 0;
				if (dropped) {
					try {
						released = await releaseCloudStash(context, stashId, owner, true);
					} catch (error) {
						throw new Error(`The stash was applied, but could not be removed from the cloud: ${errorMessage(error)}`);
					}
				} else {
					released = await releaseCloudStash(context, stashId, owner, false);
				}
				if (!released) {
					throw new Error('The stash was applied, but its cloud record changed or its lease expired. Check Cloud stashes before retrying.');
				}
				clearCloudProgress();
				return {
					stash,
					applied: plan.applied,
					alreadyApplied: plan.alreadyApplied,
					conflicts: plan.conflicts,
					dropped
				};
			}
		);
	} catch (error) {
		if (claimed && !released) {
			try {
				released = await releaseCloudStash(context, stashId, owner, false);
			} catch {
				// The lease expires automatically, so a failed release never makes
				// the stash permanently unavailable.
			}
		}
		if (isOperationCurrent(context)) cloudStashFailure(error);
		throw error;
	}
}

export function popCloudStash(stashId: string): Promise<CloudStashPopResult> {
	const context = captureOperationContext();
	if (!context) return Promise.reject(new Error('Sign in to Cojudge Cloud before popping a stash.'));
	const owner = makeCloudStashId().slice('stash-'.length);
	return queueStashOperation(context, () => runPopCloudStash(context, stashId, owner));
}

async function runDropCloudStash(context: OperationContext, stashId: string): Promise<void> {
	if (!navigator.onLine) throw new Error('Connect to the internet before deleting a stash.');
	if (!validStashId(stashId)) throw new Error('That stash id is invalid.');
	const deleted = await runTransaction(context.db, async (transaction) => {
		const reference = cloudStashRef(context.db, context.uid, stashId);
		const result = await transaction.get(reference);
		if (!result.exists()) return false;
		const stash = parseCloudStashMeta(stashId, result.data());
		const scope = stashContext(context);
		if (stash.workspaceId !== scope.workspaceId || stash.repoId !== scope.repoId) {
			throw new Error('That stash belongs to another cloud workspace.');
		}
		if (cloudStashIsLeased(stash)) {
			throw new Error('That stash is being restored on another device. Try again shortly.');
		}
		transaction.delete(reference);
		return true;
	});
	if (deleted) {
		const parts = await getDocs(query(cloudStashPartsRef(context.db, context.uid, stashId), orderBy('index')));
		for (let offset = 0; offset < parts.docs.length; offset += 400) {
			const batch = writeBatch(context.db);
			for (const part of parts.docs.slice(offset, offset + 400)) batch.delete(part.ref);
			await batch.commit();
		}
	}
}

export function dropCloudStash(stashId: string): Promise<void> {
	const context = captureOperationContext();
	if (!context) return Promise.reject(new Error('Sign in to Cojudge Cloud before deleting a stash.'));
	return queueStashOperation(context, () => runDropCloudStash(context, stashId));
}

export async function listCloudStashes(): Promise<CloudStashSummary[]> {
	const context = captureOperationContext();
	if (!browser || !context) return [];
	if (!navigator.onLine) throw new Error('Connect to the internet to load cloud stashes.');
	const stashes = await readCloudStashes(context.db, context.uid);
	const cleaned = await cleanupCloudStashes(context, stashes);
	const scope = stashContext(context);
	return stashes.filter(
		(stash) => !cleaned.has(stash.stashId)
			&& stash.workspaceId === scope.workspaceId
			&& stash.repoId === scope.repoId
	);
}

async function inspectCloudSignOut(context: OperationContext): Promise<CloudSignOutCheck> {
	if (!navigator.onLine || !isOperationCurrent(context)) return 'unknown';
	const local = await readLocalSnapshot(context);
	if (!isOperationCurrent(context)) return 'unknown';
	const remote = await readRemoteMeta(context.db, context.uid);
	if (!isOperationCurrent(context)) return 'unknown';
	const finalLocal = await readLocalSnapshot(context);
	if (!isOperationCurrent(context)) return 'unknown';
	if (local.checksum !== finalLocal.checksum) return 'unsynced';
	return needsSignOutDataChoice(finalLocal, remote) ? 'unsynced' : 'matching';
}

export async function checkCloudSignOut(): Promise<CloudSignOutCheck> {
	if (!browser) return 'unknown';
	const context = captureOperationContext();
	const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
	if (!context || isCloudRestoreInProgress() || !lockManager || syncPromise) return 'unknown';

	try {
		await coordinateOtherContexts('flush');
		return await inspectCloudSignOut(context);
	} catch {
		return 'unknown';
	}
}

async function runRevisionRestore(
	revisionId: string,
	context: OperationContext
): Promise<void> {
	if (!browser || !isOperationCurrent(context)) return;
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		error: null,
		progress: { label: 'Restoring backup…', value: 35 }
	}));
	try {
		if (!navigator.onLine) throw new Error('Connect to the internet before restoring cloud progress.');
		if (get(cloudSyncState).resolution === 'account') {
			throw new Error('Choose the account workspace before restoring revision history.');
		}
		await coordinateOtherContexts('flush');
		if (!isOperationCurrent(context)) return;
		const local = await readLocalSnapshot(context);
		if (!isOperationCurrent(context)) return;
		const { remote, history } = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		publishHistory(history, remote?.revisionId ?? null);
		if (!remote) throw new Error('No Cojudge Cloud snapshot exists for this account yet.');
		const cached = history.find((revision) => revision.revisionId === revisionId);
		if (!cached) throw new Error('That cloud revision is no longer retained.');

		let selected = cached;
		if (cached.revisionId !== remote.revisionId) {
			const result = await getDoc(
				snapshotRef(context.db, context.uid, cached.snapshotId)
			);
			if (!isOperationCurrent(context)) return;
			const currentSlot = result.exists() ? parseHistoryMeta(result.id, result.data()) : null;
			if (!currentSlot || currentSlot.revisionId !== revisionId) {
				throw new Error('That cloud revision is no longer retained.');
			}
			selected = currentSlot;
		}

		setCloudProgress('Downloading backup…', 65);
		const downloaded = await downloadSnapshot(context.db, context.uid, selected);
		if (!isOperationCurrent(context)) return;
		if (selected.revisionId === remote.revisionId) {
			writeCloudClone(
				cloudAccountId(context.projectId, context.uid),
				selected.checksum,
				downloaded.serialized,
				selected.revisionId
			);
		}
		setCloudProgress('Applying backup…', 85);
		const latest = await readRemoteMeta(context.db, context.uid);
		if (!latest || latest.revisionId !== remote.revisionId) {
			throw new Error('Cloud progress changed while restoring. Try again.');
		}
		if (!isOperationCurrent(context)) return;
		await applyDownloadedSnapshot(context, downloaded.data, local, latest.checksum);
		clearCloudProgress();
	} catch (error) {
		if (!isOperationCurrent(context)) return;
		cloudSyncState.update((state) => ({
			...state,
			syncStatus: navigator.onLine ? 'error' : 'offline',
			remoteStatus: navigator.onLine ? 'error' : state.remoteStatus,
			error: navigator.onLine ? errorMessage(error) : null,
			progress: null
		}));
		throw error;
	}
}

export function restoreCloudRevision(revisionId: string): Promise<void> {
	const requestedContext = captureOperationContext();
	if (!requestedContext) return Promise.resolve();
	if (syncPromise) {
		return syncPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(requestedContext)) return;
			return restoreCloudRevision(revisionId);
		});
	}
	const pending = runRevisionRestore(revisionId, requestedContext).finally(() => {
		if (syncPromise === pending) {
			syncPromise = null;
			syncContext = null;
		}
	});
	syncPromise = pending;
	syncContext = requestedContext;
	return pending;
}

async function runRevisionDelete(
	revisionId: string,
	context: OperationContext
): Promise<void> {
	if (!browser || !isOperationCurrent(context)) return;
	cloudSyncState.update((state) => ({
		...state,
		syncStatus: 'syncing',
		error: null,
		progress: { label: 'Deleting backup…', value: null }
	}));
	try {
		if (!navigator.onLine) throw new Error('Connect to the internet before deleting a cloud backup.');
		if (get(cloudSyncState).resolution === 'account') {
			throw new Error('Choose the account workspace before deleting revision history.');
		}

		const { remote, history } = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		publishHistory(history, remote?.revisionId ?? null);
		const selected = history.find((revision) => revision.revisionId === revisionId);
		if (!selected) throw new Error('That cloud revision is no longer retained.');
		if (selected.revisionId === remote?.revisionId) {
			throw new Error('The latest cloud revision cannot be deleted.');
		}

		const deletedMeta = await runTransaction(context.db, async (transaction) => {
			const reference = latestRef(context.db, context.uid);
			const manifest = snapshotRef(context.db, context.uid, selected.snapshotId);
			const latestResult = await transaction.get(reference);
			const manifestResult = await transaction.get(manifest);
			if (!latestResult.exists()) throw new Error('No current cloud snapshot exists.');
			const latest = parseRemoteMeta(latestResult.data());
			const currentSlot = manifestResult.exists()
				? parseHistoryMeta(manifestResult.id, manifestResult.data())
				: null;
			if (!currentSlot || currentSlot.revisionId !== revisionId) {
				throw new Error('That cloud revision is no longer retained.');
			}
			if (
				latest.revisionId === currentSlot.revisionId
				|| latest.snapshotId === currentSlot.snapshotId
			) {
				throw new Error('The latest cloud revision cannot be deleted.');
			}

			for (let index = 0; index < currentSlot.partCount; index++) {
				transaction.delete(
					doc(partsRef(context.db, context.uid, currentSlot.snapshotId), index.toString().padStart(4, '0'))
				);
			}
			transaction.delete(manifest);
			return currentSlot;
		});
		const deletedAssetSet = cloudAssetSet(deletedMeta);
		if (deletedAssetSet?.storage === 'revision') {
			await deleteCloudAssetSetQuietly(context.db, context.uid, deletedAssetSet, 'the deleted revision');
		} else if (deletedAssetSet) {
			await collectSharedCloudAssetSetQuietly(context.db, context.uid, deletedAssetSet, 'the deleted revision');
		}
		if (!isOperationCurrent(context)) return;
		const updated = await refreshRemoteState(context.db, context.uid);
		if (!isOperationCurrent(context)) return;
		publishHistory(updated.history, updated.remote?.revisionId ?? null);
		cloudSyncState.update((state) => ({ ...state, syncStatus: 'idle', error: null, progress: null }));
	} catch (error) {
		if (!isOperationCurrent(context)) return;
		cloudSyncState.update((state) => ({
			...state,
			syncStatus: navigator.onLine ? 'error' : 'offline',
			error: navigator.onLine ? errorMessage(error) : null,
			progress: null
		}));
		throw error;
	}
}

export function deleteCloudRevision(revisionId: string): Promise<void> {
	const requestedContext = captureOperationContext();
	if (!requestedContext) return Promise.resolve();
	if (syncPromise) {
		return syncPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(requestedContext)) return;
			return deleteCloudRevision(revisionId);
		});
	}
	const pending = runRevisionDelete(revisionId, requestedContext).finally(() => {
		if (syncPromise === pending) {
			syncPromise = null;
			syncContext = null;
		}
	});
	syncPromise = pending;
	syncContext = requestedContext;
	return pending;
}

function handleAuthUser(user: User | null, currentGeneration: number): void {
	if (generation !== currentGeneration) return;
	const identity = user ? `${user.uid}:${user.isAnonymous ? 'anonymous' : 'authenticated'}` : 'signed-out';
	if (identity === observedAuthIdentity) {
		if (user && !user.isAnonymous) {
			cloudSyncState.update((state) => ({ ...state, user: userView(user) }));
		}
		return;
	}
	observedAuthIdentity = identity;
	authEpoch++;
	if (!user || user.isAnonymous) {
		cloudSyncState.set({
			authStatus: 'signed-out',
			syncStatus: 'idle',
			user: null,
			lastSyncedAt: null,
			resolution: null,
			remoteStatus: 'unknown',
			history: [],
			error: null,
			progress: null
		});
		return;
	}

	const device = readDeviceMeta();
	const projectId = activeDb?.app.options.projectId;
	if (!projectId) return;
	const accountId = cloudAccountId(projectId, user.uid);
	const accountNeedsConfirmation = needsCloudAccountConfirmation(device.workspaceId, accountId);
	const localMeta = device.users[accountId];
	cloudSyncState.set({
		authStatus: 'signed-in',
		syncStatus: 'idle',
		user: userView(user),
		lastSyncedAt: localMeta?.lastSyncedAt ?? null,
		resolution: accountNeedsConfirmation ? 'account' : null,
		remoteStatus: 'unknown',
		history: [],
		error: null,
		progress: null
	});
	void checkCloudNow().catch(() => undefined);
}

export function startCloudSync(): Promise<void> {
	if (!browser) return Promise.resolve();
	if (startPromise) return startPromise;
	initializeCloudRestoreContext();
	startCoordination();
	const currentGeneration = ++generation;
	cloudSyncState.update((state) => ({ ...state, authStatus: 'initializing', error: null }));

	// Re-evaluate the local-changes resolution shortly after any local file
	// save, so cloud indicators (e.g. the playground legend) stay current.
	// The flush is skipped because this refresh is itself triggered by a file
	// store save; flushing again would make flush handlers write to the store
	// and retrigger this debounce in a self-sustaining loop.
	fileStoreUnsubscribe = fileStore.subscribe(() => {
		if (dirtyRefreshTimer) clearTimeout(dirtyRefreshTimer);
		dirtyRefreshTimer = setTimeout(() => {
			dirtyRefreshTimer = null;
			void refreshCloudLocalState({ flush: false }).catch(() => undefined);
		}, 500);
	});

	startPromise = (async () => {
		try {
			const initialized = await initFirebase();
			if (generation !== currentGeneration) return;
			if (!initialized) {
				cloudSyncState.set({ ...initialState, authStatus: 'unavailable' });
				return;
			}

			activeAuth = initialized.auth;
			activeDb = initialized.db;
			authUnsubscribe = onIdTokenChanged(activeAuth, (user) =>
				handleAuthUser(user, currentGeneration)
			);
			syncInterval = setInterval(() => {
				void checkCloudNow().catch(() => undefined);
			}, SYNC_INTERVAL_MS);
			onlineListener = () => void checkCloudNow().catch(() => undefined);
			window.addEventListener('online', onlineListener);
		} catch (error) {
			if (generation === currentGeneration) {
				cloudSyncState.set({
					...initialState,
					authStatus: 'unavailable',
					syncStatus: 'error',
					error: errorMessage(error)
				});
			}
		}
	})();
	return startPromise;
}

export function stopCloudSync(): void {
	generation++;
	authEpoch++;
	authUnsubscribe?.();
	authUnsubscribe = null;
	if (syncInterval) clearInterval(syncInterval);
	syncInterval = null;
	if (onlineListener) window.removeEventListener('online', onlineListener);
	onlineListener = null;
	fileStoreUnsubscribe?.();
	fileStoreUnsubscribe = null;
	if (dirtyRefreshTimer) clearTimeout(dirtyRefreshTimer);
	dirtyRefreshTimer = null;
	stopCoordination();
	activeAuth = null;
	activeDb = null;
	startPromise = null;
	syncPromise = null;
	syncContext = null;
	observedAuthIdentity = '';
	cloudSyncState.set(initialState);
}

export async function restartCloudSync(): Promise<void> {
	stopCloudSync();
	await startCloudSync();
}

export async function connectCloud(): Promise<void> {
	cloudSyncState.update((state) => ({
		...state,
		authStatus: 'signing-in',
		error: null
	}));
	try {
		await signInWithGoogle();
	} catch (error) {
		cloudSyncState.update((state) => {
			if (state.authStatus !== 'signing-in') return { ...state, error: errorMessage(error) };
			const currentUser = activeAuth?.currentUser;
			if (currentUser && !currentUser.isAnonymous) {
				return {
					...state,
					authStatus: 'signed-in',
					user: userView(currentUser),
					error: errorMessage(error)
				};
			}
			return { ...state, authStatus: 'signed-out', user: null, error: errorMessage(error) };
		});
		throw error;
	}
}

async function clearLocalDataAndSignOut(
	context: OperationContext,
	requireCloudMatch: boolean,
	keepDotFiles = false
): Promise<CloudDisconnectResult> {
	const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
	if (!lockManager) {
		throw new Error('This browser cannot safely clear local data. Update it and try again.');
	}

	return lockManager.request(
		CLOUD_RESTORE_WEB_LOCK,
		{ mode: 'exclusive', ifAvailable: true },
		async (lock) => {
			if (!lock) throw new Error('Another Cojudge window is updating local data. Try again shortly.');
			setCloudProgress('Checking cloud backup…', null);
			if (requireCloudMatch) {
				await coordinateOtherContexts('flush');
				try {
					const initialCheck = await inspectCloudSignOut(context);
					if (initialCheck !== 'matching') {
						clearCloudProgress();
						return initialCheck;
					}
				} catch {
					clearCloudProgress();
					return 'unknown';
				}
			}

			await coordinateOtherContexts('clear');
			const dotFilesSnapshot = keepDotFiles ? extractDotFilesData(localStorage) : null;
			let mutationStarted = false;
			let announced = false;
			try {
				if (!isOperationCurrent(context)) return 'unknown';
				setCloudProgress('Deleting local data…', 55);
				localStorage.setItem(CLOUD_RESTORE_LOCK_KEY, Date.now().toString());
				if (requireCloudMatch) {
					try {
						const finalCheck = await inspectCloudSignOut(context);
						if (finalCheck !== 'matching') return finalCheck;
					} catch {
						return 'unknown';
					}
				}
				sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
				await signOutFirebase();

				mutationStarted = true;
				setCloudProgress('Finalizing…', 85);
				applyProgressData({}, { replace: true });
				clearProgressStorage(localStorage);
				if (dotFilesSnapshot !== null) {
					localStorage.setItem('files', dotFilesSnapshot);
				}
				sessionStorage.removeItem(FORK_TRANSFER_STORAGE_KEY);
				saveUserMeta(context, {
					lastSyncedHash: null,
					lastSyncedAt: null
				});
				announceCloudRestore(true);
				announced = true;
				return 'signed-out';
			} catch (error) {
				if (mutationStarted) {
					announceCloudRestore(true);
					announced = true;
				}
				throw error;
			} finally {
				clearCloudProgress();
				if (!announced) {
					resumeAfterCloudMutation();
				}
			}
		}
	);
}

export async function disconnectCloud(
	options: { clearLocalData?: boolean; requireCloudMatch?: boolean; keepDotFiles?: boolean } = {}
): Promise<CloudDisconnectResult> {
	try {
		if (!options.clearLocalData) {
			await signOutFirebase();
			return 'signed-out';
		}
		const context = captureOperationContext();
		if (!context) throw new Error('The signed-in account changed. Try again.');
		return await clearLocalDataAndSignOut(context, options.requireCloudMatch === true, options.keepDotFiles === true);
	} catch (error) {
		cloudSyncState.update((state) => state.authStatus === 'signed-in'
			? { ...state, syncStatus: 'error', error: errorMessage(error) }
			: state
		);
		throw error;
	}
}

export async function resolveCloudProgress(preference: 'local' | 'cloud'): Promise<void> {
	let context = captureOperationContext();
	if (!context) return;
	let state = get(cloudSyncState);
	if (state.remoteStatus === 'unknown' || state.remoteStatus === 'loading' || state.remoteStatus === 'error') {
		await queueSync('fetch', context);
		if (!isOperationCurrent(context)) return;
		state = get(cloudSyncState);
	}
	if (state.remoteStatus !== 'present' && state.remoteStatus !== 'absent') {
		throw new Error('Cojudge Cloud could not confirm the remote workspace. Try again.');
	}
	if (preference === 'cloud' && state.remoteStatus !== 'present') {
		throw new Error('No Cojudge Cloud snapshot exists for this account yet.');
	}
	const resolution = state.resolution;
	const device = readDeviceMeta();
	const accountId = cloudAccountId(context.projectId, context.uid);
	const previousWorkspaceId = device.workspaceId;
	device.workspaceId = accountId;
	writeDeviceMeta(device);
	cloudSyncState.update((state) => ({
		...state,
		resolution: null,
		error: null
	}));
	try {
		const mode: SyncMode = preference === 'cloud'
			? 'force-download'
			: resolution === 'local-changes'
				? 'push'
				: 'force-upload';
		context = captureOperationContext();
		if (!context) return;
		const operationContext = context;
		await queueSync(mode, operationContext);
	} catch (error) {
		const operationContext = context;
		if (!operationContext || !isOperationCurrent(operationContext)) return;
		const current = readDeviceMeta();
		if (current.workspaceId === cloudAccountId(operationContext.projectId, operationContext.uid)) {
			current.workspaceId = previousWorkspaceId;
			writeDeviceMeta(current);
		}
		cloudSyncState.update((state) => ({
			...state,
			resolution: resolution ?? 'account'
		}));
		throw error;
	}
}
