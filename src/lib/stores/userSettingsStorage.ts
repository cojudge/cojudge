import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ProgrammingLanguage } from '$lib/utils/util';

export interface UserSettings {
    preferredLanguage: ProgrammingLanguage;
}

const STORAGE_KEY = 'user-settings';

const defaultSettings: UserSettings = {
    preferredLanguage: 'java',
};

// Load initial settings from localStorage if available
const initialSettings: UserSettings = browser
    ? (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultSettings)
    : defaultSettings;

const userSettingsStorage = writable<UserSettings>(initialSettings);

// Persist changes to localStorage in the browser
if (browser) {
    userSettingsStorage.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default userSettingsStorage;
