import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

const applyingStorageKeys = new Set<string>();

// Svelte store subscriptions run synchronously. Receiving shared state must not
// persist it again: a queued storage event may contain an older snapshot.
export function isApplyingCrossTabSync(storageKey: string): boolean {
	return applyingStorageKeys.has(storageKey);
}

export function crossTabSync<T>(store: Writable<T>, storageKey: string, onSync?: () => void): () => void {
	if (!browser) return () => {};

	function handler(event: StorageEvent) {
		if (event.storageArea === window.localStorage && event.key === storageKey && event.newValue !== null) {
			try {
				// Another window (or this one) may have saved again while this event
				// was queued. Never roll the store back to that superseded snapshot.
				if (window.localStorage.getItem(storageKey) !== event.newValue) return;
				const newValue = JSON.parse(event.newValue);
				applyingStorageKeys.add(storageKey);
				try {
					store.set(newValue);
				} finally {
					applyingStorageKeys.delete(storageKey);
				}
				onSync?.();
			} catch {
				// Ignore parse errors from other sources
			}
		}
	}

	window.addEventListener('storage', handler);
	return () => window.removeEventListener('storage', handler);
}
