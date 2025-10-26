import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// The key we'll use to save the checkbox data in localStorage
const STORAGE_KEY = 'user-checkboxes';

// Default is an empty object mapping problem IDs to boolean checked state
const defaultValue: Record<string, boolean> = {};

// Load initial value from localStorage when running in the browser
// and sanitize values to strict booleans to avoid truthy strings like "false"
function loadInitial(): Record<string, boolean> {
    if (!browser) return defaultValue;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultValue;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return defaultValue;

        const sanitized: Record<string, boolean> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            // Only treat a value as checked when it is strictly true or the string 'true'
            sanitized[k] = v === true || v === 'true';
        }
        return sanitized;
    } catch {
        return defaultValue;
    }
}

const initialValue = loadInitial();

const userStore = writable<Record<string, boolean>>(initialValue);

if (browser) {
    userStore.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default userStore;
