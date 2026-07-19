import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { saveStatus } from './saveStatus';
import { crossTabSync } from './crossTabSync';

// The key we'll use to save the data in localStorage
const STORAGE_KEY = 'files';

// Each value is a JSON string representing an array of FileEntry objects
export type FileEntry = {
    fileName: string;
    content: string;
    language: string;
    lastLanguage?: string;
    isActive: boolean;
    fileId: string; // uuid
    order?: number;
    output?: string;
    logs?: string;
    lastUpdated?: number;
    shareId?: string;
    lastSharedContent?: string;
    isOpen?: boolean;
    viewState?: string | null;
    type?: 'editor' | 'preview';
    sourceFileId?: string;
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

// Counter that increments when another tab changes the file store;
// pages watch this to know when to reload code from the store.
export const fileSyncVersion = writable(0);

// Subscribe to changes and save the entire object back to localStorage
let saveTimeout: any;
if (browser) {
    fileStore.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        
        saveStatus.set('saving');
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatus.set('saved');
        }, 500);
    });

    crossTabSync(fileStore, STORAGE_KEY, () => {
        fileSyncVersion.update((v) => v + 1);
    });
}

export default fileStore;
