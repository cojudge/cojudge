import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ProgrammingLanguage } from '$lib/utils/util';

export type ThemeChoice = 'dark' | 'light';

export interface UserSettings {
    preferredLanguage: ProgrammingLanguage;
    editorFontSize: number;
    theme: ThemeChoice;
}

const STORAGE_KEY = 'user-settings';

const defaultSettings: UserSettings = {
    preferredLanguage: 'java',
    editorFontSize: 14,
    theme: 'light',
};

function normalizeSettings(input: any): UserSettings {
    const preferredLanguage = (input?.preferredLanguage ?? defaultSettings.preferredLanguage) as ProgrammingLanguage;
    const rawSize = input?.editorFontSize;
    const size = typeof rawSize === 'number' ? rawSize : defaultSettings.editorFontSize;
    const editorFontSize = Math.min(24, Math.max(12, size));
    const rawTheme = (input?.theme ?? defaultSettings.theme) as ThemeChoice;
    const theme: ThemeChoice = rawTheme === 'dark' ? 'dark' : 'light';
    return { preferredLanguage, editorFontSize, theme };
}

// Load initial settings from localStorage if available
const initialSettings: UserSettings = browser
    ? normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    : defaultSettings;

const userSettingsStorage = writable<UserSettings>(initialSettings);

function applyTheme(theme: ThemeChoice) {
    const root = document.documentElement;
    root.dataset.theme = theme;
}

// Persist changes to localStorage in the browser
if (browser) {
    applyTheme(initialSettings.theme);
    userSettingsStorage.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        applyTheme(value.theme);
    });
}

export default userSettingsStorage;
