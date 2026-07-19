import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

export function crossTabSync<T>(store: Writable<T>, storageKey: string, onSync?: () => void): () => void {
	if (!browser) return () => {};

	function handler(event: StorageEvent) {
		if (event.key === storageKey && event.newValue !== null) {
			try {
				const newValue = JSON.parse(event.newValue);
				store.set(newValue);
				onSync?.();
			} catch {
				// Ignore parse errors from other sources
			}
		}
	}

	window.addEventListener('storage', handler);
	return () => window.removeEventListener('storage', handler);
}
