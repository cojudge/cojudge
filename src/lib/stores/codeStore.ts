import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// The key we'll use to save the data in localStorage
const STORAGE_KEY = 'solutions';

// The default value is an empty object
const defaultValue = {};

// Load the saved object from localStorage, or use the default
const initialValue = browser
    ? (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultValue)
    : defaultValue;

// Create a writable store that holds an object mapping problem IDs to code strings
const codeStore = writable<Record<string, string>>(initialValue);

// Subscribe to changes and save the entire object back to localStorage
if (browser) {
    codeStore.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default codeStore;