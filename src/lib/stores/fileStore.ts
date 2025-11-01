import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// The key we'll use to save the data in localStorage
const STORAGE_KEY = 'files';

// Each value is a JSON string representing an array of FileEntry objects
export type FileEntry = {
    fileName: string;
    content: string;
    language: string;
    isActive: boolean;
    fileId: string; // uuid
    order?: number;
};

// Dictionary: key = problem slug, value = JSON string of FileEntry[]
export type FileStoreShape = Record<string, string>;

// The default value is an empty object
const defaultValue: FileStoreShape = {};

// Load the saved object from localStorage, or use the default
const initialValue: FileStoreShape = browser
    ? (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultValue)
    : defaultValue;

// Create a writable store mapping problem slugs to a JSON string of FileEntry[]
const fileStore = writable<FileStoreShape>(initialValue);

// Subscribe to changes and save the entire object back to localStorage
if (browser) {
    fileStore.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default fileStore;
