import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const LEFT_PANEL_WIDTH_STORAGE_KEY = 'pane-width';
const defaultLeftPanelWidth = 50;
const initialLeftPanelWidth = browser ? (JSON.parse(localStorage.getItem(LEFT_PANEL_WIDTH_STORAGE_KEY))) : defaultLeftPanelWidth;
export const leftPaneWidthStore = writable<number>(initialLeftPanelWidth);

const EXEC_PANEL_HEIGHT_STORAGE_KEY = 'exec-pane-height';
const defaultExecPanelHeight = 50;
const initialExecPanelHeight = browser ? (JSON.parse(localStorage.getItem(EXEC_PANEL_HEIGHT_STORAGE_KEY)) || defaultExecPanelHeight) : defaultExecPanelHeight;
export const execPaneHeightStore = writable<number>(initialExecPanelHeight);

if (browser) {
    leftPaneWidthStore.subscribe((value) => {
        localStorage.setItem(LEFT_PANEL_WIDTH_STORAGE_KEY, JSON.stringify(value));
    });

    execPaneHeightStore.subscribe((value) => {
        localStorage.setItem(EXEC_PANEL_HEIGHT_STORAGE_KEY, JSON.stringify(value));
    });
}