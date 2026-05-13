import { writable } from 'svelte/store';

export type SaveStatus = 'idle' | 'saving' | 'saved';

export const saveStatus = writable<SaveStatus>('idle');

let timeout: any;

export function triggerSave() {
    saveStatus.set('saving');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        saveStatus.set('saved');
    }, 500);
}
