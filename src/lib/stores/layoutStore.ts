import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const LEFT_PANEL_WIDTH_STORAGE_KEY = 'pane-width';
const defaultLeftPanelWidth = 50;
function storedNumber(key: string, fallback: number): number {
    if (!browser) return fallback;
    try {
        const value = JSON.parse(localStorage.getItem(key) || 'null');
        return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

const initialLeftPanelWidth = storedNumber(LEFT_PANEL_WIDTH_STORAGE_KEY, defaultLeftPanelWidth);
export const leftPaneWidthStore = writable<number>(initialLeftPanelWidth);

const EXEC_PANEL_HEIGHT_STORAGE_KEY = 'exec-pane-height';
const defaultExecPanelHeight = 50;
const initialExecPanelHeight = storedNumber(EXEC_PANEL_HEIGHT_STORAGE_KEY, defaultExecPanelHeight);
export const execPaneHeightStore = writable<number>(initialExecPanelHeight);

if (browser) {
    leftPaneWidthStore.subscribe((value) => {
        localStorage.setItem(LEFT_PANEL_WIDTH_STORAGE_KEY, JSON.stringify(value));
    });

    execPaneHeightStore.subscribe((value) => {
        localStorage.setItem(EXEC_PANEL_HEIGHT_STORAGE_KEY, JSON.stringify(value));
    });
}
