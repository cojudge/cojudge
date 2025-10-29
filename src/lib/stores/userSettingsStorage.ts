import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ProgrammingLanguage } from '$lib/utils/util';

export interface UserSettings {
    preferredLanguage: ProgrammingLanguage;
    editorFontSize: number;
}

const STORAGE_KEY = 'user-settings';

const defaultSettings: UserSettings = {
    preferredLanguage: 'java',
    editorFontSize: 14,
};

function normalizeSettings(input: any): UserSettings {
    const preferredLanguage = (input?.preferredLanguage ?? defaultSettings.preferredLanguage) as ProgrammingLanguage;
    const rawSize = input?.editorFontSize;
    const size = typeof rawSize === 'number' ? rawSize : defaultSettings.editorFontSize;
    const editorFontSize = Math.min(24, Math.max(12, size));
    return { preferredLanguage, editorFontSize };
}

// Load initial settings from localStorage if available
const initialSettings: UserSettings = browser
    ? normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    : defaultSettings;

const userSettingsStorage = writable<UserSettings>(initialSettings);

// Persist changes to localStorage in the browser
if (browser) {
    userSettingsStorage.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default userSettingsStorage;
