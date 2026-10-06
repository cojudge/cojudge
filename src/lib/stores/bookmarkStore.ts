import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { writeProgressStorageItem } from '$lib/progressBackup';
import { crossTabSync, isApplyingCrossTabSync } from './crossTabSync';

export const BOOKMARK_STORAGE_KEY = 'user-bookmarks';

// Maps problem IDs to bookmarked state. Only truthy entries are kept;
// unbookmarking removes the key to keep the payload small.
export type Bookmarks = Record<string, boolean>;

const defaultValue: Bookmarks = {};

function loadInitial(): Bookmarks {
	if (!browser) return defaultValue;

	try {
		const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
		if (!raw) return defaultValue;

		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaultValue;

		const sanitized: Bookmarks = {};
		for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
			if (v === true || v === 'true') sanitized[k] = true;
		}
		return sanitized;
	} catch {
		return defaultValue;
	}
}

const initialValue = loadInitial();

const bookmarkStore = writable<Bookmarks>(initialValue);

if (browser) {
	bookmarkStore.subscribe((value) => {
		if (isApplyingCrossTabSync(BOOKMARK_STORAGE_KEY)) return;
		writeProgressStorageItem(localStorage, BOOKMARK_STORAGE_KEY, JSON.stringify(value));
	});

	crossTabSync(bookmarkStore, BOOKMARK_STORAGE_KEY);
}

export function toggleBookmarkId(current: Bookmarks, problemId: string): Bookmarks {
	const next = { ...current };
	if (next[problemId]) delete next[problemId];
	else next[problemId] = true;
	return next;
}

export default bookmarkStore;
