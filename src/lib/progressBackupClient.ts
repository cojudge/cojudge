import { get } from 'svelte/store';
import codeStore from '$lib/stores/codeStore';
import fileStore, { fileSyncVersion } from '$lib/stores/fileStore';
import gameResultsStore from '$lib/stores/gameResultsStore';
import { execPaneHeightStore, leftPaneWidthStore } from '$lib/stores/layoutStore';
import { saveStatus } from '$lib/stores/saveStatus';
import testCaseStore from '$lib/stores/testCaseStore';
import userSettingsStorage, {
	defaultUserSettings,
	normalizeUserSettings
} from '$lib/stores/userSettingsStorage';
import userStore from '$lib/stores/userStore';
import { isProgressStorageKey, type ProgressData } from '$lib/progressBackup';
import {
	requireArrayRecord,
	requireFileRecord,
	requireProgressObject,
	requireStringRecord
} from '$lib/progressValidation';

type ApplyProgressOptions = {
	replace?: boolean;
	storage?: Storage;
};

const STORE_KEYS = new Set([
	'solutions',
	'user-checkboxes',
	'files',
	'user-settings',
	'game-results',
	'testcases',
	'pane-width',
	'exec-pane-height'
]);

function requireObject(data: ProgressData, key: string): Record<string, unknown> {
	return requireProgressObject(data, key);
}

function sanitizeUserCheckboxes(value: Record<string, unknown>): Record<string, boolean> {
	const result: Record<string, boolean> = {};
	for (const [key, checked] of Object.entries(value)) {
		result[key] = checked === true || checked === 'true';
	}
	return result;
}

function finiteNumber(data: ProgressData, key: string, fallback: number): number {
	if (!(key in data)) return fallback;
	const value = data[key];
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		throw new Error(`${key} must contain a number.`);
	}
	return value;
}

function storedValue(value: unknown, key: string): string {
	const serialized = typeof value === 'string' ? value : JSON.stringify(value);
	if (serialized === undefined) throw new Error(`${key} cannot be stored.`);
	return serialized;
}

export function applyProgressData(
	data: ProgressData,
	{ replace = false, storage = localStorage }: ApplyProgressOptions = {}
): void {
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		throw new Error('Progress data must contain an object.');
	}

	const incoming = new Map<string, string>();
	for (const [key, value] of Object.entries(data)) {
		if (!isProgressStorageKey(key, { cloud: replace })) continue;
		if (!STORE_KEYS.has(key)) incoming.set(key, storedValue(value, key));
	}
	const shouldApplyStore = (key: string) =>
		isProgressStorageKey(key, { cloud: replace }) && (replace || key in data);

	// Validate store-backed values before mutating localStorage.
	const solutions = 'solutions' in data ? requireStringRecord(data, 'solutions') : {};
	if ('user-checkboxes' in data) requireObject(data, 'user-checkboxes');
	const files = 'files' in data ? requireFileRecord(data) : {};
	if ('user-settings' in data) requireObject(data, 'user-settings');
	const gameResults = 'game-results' in data ? requireArrayRecord(data, 'game-results') : {};
	const testcases = 'testcases' in data ? requireArrayRecord(data, 'testcases') : {};
	finiteNumber(data, 'pane-width', 50);
	finiteNumber(data, 'exec-pane-height', 50);

	const affectedKeys = new Set(incoming.keys());
	for (const key of STORE_KEYS) {
		if (shouldApplyStore(key)) affectedKeys.add(key);
	}
	if (replace) {
		for (let index = 0; index < storage.length; index++) {
			const key = storage.key(index);
			if (key && isProgressStorageKey(key, { cloud: true })) affectedKeys.add(key);
		}
	}

	const previousStorage = new Map<string, string | null>();
	for (const key of affectedKeys) previousStorage.set(key, storage.getItem(key));
	const previousStores = {
		solutions: get(codeStore),
		checkboxes: get(userStore),
		files: get(fileStore),
		settings: get(userSettingsStorage),
		gameResults: get(gameResultsStore),
		testcases: get(testCaseStore),
		paneWidth: get(leftPaneWidthStore),
		execPaneHeight: get(execPaneHeightStore)
	};

	saveStatus.set('saving');
	try {
		if (replace) {
			for (const key of affectedKeys) {
				if (isProgressStorageKey(key, { cloud: true }) && !(key in data)) storage.removeItem(key);
			}
		}
		for (const [key, value] of incoming) storage.setItem(key, value);

		if (shouldApplyStore('solutions')) {
			codeStore.set(solutions);
		}
		if (shouldApplyStore('user-checkboxes')) {
			userStore.set(data['user-checkboxes'] ? sanitizeUserCheckboxes(requireObject(data, 'user-checkboxes')) : {});
		}
		if (shouldApplyStore('files')) {
			fileStore.set(files);
			fileSyncVersion.update((version) => version + 1);
		}
		if (shouldApplyStore('user-settings')) {
			userSettingsStorage.set(
				data['user-settings']
					? normalizeUserSettings(requireObject(data, 'user-settings'))
					: { ...defaultUserSettings }
			);
		}
		if (shouldApplyStore('game-results')) {
			gameResultsStore.set(gameResults as Record<string, never[]>);
		}
		if (shouldApplyStore('testcases')) {
			testCaseStore.set(testcases as Record<string, never[]>);
		}
		if (shouldApplyStore('pane-width')) {
			leftPaneWidthStore.set(finiteNumber(data, 'pane-width', 50));
		}
		if (shouldApplyStore('exec-pane-height')) {
			execPaneHeightStore.set(finiteNumber(data, 'exec-pane-height', 50));
		}
	} catch (error) {
		try {
			for (const key of affectedKeys) storage.removeItem(key);
			for (const [key, value] of previousStorage) {
				if (value !== null) storage.setItem(key, value);
			}
			codeStore.set(previousStores.solutions);
			userStore.set(previousStores.checkboxes);
			fileStore.set(previousStores.files);
			userSettingsStorage.set(previousStores.settings);
			gameResultsStore.set(previousStores.gameResults);
			testCaseStore.set(previousStores.testcases);
			leftPaneWidthStore.set(previousStores.paneWidth);
			execPaneHeightStore.set(previousStores.execPaneHeight);
		} catch (rollbackError) {
			console.error('Failed to restore local data after an import error:', rollbackError);
		}
		throw error;
	}

	setTimeout(() => saveStatus.set('saved'), 500);
}
