import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { onIdTokenChanged, type Auth, type Unsubscribe, type User } from 'firebase/auth';
import {
	collection,
	doc,
	getDocFromServer,
	getDocsFromServer,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	type Firestore
} from 'firebase/firestore';
import { initFirebase, signInWithGoogle, signOutFirebase } from '$lib/firebase';
import {
	CLOUD_FLUSH_EVENT,
	CLOUD_RESTORE_COMPLETE_KEY,
	CLOUD_RESTORE_LOCK_KEY,
	CLOUD_RESTORE_SESSION_KEY,
	CLOUD_SNAPSHOT_VERSION,
	collectProgressData,
	decodeProgressParts,
	encodeProgressParts,
	hashProgress,
	initializeCloudRestoreContext,
	serializeProgressData,
	type ProgressData
} from '$lib/progressBackup';
import { applyProgressData } from '$lib/progressBackupClient';

const MAX_SNAPSHOT_BYTES = 6 * 1024 * 1024;
const MAX_SNAPSHOT_PARTS = 12;
const CLOUD_OPERATION_WEB_LOCK = 'cojudge-cloud-backup-operation';

type CloudAuthStatus = 'initializing' | 'unavailable' | 'signed-out' | 'signing-in' | 'signed-in';
type CloudOperationStatus =
	| 'idle'
	| 'checking'
	| 'uploading'
	| 'downloading'
	| 'offline'
	| 'error';

export type CloudUser = {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
};

export type CloudBackup = {
	updatedAt: number;
	totalBytes: number;
};

export type CloudSyncState = {
	authStatus: CloudAuthStatus;
	syncStatus: CloudOperationStatus;
	user: CloudUser | null;
	backup: CloudBackup | null;
	error: string | null;
};

type RemoteBackupMeta = CloudBackup & {
	source: 'single' | 'legacy';
	snapshotId: string | null;
	checksum: string;
	partCount: number;
};

type OperationContext = {
	auth: Auth;
	db: Firestore;
	uid: string;
	authEpoch: number;
	generation: number;
};

type LocalBackup = {
	serialized: string;
	checksum: string;
};

type LockManager = {
	request<T>(
		name: string,
		options: { mode: 'exclusive'; ifAvailable: true },
		callback: (lock: object | null) => Promise<T>
	): Promise<T>;
};

const initialState: CloudSyncState = {
	authStatus: 'initializing',
	syncStatus: 'idle',
	user: null,
	backup: null,
	error: null
};

export const cloudSyncState = writable<CloudSyncState>(initialState);

let activeAuth: Auth | null = null;
let activeDb: Firestore | null = null;
let authUnsubscribe: Unsubscribe | null = null;
let storageListener: ((event: StorageEvent) => void) | null = null;
let coordinationChannel: BroadcastChannel | null = null;
let coordinationContextId = '';
let restoreReloadScheduled = false;
let startPromise: Promise<void> | null = null;
let operationPromise: Promise<void> | null = null;
let authEpoch = 0;
let generation = 0;
let observedAuthIdentity = '';

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
	return 'Cloud backup failed.';
}

function captureOperationContext(): OperationContext | null {
	const auth = activeAuth;
	const db = activeDb;
	const user = auth?.currentUser;
	if (!auth || !db || !user || user.isAnonymous) return null;
	return { auth, db, uid: user.uid, authEpoch, generation };
}

function isOperationCurrent(context: OperationContext): boolean {
	const user = context.auth.currentUser;
	return Boolean(
		user
		&& !user.isAnonymous
		&& user.uid === context.uid
		&& context.authEpoch === authEpoch
		&& context.generation === generation
		&& activeAuth === context.auth
		&& activeDb === context.db
	);
}

function wait(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function reloadForCloudRestore(): void {
	if (restoreReloadScheduled) return;
	restoreReloadScheduled = true;
	sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
	setTimeout(() => window.location.reload(), 0);
}

function announceCloudRestore(): void {
	const completedAt = Date.now().toString();
	try {
		localStorage.setItem(CLOUD_RESTORE_COMPLETE_KEY, completedAt);
	} catch (error) {
		console.warn('Cojudge Cloud could not write its restore notification:', error);
	}
	try {
		coordinationChannel?.postMessage({ type: 'restore', completedAt });
	} catch (error) {
		console.warn('Cojudge Cloud could not broadcast its restore notification:', error);
	}
	reloadForCloudRestore();
}

function startCoordination(): void {
	if (typeof BroadcastChannel !== 'undefined') {
		coordinationContextId = crypto.randomUUID();
		coordinationChannel = new BroadcastChannel('cojudge-cloud-backup');
		coordinationChannel.addEventListener('message', (event) => {
			const message = event.data;
			if (!message || message.from === coordinationContextId) return;
			if (message.type === 'probe') {
				coordinationChannel?.postMessage({
					type: 'probe-ack',
					requestId: message.requestId,
					from: coordinationContextId
				});
			} else if (message.type === 'restore') {
				reloadForCloudRestore();
			}
		});
	}

	storageListener = (event) => {
		if (event.key === CLOUD_RESTORE_LOCK_KEY && event.newValue) {
			sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
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
	coordinationContextId = '';
	restoreReloadScheduled = false;
}

async function ensureSingleWindow(): Promise<void> {
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
	if (peers.size > 0) throw new Error('Close other Cojudge windows before using cloud backup.');
}

async function withCloudOperationLock(
	context: OperationContext,
	action: () => Promise<void>
): Promise<void> {
	const lockManager = (navigator as Navigator & { locks?: LockManager }).locks;
	if (!lockManager) {
		throw new Error('This browser cannot safely run cloud backups. Update it and try again.');
	}
	await lockManager.request(
		CLOUD_OPERATION_WEB_LOCK,
		{ mode: 'exclusive', ifAvailable: true },
		async (lock) => {
			if (!lock) throw new Error('Another Cojudge window is using cloud backup. Try again shortly.');
			await ensureSingleWindow();
			if (isOperationCurrent(context)) await action();
		}
	);
}

function latestRef(db: Firestore, uid: string) {
	return doc(db, 'users', uid, 'cloud', 'latest');
}

function latestPartsRef(db: Firestore, uid: string) {
	return collection(db, 'users', uid, 'cloud', 'latest', 'parts');
}

function legacyPartsRef(db: Firestore, uid: string, snapshotId: string) {
	return collection(db, 'users', uid, 'snapshots', snapshotId, 'parts');
}

function integer(value: unknown, minimum: number, maximum: number, label: string): number {
	if (!Number.isSafeInteger(value) || (value as number) < minimum || (value as number) > maximum) {
		throw new Error(`Cloud backup has an invalid ${label}.`);
	}
	return value as number;
}

function timestampMillis(data: Record<string, unknown>): number {
	const value = data.updatedAt as { toMillis?: () => number } | undefined;
	const timestamp = value?.toMillis?.() ?? 0;
	if (!Number.isFinite(timestamp) || timestamp <= 0) {
		throw new Error('Cloud backup has no valid update time.');
	}
	return timestamp;
}

function parseRemoteMeta(data: Record<string, unknown>): RemoteBackupMeta {
	const checksum = typeof data.checksum === 'string' ? data.checksum : '';
	if (data.schemaVersion !== CLOUD_SNAPSHOT_VERSION || !/^[a-f0-9]{64}$/.test(checksum)) {
		throw new Error('Cloud backup metadata is invalid.');
	}
	const shared = {
		checksum,
		partCount: integer(data.partCount, 1, MAX_SNAPSHOT_PARTS, 'part count'),
		totalBytes: integer(data.totalBytes, 0, MAX_SNAPSHOT_BYTES, 'size'),
		updatedAt: timestampMillis(data)
	};
	if (data.mode === 'single') {
		return { ...shared, source: 'single', snapshotId: null };
	}

	const snapshotId = typeof data.snapshotId === 'string' ? data.snapshotId : '';
	if (!/^slot-[0-4]$/.test(snapshotId) && !/^[a-z0-9-]{8,100}$/i.test(snapshotId)) {
		throw new Error('Cloud backup metadata is invalid.');
	}
	return { ...shared, source: 'legacy', snapshotId };
}

async function readRemoteMeta(db: Firestore, uid: string): Promise<RemoteBackupMeta | null> {
	const result = await getDocFromServer(latestRef(db, uid));
	return result.exists() ? parseRemoteMeta(result.data()) : null;
}

function publishBackup(meta: RemoteBackupMeta | null): void {
	cloudSyncState.update((state) => ({
		...state,
		backup: meta ? { updatedAt: meta.updatedAt, totalBytes: meta.totalBytes } : null
	}));
}

async function readLocalBackup(): Promise<LocalBackup> {
	window.dispatchEvent(new Event(CLOUD_FLUSH_EVENT));
	const data = collectProgressData(localStorage, { cloud: true });
	const serialized = serializeProgressData(data);
	return { serialized, checksum: await hashProgress(serialized) };
}

async function uploadBackup(context: OperationContext): Promise<void> {
	const local = await readLocalBackup();
	if (!isOperationCurrent(context)) return;
	const { parts, totalBytes } = encodeProgressParts(local.serialized);
	if (totalBytes > MAX_SNAPSHOT_BYTES || parts.length > MAX_SNAPSHOT_PARTS) {
		throw new Error('This progress backup is too large for Cojudge Cloud.');
	}

	await runTransaction(context.db, async (transaction) => {
		const manifest = latestRef(context.db, context.uid);
		const current = await transaction.get(manifest);
		const currentData = current.exists() ? current.data() : null;
		const previousPartCount = currentData?.mode === 'single'
			? integer(currentData.partCount, 1, MAX_SNAPSHOT_PARTS, 'part count')
			: 0;

		for (let index = 0; index < Math.max(parts.length, previousPartCount); index++) {
			const part = doc(latestPartsRef(context.db, context.uid), index.toString().padStart(4, '0'));
			if (index < parts.length) transaction.set(part, { index, data: parts[index] });
			else transaction.delete(part);
		}
		transaction.set(manifest, {
			schemaVersion: CLOUD_SNAPSHOT_VERSION,
			mode: 'single',
			checksum: local.checksum,
			partCount: parts.length,
			totalBytes,
			updatedAt: serverTimestamp()
		});
	});
	if (!isOperationCurrent(context)) return;
	const confirmed = await readRemoteMeta(context.db, context.uid);
	if (!confirmed || confirmed.source !== 'single' || confirmed.checksum !== local.checksum) {
		throw new Error('Cojudge Cloud could not confirm the uploaded backup.');
	}
	publishBackup(confirmed);
}

async function downloadBackupData(
	db: Firestore,
	uid: string,
	meta: RemoteBackupMeta
): Promise<ProgressData> {
	const partsReference = meta.source === 'single'
		? latestPartsRef(db, uid)
		: legacyPartsRef(db, uid, meta.snapshotId!);
	const result = await getDocsFromServer(query(partsReference, orderBy('index')));
	if (result.size !== meta.partCount) throw new Error('Cloud backup is incomplete.');

	const parts = result.docs.map((part, index) => {
		const data = part.data();
		if (data.index !== index || typeof data.data !== 'string') {
			throw new Error('Cloud backup contains an invalid part.');
		}
		return data.data;
	});
	const serialized = decodeProgressParts(parts, meta.totalBytes);
	if ((await hashProgress(serialized)) !== meta.checksum) {
		throw new Error('Cloud backup failed its integrity check.');
	}
	const parsed = JSON.parse(serialized);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('Cloud backup has an invalid format.');
	}
	return parsed as ProgressData;
}

function sameRemoteBackup(left: RemoteBackupMeta | null, right: RemoteBackupMeta): boolean {
	return Boolean(
		left
		&& left.source === right.source
		&& left.snapshotId === right.snapshotId
		&& left.checksum === right.checksum
	);
}

async function applyDownloadedBackup(
	context: OperationContext,
	data: ProgressData,
	expectedLocal: LocalBackup
): Promise<void> {
	let applied = false;
	let announced = false;
	try {
		if (!isOperationCurrent(context)) return;
		const latestLocal = await readLocalBackup();
		if (!isOperationCurrent(context)) return;
		if (
			latestLocal.checksum !== expectedLocal.checksum
			|| latestLocal.serialized !== expectedLocal.serialized
		) {
			throw new Error('Local progress changed while downloading. Try again.');
		}

		localStorage.setItem(CLOUD_RESTORE_LOCK_KEY, Date.now().toString());
		sessionStorage.setItem(CLOUD_RESTORE_SESSION_KEY, '1');
		applyProgressData(data, { replace: true });
		applied = true;
		announceCloudRestore();
		announced = true;
	} catch (error) {
		if (applied) {
			announceCloudRestore();
			announced = true;
		}
		throw error;
	} finally {
		if (!announced) {
			sessionStorage.removeItem(CLOUD_RESTORE_SESSION_KEY);
			localStorage.removeItem(CLOUD_RESTORE_LOCK_KEY);
		}
	}
}

async function downloadBackup(context: OperationContext): Promise<void> {
	const local = await readLocalBackup();
	if (!isOperationCurrent(context)) return;
	const remote = await readRemoteMeta(context.db, context.uid);
	if (!remote) throw new Error('No Cojudge Cloud backup exists for this account yet.');
	publishBackup(remote);
	const data = await downloadBackupData(context.db, context.uid, remote);
	if (!isOperationCurrent(context)) return;
	const latest = await readRemoteMeta(context.db, context.uid);
	if (!sameRemoteBackup(latest, remote)) {
		throw new Error('The cloud backup changed while downloading. Try again.');
	}
	await applyDownloadedBackup(context, data, local);
}

function runOperation(
	status: Exclude<CloudOperationStatus, 'idle' | 'offline' | 'error'>,
	action: (context: OperationContext) => Promise<void>,
	requestedContext: OperationContext | null = captureOperationContext()
): Promise<void> {
	if (!requestedContext || !isOperationCurrent(requestedContext)) return Promise.resolve();
	if (operationPromise) {
		return operationPromise.catch(() => undefined).then(() => {
			if (!isOperationCurrent(requestedContext)) return;
			return runOperation(status, action, requestedContext);
		});
	}

	const pending = (async () => {
		cloudSyncState.update((state) => ({ ...state, syncStatus: status, error: null }));
		try {
			if (!navigator.onLine) throw new Error('Connect to the internet and try again.');
			await action(requestedContext);
			if (!isOperationCurrent(requestedContext)) return;
			cloudSyncState.update((state) => ({ ...state, syncStatus: 'idle', error: null }));
		} catch (error) {
			if (!isOperationCurrent(requestedContext)) return;
			cloudSyncState.update((state) => ({
				...state,
				syncStatus: navigator.onLine ? 'error' : 'offline',
				error: errorMessage(error)
			}));
			throw error;
		}
	})().finally(() => {
		if (operationPromise === pending) {
			operationPromise = null;
		}
	});
	operationPromise = pending;
	return pending;
}

export function refreshCloudBackup(): Promise<void> {
	return runOperation('checking', async (context) => {
		const remote = await readRemoteMeta(context.db, context.uid);
		if (isOperationCurrent(context)) publishBackup(remote);
	});
}

function contextForExpectedUser(expectedUid: string): OperationContext | null {
	const context = captureOperationContext();
	return context?.uid === expectedUid ? context : null;
}

export function uploadCloudBackup(expectedUid: string): Promise<void> {
	const context = contextForExpectedUser(expectedUid);
	if (!context) return Promise.reject(new Error('The signed-in account changed. Try again.'));
	return runOperation(
		'uploading',
		(current) => withCloudOperationLock(current, () => uploadBackup(current)),
		context
	);
}

export function downloadCloudBackup(expectedUid: string): Promise<void> {
	const context = contextForExpectedUser(expectedUid);
	if (!context) return Promise.reject(new Error('The signed-in account changed. Try again.'));
	return runOperation(
		'downloading',
		(current) => withCloudOperationLock(current, () => downloadBackup(current)),
		context
	);
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
			backup: null,
			error: null
		});
		return;
	}

	cloudSyncState.set({
		authStatus: 'signed-in',
		syncStatus: 'idle',
		user: userView(user),
		backup: null,
		error: null
	});
	void refreshCloudBackup().catch(() => undefined);
}

export function startCloudSync(): Promise<void> {
	if (!browser) return Promise.resolve();
	if (startPromise) return startPromise;
	initializeCloudRestoreContext();
	startCoordination();
	const currentGeneration = ++generation;
	cloudSyncState.update((state) => ({ ...state, authStatus: 'initializing', error: null }));

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
	stopCoordination();
	activeAuth = null;
	activeDb = null;
	startPromise = null;
	operationPromise = null;
	observedAuthIdentity = '';
	cloudSyncState.set(initialState);
}

export async function restartCloudSync(): Promise<void> {
	stopCloudSync();
	await startCloudSync();
}

export async function connectCloud(): Promise<void> {
	cloudSyncState.update((state) => ({ ...state, authStatus: 'signing-in', error: null }));
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

export async function disconnectCloud(): Promise<void> {
	await signOutFirebase();
}
