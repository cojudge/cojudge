import { browser } from '$app/environment';
import type { ProgrammingLanguage } from '$lib/utils/util';
import { writable } from 'svelte/store';
import { writeProgressStorageItem } from '$lib/progressBackup';

export type ThemeChoice = 'dark' | 'light';

export type ActivePanel = 'explorer' | 'search' | null;

export interface UserSettings {
    preferredLanguage: ProgrammingLanguage;
    playgroundPreferredLanguage: ProgrammingLanguage;
    editorFontSize: number;
    theme: ThemeChoice;
    vimMode: 'off' | 'on';
    isSidebarOpen: boolean;
    activePanel: ActivePanel;
}

const STORAGE_KEY = 'user-settings';

export const defaultUserSettings: UserSettings = {
    preferredLanguage: 'java',
    playgroundPreferredLanguage: 'java',
    editorFontSize: 14,
    theme: 'light',
    vimMode: 'off',
    isSidebarOpen: true,
    activePanel: 'explorer',
};

export function normalizeUserSettings(input: any): UserSettings {
    const preferredLanguage = (input?.preferredLanguage ?? defaultUserSettings.preferredLanguage) as ProgrammingLanguage;
    const playgroundPreferredLanguage = (input?.playgroundPreferredLanguage ?? defaultUserSettings.playgroundPreferredLanguage) as ProgrammingLanguage;
    const rawSize = input?.editorFontSize;
    const size = typeof rawSize === 'number' ? rawSize : defaultUserSettings.editorFontSize;
    const editorFontSize = Math.min(24, Math.max(12, size));
    const rawTheme = (input?.theme ?? defaultUserSettings.theme) as ThemeChoice;
    const theme: ThemeChoice = rawTheme === 'dark' ? 'dark' : 'light';
    const vimMode = input?.vimMode === 'on' ? 'on' : 'off';
    const isSidebarOpen = typeof input?.isSidebarOpen === 'boolean' ? input.isSidebarOpen : defaultUserSettings.isSidebarOpen;
    const validPanels: ActivePanel[] = ['explorer', 'search', null];
    const activePanel = validPanels.includes(input?.activePanel as ActivePanel) ? input.activePanel as ActivePanel : defaultUserSettings.activePanel;
    return { preferredLanguage, playgroundPreferredLanguage, editorFontSize, theme, vimMode, isSidebarOpen, activePanel };
}

// Load initial settings from localStorage if available
const initialSettings: UserSettings = browser
    ? normalizeUserSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    : defaultUserSettings;

const userSettingsStorage = writable<UserSettings>(initialSettings);

function applyTheme(theme: ThemeChoice) {
    const root = document.documentElement;
    root.dataset.theme = theme;
}

// Persist changes to localStorage in the browser
if (browser) {
    applyTheme(initialSettings.theme);
    userSettingsStorage.subscribe((value) => {
        if (!writeProgressStorageItem(localStorage, STORAGE_KEY, JSON.stringify(value))) return;
        applyTheme(value.theme);
    });
}

export default userSettingsStorage;
