import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import type { ImageContent } from '@modelcontextprotocol/sdk/types.js';
import type { McpFileEntry, McpPermissions } from '$lib/mcp/types';
import { pastedImageLink } from '$lib/utils/imageStore';
import type { McpManager } from './manager';
import {
    buildTree,
    childrenOf,
    isDotFileName,
    isSelfOrDescendant,
    languageFromFileName,
    normalizeSegments,
    pathOf,
    resolvePath
} from './virtualFs';

type ToolResult = { content: [{ type: 'text'; text: string }] };

const SEARCH_RESULT_LIMIT = 50;
const SNIPPET_LENGTH = 160;

function text(text: string): ToolResult {
    return { content: [{ type: 'text', text }] };
}

function jsonText(value: unknown): ToolResult {
    return text(JSON.stringify(value, null, 2));
}

function requirePermission(permissions: McpPermissions, name: 'read' | 'write' | 'create' | 'delete'): void {
    if (!permissions[name]) {
        throw new McpError(
            ErrorCode.InvalidRequest,
            `Permission denied: ${name.toUpperCase()} is turned off for this MCP server. Enable it in the MCP Server settings popup.`
        );
    }
}

function assertVisible(entry: McpFileEntry, permissions: McpPermissions): void {
    if (!permissions.includeHidden && isDotFileName(entry.fileName)) {
        throw new McpError(
            ErrorCode.InvalidRequest,
            `Hidden file "${entry.fileName}" is not accessible while "include hidden files" is off.`
        );
    }
}

function visibleEntry(entry: McpFileEntry | null, permissions: McpPermissions): McpFileEntry | null {
    if (!entry) return null;
    assertVisible(entry, permissions);
    return entry;
}

/** Resolve a path, enforcing hidden-file visibility on every matched segment. */
function resolveVisiblePath(manager: McpManager, rawPath: string): McpFileEntry | null {
    const permissions = manager.getPermissions();
    const segments = normalizeSegments(rawPath);
    if (segments.length === 0) return null;
    const entries = manager.listFiles();
    const byId = new Map(entries.map((e) => [e.fileId, e]));
    let level = entries.filter((e) => e.parentId == null);
    let current: McpFileEntry | null = null;
    for (let i = 0; i < segments.length; i++) {
        current = level.find((entry) => entry.fileName === segments[i]) ?? null;
        if (!current) return null;
        assertVisible(current, permissions);
        if (i < segments.length - 1) {
            level = entries.filter((e) => e.parentId === current!.fileId);
        }
    }
    return current;
}

function parentFolder(manager: McpManager, rawPath: string): McpFileEntry | null {
    const segments = normalizeSegments(rawPath);
    if (segments.length <= 1) return null;
    const parentPath = segments.slice(0, -1).join('/');
    return resolveVisiblePath(manager, parentPath);
}

/** Auto-create missing parent folders for a new file path. */
function ensureParentFolders(manager: McpManager, rawPath: string): void {
    const segments = normalizeSegments(rawPath);
    if (segments.length <= 1) return;
    const entries = manager.listFiles();
    const byId = new Map(entries.map((e) => [e.fileId, e]));
    let parentId: string | null = null;
    for (let i = 0; i < segments.length - 1; i++) {
        const name = segments[i];
        const siblings = entries.filter((e) => e.parentId === parentId);
        let folder = siblings.find((e) => e.fileName === name);
        if (!folder) {
            folder = {
                fileId: uuidv4(),
                fileName: name,
                content: '',
                language: 'plaintext',
                parentId,
                type: 'folder',
                lastUpdated: Date.now()
            };
            manager.applyAgentWrite(folder);
        }
        parentId = folder.fileId;
    }
}

function findParentFolder(manager: McpManager, rawPath: string): string | null {
    const parent = parentFolder(manager, rawPath);
    if (!parent) return null;
    if (parent.type !== 'folder') {
        throw new McpError(ErrorCode.InvalidRequest, `"${parent.fileName}" is not a folder.`);
    }
    return parent.fileId;
}

function entrySummary(manager: McpManager, entry: McpFileEntry, withSize = false): Record<string, unknown> {
    const summary: Record<string, unknown> = {
        path: pathOf(manager.listFiles(), entry),
        name: entry.fileName,
        type: entry.type === 'folder' ? 'folder' : 'file',
        language: entry.type === 'folder' ? undefined : entry.language,
        lastUpdated: entry.lastUpdated
    };
    if (withSize && entry.type !== 'folder') {
        summary.size = entry.content.length;
    }
    return summary;
}

export function registerTools(server: McpServer, manager: McpManager): void {
    const permissions = () => manager.getPermissions();

    server.registerTool(
        'list_files',
        {
            title: 'List files',
            description:
                'List the files and folders in the Cojudge playground. Use this to discover what is available before reading or editing. Pass a folder path to list its contents; pass a file path to get that file alone. Hidden files (starting with ".") are only shown when "include hidden files" is enabled.',
            inputSchema: z.object({
                path: z
                    .string()
                    .optional()
                    .describe('Optional folder or file path. Defaults to the playground root.')
            })
        },
        async ({ path }) => {
            requirePermission(permissions(), 'read');
            const perms = permissions();
            if (path) {
                const entry = visibleEntry(resolveVisiblePath(manager, path), perms);
                if (!entry) {
                    throw new McpError(ErrorCode.InvalidRequest, `Path "${path}" does not exist.`);
                }
                if (entry.type !== 'folder') {
                    return jsonText({ files: [entrySummary(manager, entry)] });
                }
            }
            const tree = buildTree(manager.listFiles());
            const children = childrenOf(tree, path || undefined);
            const files = children
                .filter((entry) => perms.includeHidden || !isDotFileName(entry.fileName))
                .map((entry) => entrySummary(manager, entry, true));
            return jsonText({ path: path ?? '', files });
        }
    );

    server.registerTool(
        'search_files',
        {
            title: 'Search files',
            description:
                'Search playground file names and contents for a query string. Returns up to 50 matches with a snippet of the surrounding text for each.',
            inputSchema: z.object({
                query: z.string().min(1).describe('Text to search for in file names and contents.'),
                path: z
                    .string()
                    .optional()
                    .describe('Restrict the search to a folder path. Defaults to the whole playground.')
            })
        },
        async ({ query, path }) => {
            requirePermission(permissions(), 'read');
            const perms = permissions();
            const all = manager.listFiles();
            const tree = buildTree(all);
            const restrictEntry = path ? visibleEntry(resolveVisiblePath(manager, path), perms) : null;
            if (path && !restrictEntry) {
                throw new McpError(ErrorCode.InvalidRequest, `Path "${path}" does not exist.`);
            }
            const inScope = (entry: McpFileEntry): boolean => {
                if (entry.type === 'folder') return false;
                if (!perms.includeHidden && isDotFileName(entry.fileName)) return false;
                if (restrictEntry) {
                    return (
                        entry.fileId === restrictEntry.fileId ||
                        isSelfOrDescendant(all, entry.fileId, restrictEntry.fileId)
                    );
                }
                return true;
            };
            const needle = query.toLowerCase();
            const results: Record<string, unknown>[] = [];
            for (const entry of all) {
                if (!inScope(entry)) continue;
                const nameHit = entry.fileName.toLowerCase().includes(needle);
                const contentIndex = entry.content.toLowerCase().indexOf(needle);
                const filePath = pathOf(all, entry);
                if (nameHit || contentIndex >= 0) {
                    results.push({
                        path: filePath,
                        name: entry.fileName,
                        language: entry.language,
                        snippet: contentIndex >= 0 ? snippetAround(entry.content, contentIndex) : undefined,
                        matched: contentIndex >= 0 ? 'content' : 'name'
                    });
                    if (results.length >= SEARCH_RESULT_LIMIT) break;
                }
            }
            return jsonText({ query, path: path ?? '', count: results.length, results });
        }
    );

    server.registerTool(
        'read_file',
        {
            title: 'Read file',
            description:
                'Read the full contents of a playground file. The returned content can be used as the basis for edits, reviews, or writing a solution note.',
            inputSchema: z.object({
                path: z.string().describe('Path of the file to read, e.g. "notes/todo.md".')
            })
        },
        async ({ path }) => {
            requirePermission(permissions(), 'read');
            const entry = visibleEntry(resolveVisiblePath(manager, path), permissions());
            if (!entry) {
                throw new McpError(ErrorCode.InvalidRequest, `File "${path}" does not exist.`);
            }
            if (entry.type === 'folder') {
                throw new McpError(ErrorCode.InvalidRequest, `"${path}" is a folder, not a file.`);
            }
            return jsonText({
                path: pathOf(manager.listFiles(), entry),
                name: entry.fileName,
                language: entry.language,
                lastUpdated: entry.lastUpdated,
                size: entry.content.length,
                content: entry.content
            });
        }
    );

    server.registerTool(
        'read_image',
        {
            title: 'Read image',
            description:
                'Read an image that is pasted into a playground markdown note. Note contents reference pasted images as cojudge://image/<id>; pass the exact reference as it appears (read_file returns these inline). The image is returned as an image content block with its MIME type, plus a text block with metadata. Requires the READ permission.',
            inputSchema: z.object({
                link: z
                    .string()
                    .describe('The image reference exactly as it appears in the markdown, e.g. "cojudge://image/1f0a3b2c-4d5e".')
            })
        },
        async ({ link }) => {
            requirePermission(permissions(), 'read');
            const dataUrl = manager.getImage(link);
            if (!dataUrl) {
                throw new McpError(
                    ErrorCode.InvalidRequest,
                    `Image "${link}" is not available on the MCP server. It is only synced after the note containing it has been opened and saved in the playground.`
                );
            }
            const parsed = parseDataUrl(dataUrl);
            if (!parsed) {
                throw new McpError(ErrorCode.InvalidRequest, `Image "${link}" has an unsupported data URL.`);
            }
            const imageBlock: ImageContent = { type: 'image', data: parsed.base64, mimeType: parsed.mimeType };
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                link,
                                mimeType: parsed.mimeType,
                                size: parsed.base64.length
                            },
                            null,
                            2
                        )
                    },
                    imageBlock
                ]
            };
        }
    );

    server.registerTool(
        'upload_image',
        {
            title: 'Upload image',
            description:
                'Upload an image to the playground and get back a cojudge://image/<id> link you can embed in markdown notes as ![alt](link). Pass the image either as data (a data URL like data:image/png;base64,... or raw base64, with mimeType for raw base64) or as path to a playground file whose contents are the image as base64 text. Uploaded images become visible in the user\'s notes within a few seconds. Requires the WRITE permission.',
            inputSchema: z.object({
                data: z
                    .string()
                    .optional()
                    .describe('The image as a data URL (e.g. "data:image/png;base64,...") or raw base64. Provide mimeType when passing raw base64 without a data URL prefix.'),
                mimeType: z
                    .string()
                    .optional()
                    .describe('MIME type of the image, e.g. "image/png". Required when data is raw base64; defaults to "image/png".'),
                path: z
                    .string()
                    .optional()
                    .describe('Path of a playground file whose contents are the image as base64 text (with or without a data URL prefix). Alternative to data.')
            })
        },
        async ({ data, mimeType, path }) => {
            requirePermission(permissions(), 'write');
            let payload: string | null = null;
            if (path) {
                const entry = visibleEntry(resolveVisiblePath(manager, path), permissions());
                if (!entry) {
                    throw new McpError(ErrorCode.InvalidRequest, `File "${path}" does not exist.`);
                }
                if (entry.type === 'folder') {
                    throw new McpError(ErrorCode.InvalidRequest, `"${path}" is a folder, not a file.`);
                }
                payload = entry.content;
            } else if (typeof data === 'string' && data.length > 0) {
                payload = data;
            }
            if (!payload) {
                throw new McpError(ErrorCode.InvalidRequest, 'Provide either "data" or "path" with the image payload.');
            }
            const parsed = parseImagePayload(payload, mimeType);
            if (!parsed) {
                throw new McpError(
                    ErrorCode.InvalidRequest,
                    'The image payload is neither a data URL nor valid base64 text.'
                );
            }
            if (parsed.size > MAX_IMAGE_UPLOAD_BYTES) {
                throw new McpError(
                    ErrorCode.InvalidRequest,
                    `Image payload is ${parsed.size} bytes; the upload limit is ${MAX_IMAGE_UPLOAD_BYTES} bytes.`
                );
            }
            const id = uuidv4();
            manager.setImage(id, parsed.dataUrl);
            const link = pastedImageLink(id);
            return jsonText({ id, link, mimeType: parsed.mimeType, size: parsed.size });
        }
    );

    server.registerTool(
        'get_open_tabs',
        {
            title: 'Get open tabs',
            description:
                'See which playground files are currently open as tabs and which one is active. Returns the active tab (if any) and every open tab with its file path; preview tabs resolve to their source note. Use this to know what the user is looking at before reading or editing. Requires the READ permission.',
            inputSchema: z.object({})
        },
        async () => {
            requirePermission(permissions(), 'read');
            const perms = permissions();
            const all = manager.listFiles();
            const byId = new Map(all.map((entry) => [entry.fileId, entry]));
            const { activeTabId, openTabs } = manager.getTabState();

            const resolveTab = (tab: { fileId: string; fileName: string; type: string; sourceFileId: string | null; lastUpdated: number }) => {
                const sourceId = tab.type === 'preview' && tab.sourceFileId ? tab.sourceFileId : tab.fileId;
                const entry = sourceId ? byId.get(sourceId) : undefined;
                if (!entry) {
                    return { path: null, name: tab.fileName, type: tab.type };
                }
                if (!perms.includeHidden && isDotFileName(entry.fileName)) return null;
                return {
                    path: pathOf(all, entry),
                    name: tab.type === 'editor' ? entry.fileName : tab.fileName,
                    type: tab.type
                };
            };

            const seen = new Set<string>();
            const open: Record<string, unknown>[] = [];
            let active: Record<string, unknown> | null = null;
            for (const tab of openTabs) {
                const resolved = resolveTab(tab);
                if (!resolved) continue;
                // A preview tab and its source editor tab share the same
                // resolved path; the first occurrence wins for both the open
                // list and the active tab.
                if (active === null && activeTabId !== null && (tab.type === 'preview' ? tab.sourceFileId : tab.fileId) === activeTabId) {
                    active = resolved;
                }
                const key = resolved.path ?? resolved.name;
                if (seen.has(key)) continue;
                seen.add(key);
                open.push(resolved);
            }
            return jsonText({ active, open });
        }
    );

    server.registerTool(
        'write_file',
        {
            title: 'Write file',
            description:
                'Overwrite an existing playground file, or create a new one when the path does not exist. Parent folders are created automatically for new paths. Requires the WRITE permission for overwrites and CREATE for new files.',
            inputSchema: z.object({
                path: z.string().describe('Path of the file to write, e.g. "notes/idea.md".'),
                content: z.string().describe('The full new contents of the file.')
            })
        },
        async ({ path, content }) => {
            const existing = resolveVisiblePath(manager, path);
            let created = false;
            if (existing) {
                requirePermission(permissions(), 'write');
                if (existing.type === 'folder') {
                    throw new McpError(ErrorCode.InvalidRequest, `"${path}" is a folder, not a file.`);
                }
                const updated: McpFileEntry = {
                    ...existing,
                    content,
                    lastUpdated: Date.now()
                };
                manager.applyAgentWrite(updated);
            } else {
                requirePermission(permissions(), 'create');
                ensureParentFolders(manager, path);
                const segments = normalizeSegments(path);
                const fileName = segments[segments.length - 1];
                const parentId = findParentFolder(manager, path);
                manager.applyAgentWrite({
                    fileId: uuidv4(),
                    fileName,
                    content,
                    language: languageFromFileName(fileName),
                    parentId,
                    type: 'editor',
                    lastUpdated: Date.now()
                });
                created = true;
            }
            return jsonText({ path, created, size: content.length });
        }
    );

    server.registerTool(
        'edit_file',
        {
            title: 'Edit file',
            description:
                'Make surgical edits to an existing playground file without rewriting the whole thing. Provide one or more edits; each one replaces its exact oldText with newText. Every oldText must appear exactly once in the file — include the surrounding lines so the match is unique. All edits are validated before any is applied, so a call either applies every edit or changes nothing. newText may be empty to delete text. Prefer this over write_file when only a few spots change. Requires the WRITE permission.',
            inputSchema: z.object({
                path: z.string().describe('Path of the file to edit, e.g. "notes/todo.md".'),
                edits: z
                    .array(
                        z.object({
                            oldText: z
                                .string()
                                .min(1)
                                .describe('Exact text to replace. Must appear exactly once in the file.'),
                            newText: z
                                .string()
                                .describe('Replacement text. Use an empty string to delete the matched text.')
                        })
                    )
                    .describe('The edits to apply, in order.')
            })
        },
        async ({ path, edits }) => {
            requirePermission(permissions(), 'write');
            const entry = visibleEntry(resolveVisiblePath(manager, path), permissions());
            if (!entry) {
                throw new McpError(ErrorCode.InvalidRequest, `File "${path}" does not exist.`);
            }
            if (entry.type === 'folder') {
                throw new McpError(ErrorCode.InvalidRequest, `"${path}" is a folder, not a file.`);
            }
            let content = entry.content;
            for (let index = 0; index < edits.length; index++) {
                const { oldText, newText } = edits[index];
                const occurrences = content.split(oldText).length - 1;
                if (occurrences === 0) {
                    throw new McpError(
                        ErrorCode.InvalidRequest,
                        `Edit ${index + 1} did not match anything in "${path}". Include more context from the file.`
                    );
                }
                if (occurrences > 1) {
                    throw new McpError(
                        ErrorCode.InvalidRequest,
                        `Edit ${index + 1} matched ${occurrences} places in "${path}". Include more surrounding lines to make the oldText unique.`
                    );
                }
                content = content.replace(oldText, newText);
            }
            manager.applyAgentWrite({ ...entry, content, lastUpdated: Date.now() });
            return jsonText({ path, edits: edits.length, size: content.length });
        }
    );

    server.registerTool(
        'move_file',
        {
            title: 'Move or rename file',
            description:
                'Move a playground file or folder to a new location, or rename it. The destination parent folder must already exist; the destination path itself must be free. Moving a folder moves everything inside it. Requires the WRITE permission.',
            inputSchema: z.object({
                path: z.string().describe('Path of the file or folder to move, e.g. "notes/todo.md".'),
                destination: z.string().describe('New path of the file or folder, e.g. "archive/todo.md" or "todo-renamed.md".')
            })
        },
        async ({ path, destination }) => {
            requirePermission(permissions(), 'write');
            const perms = permissions();
            const source = visibleEntry(resolveVisiblePath(manager, path), perms);
            if (!source) {
                throw new McpError(ErrorCode.InvalidRequest, `Path "${path}" does not exist.`);
            }
            const sourceSegments = normalizeSegments(path);
            const destSegments = normalizeSegments(destination);
            if (sourceSegments.join('/') === destSegments.join('/')) {
                throw new McpError(ErrorCode.InvalidRequest, 'Source and destination are the same path.');
            }
            if (resolveVisiblePath(manager, destination)) {
                throw new McpError(ErrorCode.InvalidRequest, `Destination "${destination}" already exists.`);
            }
            let parentId: string | null = null;
            if (destSegments.length > 1) {
                const parentPath = destSegments.slice(0, -1).join('/');
                const parent = resolveVisiblePath(manager, parentPath);
                if (!parent) {
                    throw new McpError(ErrorCode.InvalidRequest, `Destination folder "${parentPath}" does not exist.`);
                }
                if (parent.type !== 'folder') {
                    throw new McpError(ErrorCode.InvalidRequest, `"${parentPath}" is not a folder.`);
                }
                parentId = parent.fileId;
            }
            if (source.type === 'folder') {
                const all = manager.listFiles();
                if (parentId !== null && isSelfOrDescendant(all, parentId, source.fileId)) {
                    throw new McpError(
                        ErrorCode.InvalidRequest,
                        'Cannot move a folder into itself or one of its subfolders.'
                    );
                }
            }
            const moved = manager.applyAgentMove(source.fileId, parentId);
            const destinationName = destSegments[destSegments.length - 1];
            if (destinationName !== source.fileName) {
                const entry = manager.getFile(source.fileId);
                if (entry) {
                    manager.applyAgentWrite({ ...entry, fileName: destinationName, lastUpdated: Date.now() });
                }
            }
            return jsonText({ path, destination, moved });
        }
    );

    server.registerTool(
        'create_file',
        {
            title: 'Create file',
            description:
                'Create a new file in the playground. Fails if the path already exists. Parent folders are created automatically. Requires the CREATE permission.',
            inputSchema: z.object({
                path: z.string().describe('Path of the new file, e.g. "scratchpad/ideas.txt".'),
                content: z.string().optional().describe('Optional initial contents (empty by default).')
            })
        },
        async ({ path, content }) => {
            requirePermission(permissions(), 'create');
            if (resolveVisiblePath(manager, path)) {
                throw new McpError(ErrorCode.InvalidRequest, `File "${path}" already exists.`);
            }
            ensureParentFolders(manager, path);
            const segments = normalizeSegments(path);
            const fileName = segments[segments.length - 1];
            const parentId = findParentFolder(manager, path);
            manager.applyAgentWrite({
                fileId: uuidv4(),
                fileName,
                content: content ?? '',
                language: languageFromFileName(fileName),
                parentId,
                type: 'editor',
                lastUpdated: Date.now()
            });
            return jsonText({ path, created: true });
        }
    );

    server.registerTool(
        'create_note',
        {
            title: 'Create note',
            description:
                'Create a new markdown note in the playground. The path gets a ".md" extension when it does not already end in one. Notes open in the playground markdown editor so you can draft solutions, explanations, or todos. Requires the CREATE permission.',
            inputSchema: z.object({
                path: z
                    .string()
                    .describe('Path of the note, e.g. "notes/solution-approach". A .md extension is added automatically.'),
                content: z.string().optional().describe('Optional initial markdown contents (empty by default).')
            })
        },
        async ({ path, content }) => {
            requirePermission(permissions(), 'create');
            const notePath = /\.md$/i.test(path) ? path : `${path}.md`;
            if (resolveVisiblePath(manager, notePath)) {
                throw new McpError(ErrorCode.InvalidRequest, `Note "${notePath}" already exists.`);
            }
            ensureParentFolders(manager, notePath);
            const segments = normalizeSegments(notePath);
            const fileName = segments[segments.length - 1];
            const parentId = findParentFolder(manager, notePath);
            manager.applyAgentWrite({
                fileId: uuidv4(),
                fileName,
                content: content ?? '',
                language: 'markdown',
                parentId,
                type: 'editor',
                lastUpdated: Date.now()
            });
            return jsonText({ path: notePath, created: true });
        }
    );

    server.registerTool(
        'delete_file',
        {
            title: 'Delete file or folder',
            description:
                'Delete a playground file, or a folder and everything inside it. Requires the DELETE permission.',
            inputSchema: z.object({
                path: z.string().describe('Path of the file or folder to delete.')
            })
        },
        async ({ path }) => {
            requirePermission(permissions(), 'delete');
            const entry = visibleEntry(resolveVisiblePath(manager, path), permissions());
            if (!entry) {
                throw new McpError(ErrorCode.InvalidRequest, `Path "${path}" does not exist.`);
            }
            const all = manager.listFiles();
            const targetId = entry.fileId;
            const toRemove = all.filter(
                (candidate) =>
                    candidate.fileId === targetId ||
                    (entry.type === 'folder' && isSelfOrDescendant(all, candidate.fileId, targetId))
            );
            for (const candidate of toRemove) {
                manager.applyAgentDelete(candidate.fileId);
            }
            return jsonText({ path, deleted: toRemove.length });
        }
    );
}

function snippetAround(content: string, index: number): string {
    const start = Math.max(0, index - Math.floor(SNIPPET_LENGTH / 3));
    const end = Math.min(content.length, index + Math.floor((SNIPPET_LENGTH * 2) / 3));
    const prefix = start > 0 ? '…' : '';
    const suffix = end < content.length ? '…' : '';
    return `${prefix}${content.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`;
}

/** Split a data URL into its MIME type and base64 payload (null when not a data URL). */
function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
    const match = /^data:([^;,]+)(?:;[^,]*)?,(.*)$/s.exec(dataUrl);
    if (!match) return null;
    return { mimeType: match[1] || 'application/octet-stream', base64: match[2] };
}

const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;

/**
 * Normalize an upload payload (data URL or raw base64 text) into a data URL
 * with its MIME type and decoded byte size. Returns null when the payload is
 * not a data URL and not valid base64.
 */
function parseImagePayload(payload: string, mimeType?: string): { dataUrl: string; mimeType: string; size: number } | null {
    const trimmed = payload.trim();
    if (trimmed.startsWith('data:')) {
        const parsed = parseDataUrl(trimmed);
        if (!parsed) return null;
        return { dataUrl: trimmed, mimeType: parsed.mimeType, size: base64ByteLength(parsed.base64) };
    }
    if (!/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) return null;
    const cleaned = trimmed.replace(/\s+/g, '');
    if (cleaned.length === 0 || cleaned.length % 4 === 1) return null;
    const type = mimeType ?? 'image/png';
    return { dataUrl: `data:${type};base64,${cleaned}`, mimeType: type, size: base64ByteLength(cleaned) };
}

function base64ByteLength(base64: string): number {
    let padding = 0;
    if (base64.endsWith('==')) padding = 2;
    else if (base64.endsWith('=')) padding = 1;
    return Math.floor((base64.length - padding) * 3 / 4);
}
