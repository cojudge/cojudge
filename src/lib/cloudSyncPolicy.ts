export const CLOUD_HISTORY_LIMIT = 5;

export type SyncIntent = 'fetch' | 'push';
export type SyncDirection = 'none' | 'pending-upload' | 'upload' | 'download' | 'conflict';

export type CloudOperationIdentity = {
	projectId: string;
	uid: string;
	authEpoch: number;
	generation: number;
};

export type LocalSyncCandidate = {
	checksum: string;
	meaningful: boolean;
	lastSyncedHash: string | null;
};

export type RemoteSyncCandidate = {
	checksum: string;
	meaningful: boolean;
	updatedAt: number;
};

export function needsSignOutDataChoice(
	local: Pick<LocalSyncCandidate, 'checksum' | 'meaningful'>,
	remote: Pick<RemoteSyncCandidate, 'checksum'> | null
): boolean {
	return remote ? local.checksum !== remote.checksum : local.meaningful;
}

export function needsCloudAccountConfirmation(
	workspaceId: string | null,
	accountId: string
): boolean {
	return workspaceId !== accountId;
}

export function resolveSyncDirection(
	local: LocalSyncCandidate,
	remote: RemoteSyncCandidate | null,
	intent: SyncIntent
): SyncDirection {
	if (!remote) {
		if (intent === 'push') return 'upload';
		return local.meaningful ? 'pending-upload' : 'none';
	}
	if (local.checksum === remote.checksum) return 'none';

	if (local.lastSyncedHash) {
		const localChanged = local.checksum !== local.lastSyncedHash;
		const remoteChanged = remote.checksum !== local.lastSyncedHash;
		if (!localChanged && remoteChanged) return 'download';
		if (localChanged && !remoteChanged) {
			return intent === 'push' ? 'upload' : 'pending-upload';
		}
		if (localChanged && remoteChanged) return 'conflict';
	}

	if (!local.meaningful) return 'download';
	if (!remote.meaningful) return intent === 'push' ? 'upload' : 'pending-upload';
	return 'conflict';
}

export function nextCloudSnapshotSlot(currentSnapshotId: string | null): string {
	const match = /^slot-([0-4])$/.exec(currentSnapshotId ?? '');
	const current = match ? Number(match[1]) : -1;
	return `slot-${(current + 1) % CLOUD_HISTORY_LIMIT}`;
}

export function isSameCloudOperation(
	requested: CloudOperationIdentity,
	current: CloudOperationIdentity
): boolean {
	return requested.projectId === current.projectId
		&& requested.uid === current.uid
		&& requested.authEpoch === current.authEpoch
		&& requested.generation === current.generation;
}
