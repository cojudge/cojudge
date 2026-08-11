import { describe, expect, it } from 'vitest';
import {
	isSameCloudOperation,
	needsCloudAccountConfirmation,
	needsSignOutDataChoice,
	nextCloudSnapshotSlot,
	resolveSyncDirection,
	type LocalSyncCandidate
} from './cloudSyncPolicy';

const local: LocalSyncCandidate = {
	checksum: 'local',
	meaningful: true,
	lastSyncedHash: 'previous'
};

describe('cloud sync direction', () => {
	it('uploads the first snapshot and skips matching snapshots', () => {
		expect(resolveSyncDirection(local, null, 'fetch')).toBe('pending-upload');
		expect(resolveSyncDirection(local, null, 'push')).toBe('upload');
		expect(
			resolveSyncDirection(
				local,
				{ checksum: 'local', meaningful: true, updatedAt: 300 },
				'fetch'
			)
		).toBe('none');
	});

	it('restores meaningful cloud data onto an empty device', () => {
		expect(
			resolveSyncDirection(
				{ ...local, meaningful: false, lastSyncedHash: null },
				{ checksum: 'remote', meaningful: true, updatedAt: 100 },
				'fetch'
			)
		).toBe('download');
	});

	it('uses the only changed side when there is a common base', () => {
		expect(
			resolveSyncDirection(
				{ ...local, checksum: 'previous' },
				{ checksum: 'remote', meaningful: true, updatedAt: 300 },
				'fetch'
			)
		).toBe('download');
		expect(
			resolveSyncDirection(
				local,
				{
					checksum: 'previous',
					meaningful: true,
					updatedAt: 300
				},
				'fetch'
			)
		).toBe('pending-upload');
		expect(
			resolveSyncDirection(
				local,
				{
					checksum: 'previous',
					meaningful: true,
					updatedAt: 300
				},
				'push'
			)
		).toBe('upload');
	});

	it('requires a choice when both sides changed', () => {
		expect(
			resolveSyncDirection(
				local,
				{ checksum: 'remote', meaningful: true, updatedAt: 300 },
				'push'
			)
		).toBe('conflict');
	});

	it('propagates an intentional deletion from either side', () => {
		expect(
			resolveSyncDirection(
				{ ...local, checksum: 'empty', meaningful: false },
				{ checksum: 'previous', meaningful: true, updatedAt: 100 },
				'fetch'
			)
		).toBe('pending-upload');
		expect(
			resolveSyncDirection(
				{ ...local, checksum: 'empty', meaningful: false },
				{ checksum: 'previous', meaningful: true, updatedAt: 100 },
				'push'
			)
		).toBe('upload');
		expect(
			resolveSyncDirection(
				{ ...local, checksum: 'previous' },
				{ checksum: 'empty', meaningful: false, updatedAt: 300 },
				'fetch'
			)
		).toBe('download');
	});
});

describe('cloud snapshot slots', () => {
	it('cycles through a bounded five-revision history', () => {
		let slot: string | null = null;
		const revisions: string[] = [];
		for (let index = 0; index < 7; index++) {
			slot = nextCloudSnapshotSlot(slot);
			revisions.push(slot);
		}
		expect(revisions).toEqual([
			'slot-0',
			'slot-1',
			'slot-2',
			'slot-3',
			'slot-4',
			'slot-0',
			'slot-1'
		]);
		expect(nextCloudSnapshotSlot('legacy-snapshot')).toBe('slot-0');
	});
});

describe('cloud operation identity', () => {
	it('invalidates queued work after account, auth epoch, or lifecycle changes', () => {
		const operation = { projectId: 'project-a', uid: 'user-a', authEpoch: 3, generation: 7 };
		expect(isSameCloudOperation(operation, operation)).toBe(true);
		expect(isSameCloudOperation(operation, { ...operation, projectId: 'project-b' })).toBe(false);
		expect(isSameCloudOperation(operation, { ...operation, uid: 'user-b' })).toBe(false);
		expect(isSameCloudOperation(operation, { ...operation, authEpoch: 4 })).toBe(false);
		expect(isSameCloudOperation(operation, { ...operation, generation: 8 })).toBe(false);
	});
});

describe('cloud account attachment', () => {
	it('asks before attaching existing local work or switching accounts', () => {
		expect(needsCloudAccountConfirmation(null, 'user-a')).toBe(true);
		expect(needsCloudAccountConfirmation('user-a', 'user-a')).toBe(false);
		expect(needsCloudAccountConfirmation('user-a', 'user-b')).toBe(true);
	});
});

describe('cloud sign-out cleanup', () => {
	it('only asks when local data does not match the latest cloud snapshot', () => {
		expect(needsSignOutDataChoice(local, { checksum: 'local' })).toBe(false);
		expect(needsSignOutDataChoice(local, { checksum: 'remote' })).toBe(true);
		expect(needsSignOutDataChoice(local, null)).toBe(true);
		expect(needsSignOutDataChoice({ ...local, meaningful: false }, null)).toBe(false);
	});
});
