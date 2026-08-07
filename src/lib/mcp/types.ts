// Shared types for the Cojudge MCP server (used by both client and server code).

export type McpPermission = 'read' | 'write' | 'create' | 'delete';

export type McpPermissions = {
    read: boolean;
    write: boolean;
    create: boolean;
    delete: boolean;
    /** Whether agents may access hidden files (names starting with `.`). */
    includeHidden: boolean;
};

export const DEFAULT_MCP_PERMISSIONS: McpPermissions = {
    read: true,
    write: true,
    create: true,
    delete: false,
    includeHidden: false
};

/** Slim view of a playground file exposed to MCP agents. */
export type McpFileEntry = {
    fileId: string;
    fileName: string;
    content: string;
    language: string;
    parentId: string | null;
    type?: 'editor' | 'folder';
    order?: number;
    /** Last write time in ms since epoch; used for last-writer-wins merges. */
    lastUpdated: number;
};

/** One tab currently open in the playground, as seen by MCP agents. */
export type McpTabEntry = {
    fileId: string;
    fileName: string;
    type: 'editor' | 'preview' | 'whiteboard';
    /** Note id a preview tab renders (resolved to its path by the tool layer). */
    sourceFileId: string | null;
    lastUpdated: number;
};

/** Client push payload for /api/mcp/tabs. */
export type McpTabState = {
    /** fileId of the active tab (preview tabs resolve to their source note). */
    activeTabId: string | null;
    openTabs: McpTabEntry[];
};

/** Client push payload for /api/mcp/files. */
export type McpFilePush = {
    entries: McpFileEntry[];
    tombstones: { fileId: string; time: number }[];
    /**
     * Data URLs for pasted images referenced by playground markdown files,
     * keyed by their fake link (e.g. `cojudge://image/<id>`). Immutable once
     * pushed; used by the read_image tool.
     */
    images?: Record<string, string>;
};

/** Server snapshot payload for the client (GET /api/mcp/files). */
export type McpFileSnapshot = {
    revision: number;
    entries: McpFileEntry[];
    tombstones: { fileId: string; time: number }[];
};

/** Full state returned by GET /api/mcp/state. */
export type McpServerState = {
    running: boolean;
    permissions: McpPermissions;
    revision: number;
    fileCount: number;
};

/** Actions accepted by POST /api/mcp/state. */
export type McpStateAction =
    | { action: 'start' }
    | { action: 'stop' }
    | { action: 'restart' }
    | { action: 'setPermissions'; permissions: McpPermissions };

/** Persisted client-side MCP settings (localStorage). */
export type McpSettings = {
    running: boolean;
    permissions: McpPermissions;
};

export const DEFAULT_MCP_SETTINGS: McpSettings = {
    running: false,
    permissions: DEFAULT_MCP_PERMISSIONS
};
