import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { writeProgressStorageItem } from '$lib/progressBackup';
import { DEFAULT_MCP_SETTINGS, type McpSettings } from './types';

const STORAGE_KEY = 'mcp-server-settings';

function normalizeSettings(input: any): McpSettings {
    const permissions = input?.permissions ?? {};
    return {
        running: typeof input?.running === 'boolean' ? input.running : DEFAULT_MCP_SETTINGS.running,
        permissions: {
            read: typeof permissions.read === 'boolean' ? permissions.read : DEFAULT_MCP_SETTINGS.permissions.read,
            write: typeof permissions.write === 'boolean' ? permissions.write : DEFAULT_MCP_SETTINGS.permissions.write,
            create: typeof permissions.create === 'boolean' ? permissions.create : DEFAULT_MCP_SETTINGS.permissions.create,
            delete: typeof permissions.delete === 'boolean' ? permissions.delete : DEFAULT_MCP_SETTINGS.permissions.delete,
            includeHidden: typeof permissions.includeHidden === 'boolean'
                ? permissions.includeHidden
                : DEFAULT_MCP_SETTINGS.permissions.includeHidden
        }
    };
}

const initialSettings: McpSettings = browser
    ? normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    : DEFAULT_MCP_SETTINGS;

/** Persisted client-side MCP server configuration. */
export const mcpSettings = writable<McpSettings>(initialSettings);

if (browser) {
    mcpSettings.subscribe((value) => {
        writeProgressStorageItem(localStorage, STORAGE_KEY, JSON.stringify(value));
    });
}
