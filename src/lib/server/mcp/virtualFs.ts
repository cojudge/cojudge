import type { McpFileEntry } from '$lib/mcp/types';

/** Children grouped by parentId (null = root). */
export type FileTree = Map<string | null, McpFileEntry[]>;

export function isDotFileName(fileName: string): boolean {
    return fileName.startsWith('.') && fileName !== '.' && fileName !== '..';
}

export function buildTree(entries: McpFileEntry[]): FileTree {
    const tree: FileTree = new Map();
    for (const entry of entries) {
        const parent = entry.parentId ?? null;
        const siblings = tree.get(parent) ?? [];
        siblings.push(entry);
        tree.set(parent, siblings);
    }
    for (const siblings of tree.values()) {
        siblings.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.fileName.localeCompare(b.fileName));
    }
    return tree;
}

/**
 * Resolve a path like `notes/todo.md` (or `/notes/todo.md`) against the tree.
 * The final segment may be a file or a folder.
 */
export function resolvePath(tree: FileTree, rawPath: string): McpFileEntry | null {
    const segments = normalizeSegments(rawPath);
    if (segments.length === 0) return null;
    let level = tree.get(null) ?? [];
    let current: McpFileEntry | null = null;
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        current = level.find((entry) => entry.fileName === segment) ?? null;
        if (!current) return null;
        if (i < segments.length - 1) {
            level = tree.get(current.fileId) ?? [];
        }
    }
    return current;
}

/** Split a path into segments, rejecting dangerous or empty ones. */
export function normalizeSegments(rawPath: string): string[] {
    const cleaned = String(rawPath ?? '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
    if (!cleaned || cleaned === '.') return [];
    const segments = cleaned.split('/');
    if (segments.some((s) => !s || s === '.' || s === '..')) {
        throw new Error(`Invalid path "${rawPath}"`);
    }
    return segments;
}

/** Children of the folder at `path` (or all root entries when path is empty). */
export function childrenOf(tree: FileTree, path: string | null | undefined): McpFileEntry[] {
    if (!path) return tree.get(null) ?? [];
    const entry = resolvePath(tree, path);
    if (!entry) return [];
    if (entry.type === 'folder') return tree.get(entry.fileId) ?? [];
    return [];
}

/** Human-readable path for an entry, computed by walking up parents. */
export function pathOf(entries: McpFileEntry[], entry: McpFileEntry): string {
    const byId = new Map(entries.map((e) => [e.fileId, e]));
    const parts: string[] = [];
    let current: McpFileEntry | undefined = entry;
    let guard = 0;
    while (current && guard++ < 64) {
        parts.unshift(current.fileName);
        if (!current.parentId) break;
        current = byId.get(current.parentId);
    }
    return parts.join('/');
}

/** Whether `fileId` is `folderId` itself or lives anywhere beneath it. */
export function isSelfOrDescendant(entries: McpFileEntry[], fileId: string, folderId: string): boolean {
    if (fileId === folderId) return true;
    const byId = new Map(entries.map((e) => [e.fileId, e]));
    let current = byId.get(fileId);
    let guard = 0;
    while (current && guard++ < 64) {
        if (!current.parentId) return false;
        if (current.parentId === folderId) return true;
        current = byId.get(current.parentId);
    }
    return false;
}

const EXTENSION_LANGUAGES: Record<string, string> = {
    java: 'java',
    py: 'python',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    h: 'cpp',
    hpp: 'cpp',
    cs: 'csharp',
    rs: 'rust',
    go: 'go',
    ts: 'typescript',
    tsx: 'typescript',
    js: 'typescript',
    mjs: 'typescript',
    cjs: 'typescript',
    md: 'markdown',
    markdown: 'markdown',
    txt: 'plaintext',
    json: 'plaintext',
    yml: 'plaintext',
    yaml: 'plaintext',
    csv: 'plaintext',
    html: 'plaintext',
    css: 'plaintext',
    xml: 'plaintext',
    ini: 'plaintext',
    cfg: 'plaintext',
    env: 'plaintext'
};

export function languageFromFileName(fileName: string): string {
    const dot = fileName.lastIndexOf('.');
    if (dot < 0 || dot === fileName.length - 1) return 'plaintext';
    const ext = fileName.slice(dot + 1).toLowerCase();
    return EXTENSION_LANGUAGES[ext] ?? 'plaintext';
}
