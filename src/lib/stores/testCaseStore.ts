import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { writeProgressStorageItem } from '$lib/progressBackup';

// Key for localStorage
const STORAGE_KEY = 'testcases';

const defaultValue: Record<string, any[]> = {};
const initialValue = browser ? (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultValue) : defaultValue;

const testCaseStore = writable<Record<string, any[]>>(initialValue);

if (browser) {
    testCaseStore.subscribe((value) => {
        writeProgressStorageItem(localStorage, STORAGE_KEY, JSON.stringify(value));
    });
}

export default testCaseStore;
