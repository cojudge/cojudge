import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import fileStore, { fileSyncVersion, type FileEntry } from '$lib/stores/fileStore';
import { findPastedImageLinks, getAllPastedImages, importPastedImages, parsePastedImageLink } from '$lib/utils/imageStore';
import { mcpSettings } from './settings';
import type { McpFileEntry, McpFilePush, McpFileSnapshot, McpPermissions, McpServerState, McpTabState } from './types';

export type McpClientState = McpServerState & {
    loading: boolean;
    error: string;
};

const initialState: McpClientState = {
    running: false,
    permissions: { read: true, write: true, create: true, delete: false, includeHidden: false },
    revision: 0,
    fileCount: 0,
    loading: false,
    error: ''
};

export const mcpClientState = writable<McpClientState>(initialState);

/** The playground key in the file store that the MCP server exposes. */
export const MCP_FILE_KEY = 'playground';

/**
 * Per-launch token of the packaged desktop backend (set by the root layout).
 * Persists across app restarts so copied MCP URLs stay valid; agents
 * authenticate with it through the MCP URL query string. Null in dev mode.
 */
export const desktopMcpToken = writable<string | null>(null);

export function setDesktopMcpToken(token: string | null): void {
	desktopMcpToken.set(token);
}

/** The URL agents use to connect (Streamable HTTP MCP endpoint). */
export function getMcpUrl(): string {
	if (!browser) return '/mcp';
	const base = `${window.location.origin}/mcp`;
	const token = get(desktopMcpToken);
	return token ? `${base}?token=${token}` : base;
}

/**
 * Rotate the desktop MCP token (packaged app only): the backend regenerates
 * the token, restarts, and this function redirects through the bootstrap
 * endpoint so the webview's session cookie stays valid.
 */
export async function rotateDesktopMcpToken(): Promise<void> {
	if (!browser) throw new Error('Token rotation is only available in the packaged desktop app.');
	if (!get(desktopMcpToken)) {
		throw new Error('Token rotation is only available in the packaged desktop app.');
	}
	const tauriInternals = (window as Window & {
		__TAURI_INTERNALS__?: {
			invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
		};
	}).__TAURI_INTERNALS__;
	if (!tauriInternals) throw new Error('The desktop bridge is unavailable.');
	const token = await tauriInternals.invoke<string>('rotate_desktop_token');
	window.location.href = `/__cojudge_bootstrap?token=${encodeURIComponent(token)}`;
}

async function requestState(): Promise<McpServerState> {
    const response = await fetch('/api/mcp/state');
    if (!response.ok) throw new Error(`MCP state request failed (${response.status}).`);
    return (await response.json()) as McpServerState;
}

export async function refreshMcpState(): Promise<void> {
    if (!browser) return;
    mcpClientState.update((s) => ({ ...s, loading: true, error: '' }));
    try {
        const state = await requestState();
        mcpClientState.set({ ...state, loading: false, error: '' });
    } catch (error) {
        mcpClientState.update((s) => ({
            ...s,
            loading: false,
            error: error instanceof Error ? error.message : 'Could not reach the MCP server.'
        }));
    }
}

async function runAction(action: 'start' | 'stop' | 'restart' | 'setPermissions', permissions?: McpPermissions): Promise<void> {
    if (!browser) return;
    mcpClientState.update((s) => ({ ...s, loading: true, error: '' }));
    try {
        const response = await fetch('/api/mcp/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(permissions ? { action, permissions } : { action })
        });
        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            throw new Error(payload?.error ?? `MCP action failed (${response.status}).`);
        }
        const state = (await response.json()) as McpServerState;
        mcpClientState.set({ ...state, loading: false, error: '' });
        mcpSettings.update((s) => ({ ...s, running: state.running, permissions: state.permissions }));
    } catch (error) {
        mcpClientState.update((s) => ({
            ...s,
            loading: false,
            error: error instanceof Error ? error.message : 'MCP action failed.'
        }));
    }
}

export function startMcpServer(): Promise<void> {
    return runAction('start');
}

export function stopMcpServer(): Promise<void> {
    return runAction('stop');
}

export function restartMcpServer(): Promise<void> {
    return runAction('restart');
}

export function updateMcpPermissions(permissions: McpPermissions): Promise<void> {
    return runAction('setPermissions', permissions);
}

/** Start the server automatically when the user previously left it running. */
export async function ensureMcpServerRunning(): Promise<void> {
    if (!browser) return;
    await refreshMcpState();
    const settings = get(mcpSettings);
    const state = get(mcpClientState);
    if (settings.running && !state.running) {
        await startMcpServer();
    }
}

/** Convert playground FileEntry rows into the slim entries the MCP server stores. */
export function toMcpEntries(entries: FileEntry[]): McpFileEntry[] {
    const byId = new Map<string, FileEntry>();
    for (const entry of entries) {
        if (entry.type === 'preview' || entry.type === 'whiteboard') continue;
        const existing = byId.get(entry.fileId);
        if (!existing || (entry.lastUpdated ?? 0) > (existing.lastUpdated ?? 0)) {
            byId.set(entry.fileId, entry);
        }
    }
    return Array.from(byId.values()).map((entry) => ({
        fileId: entry.fileId,
        fileName: entry.fileName,
        content: entry.content ?? '',
        language: entry.language ?? 'plaintext',
        parentId: entry.parentId ?? null,
        type: entry.type === 'folder' ? 'folder' : 'editor',
        order: entry.order,
        lastUpdated: entry.lastUpdated ?? 0
    }));
}

/** Build a FileEntry row the playground can ingest from an MCP snapshot row. */
export function fromMcpEntry(entry: McpFileEntry): FileEntry {
    return {
        fileId: entry.fileId,
        fileName: entry.fileName,
        content: entry.content,
        language: entry.language,
        parentId: entry.parentId ?? null,
        type: entry.type === 'folder' ? 'folder' : 'editor',
        order: entry.order,
        lastUpdated: entry.lastUpdated,
        isActive: false,
        isOpen: entry.type !== 'folder',
        output: '',
        logs: '',
        viewState: null
    } as FileEntry;
}

/** Shape of the playground's tab metadata, passed structurally. */
export type McpClientTab = {
    fileId: string;
    fileName: string;
    isOpen: boolean;
    lastUpdated?: number;
    type?: 'editor' | 'preview' | 'whiteboard';
    sourceFileId?: string;
};

/** Convert playground tabs into the state pushed to the MCP server. */
export function toMcpTabState(tabs: McpClientTab[], activeIndex: number): McpTabState {
    const openTabs = tabs
        .filter((tab) => tab.isOpen)
        .map((tab) => ({
            fileId: tab.fileId,
            fileName: tab.fileName,
            type: tab.type ?? 'editor',
            sourceFileId: tab.sourceFileId ?? null,
            lastUpdated: tab.lastUpdated ?? 0
        }));
    const active = activeIndex >= 0 && activeIndex < tabs.length ? tabs[activeIndex] : null;
    const activeTabId = active
        ? active.type === 'preview' && active.sourceFileId
            ? active.sourceFileId
            : active.fileId
        : null;
    return { activeTabId, openTabs };
}

/** Push the current tab state (open tabs + active tab) to the MCP server. */
export async function pushMcpTabs(state: McpTabState): Promise<void> {
    if (!browser) return;
    if (!get(mcpClientState).running) return;
    const response = await fetch('/api/mcp/tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    });
    if (!response.ok && response.status === 503) {
        mcpClientState.update((s) => ({ ...s, running: false }));
    }
}

/**
 * Collect data URLs for every pasted image referenced by the given entries'
 * markdown content, keyed by fake link (`cojudge://image/<id>`). Returns an
 * empty map when nothing is referenced or IndexedDB is unavailable.
 */
async function collectReferencedImages(entries: McpFileEntry[]): Promise<Record<string, string>> {
    const links = new Set<string>();
    for (const entry of entries) {
        if (entry.type === 'folder') continue;
        for (const link of findPastedImageLinks(entry.content)) links.add(link);
    }
    if (links.size === 0) return {};
    const all = await getAllPastedImages();
    const images: Record<string, string> = {};
    for (const link of links) {
        const id = parsePastedImageLink(link);
        if (id && all[id]) images[link] = all[id];
    }
    return images;
}

/** Revision of the image map this tab has imported into IndexedDB so far. */
let knownImagesRevision = -1;

/**
 * Pull agent-uploaded images from the MCP server into IndexedDB so notes
 * referencing them render. Uses `?since=` so the server only sends the full
 * image map when it actually changed; only images missing locally are
 * imported, and a fileSyncVersion bump re-renders open notes.
 */
export async function syncMcpImages(): Promise<void> {
    if (!browser) return;
    if (!get(mcpClientState).running) return;
    try {
        const response = await fetch(`/api/mcp/images?since=${knownImagesRevision}`);
        if (!response.ok) return;
        const payload = (await response.json()) as { revision?: number; images?: Record<string, string> };
        if (typeof payload.revision !== 'number') return;
        knownImagesRevision = payload.revision;
        if (!payload.images) return;
        const have = await getAllPastedImages();
        const missing: Record<string, string> = {};
        for (const [id, dataUrl] of Object.entries(payload.images)) {
            if (typeof dataUrl !== 'string') continue;
            if (!(id in have)) missing[id] = dataUrl;
        }
        if (Object.keys(missing).length === 0) return;
        await importPastedImages(missing);
        fileSyncVersion.update((version) => version + 1);
    } catch {
        // Server unreachable or IndexedDB unavailable; the next poll retries.
    }
}

export async function pushMcpFiles(entries: FileEntry[], tombstones: { fileId: string; time: number }[]): Promise<void> {
    if (!browser) return;
    const state = get(mcpClientState);
    if (!state.running) return;
    const mcpEntries = toMcpEntries(entries);
    const push: McpFilePush = {
        entries: mcpEntries,
        tombstones,
        images: await collectReferencedImages(mcpEntries)
    };
    const response = await fetch('/api/mcp/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(push)
    });
    if (!response.ok) {
        if (response.status === 503) {
            mcpClientState.update((s) => ({ ...s, running: false }));
        }
        return;
    }
    const stateAfter = (await response.json()) as McpServerState;
    mcpClientState.update((s) => ({ ...s, revision: stateAfter.revision, fileCount: stateAfter.fileCount }));
}

export async function pullMcpFiles(): Promise<McpFileSnapshot | null> {
    if (!browser) return null;
    const state = get(mcpClientState);
    if (!state.running) return null;
    const response = await fetch('/api/mcp/files');
    if (!response.ok) {
        if (response.status === 503) {
            mcpClientState.update((s) => ({ ...s, running: false }));
        }
        return null;
    }
    return (await response.json()) as McpFileSnapshot;
}

/**
 * Immediately push the current playground snapshot to the MCP server.
 * Unlike the store subscription, this works from any page (the file store
 * is read straight from localStorage) and bypasses the change-detection gate,
 * so the popup can kick a sync on open / start / restart.
 */
export async function syncMcpFilesNow(): Promise<void> {
    if (!browser) return;
    if (!get(mcpClientState).running) return;
    const store = get(fileStore);
    let entries: FileEntry[] = [];
    try {
        entries = JSON.parse(store[MCP_FILE_KEY] ?? '[]') as FileEntry[];
    } catch {
        return;
    }
    await pushMcpFiles(entries, []);
    await syncMcpImages();
}

export type PullApplied = {
    added: { fileId: string; fileName: string; lastUpdated: number }[];
    changed: number;
    removed: number;
};

/**
 * Merge a server snapshot into the file store. Entries the agent last touched
 * (newer lastUpdated) win; entries the user last touched are kept; tombstones
 * remove files the agent deleted. Only writes the store when something
 * actually changed, so the playground only reloads its editor for real edits.
 *
 * When `prevKnownIds` is provided (the sync loop's deletion tracker), it is
 * kept in sync with the merged result so later pushes emit correct tombstones.
 */
function mergeSnapshotIntoStore(snapshot: McpFileSnapshot, prevKnownIds: Set<string> | null): PullApplied {
    const localEntries = entriesOfStore();
    const localById = new Map(localEntries.map((entry) => [entry.fileId, entry]));
    const localPrev = new Set(localEntries.map((entry) => entry.fileId));
    const next: FileEntry[] = [];
    const added: { fileId: string; fileName: string; lastUpdated: number }[] = [];
    let changed = 0;

    for (const entry of snapshot.entries) {
        const local = localById.get(entry.fileId);
        if (!local) {
            next.push(fromMcpEntry(entry));
            added.push({ fileId: entry.fileId, fileName: entry.fileName, lastUpdated: entry.lastUpdated });
        } else if ((entry.lastUpdated ?? 0) > (local.lastUpdated ?? 0)) {
            next.push({
                ...fromMcpEntry(entry),
                output: local.output,
                logs: local.logs,
                viewState: local.viewState,
                isOpen: local.isOpen
            });
            changed++;
        } else {
            next.push(local);
        }
    }

    let removed = 0;
    const tombstoneTimes = new Map(snapshot.tombstones.map((t) => [t.fileId, t.time]));
    for (const entry of localEntries) {
        const tombstoneTime = tombstoneTimes.get(entry.fileId);
        if (tombstoneTime !== undefined && (entry.lastUpdated ?? 0) <= tombstoneTime) {
            removed++;
            continue;
        }
        if (!next.some((candidate) => candidate.fileId === entry.fileId)) {
            next.push(entry);
        }
    }

    if (prevKnownIds) {
        for (const id of localPrev) {
            if (!next.some((candidate) => candidate.fileId === id)) prevKnownIds.delete(id);
        }
        const nextIds = new Set(next.map((entry) => entry.fileId));
        for (const id of nextIds) prevKnownIds.add(id);
    }

    const applied: PullApplied = { added, changed, removed };
    const changedSomething = added.length > 0 || changed > 0 || removed > 0;
    if (changedSomething) {
        fileStore.update((store) => ({ ...store, [MCP_FILE_KEY]: JSON.stringify(next) }));
        fileSyncVersion.update((version) => version + 1);
    }
    return applied;
}

/** Registered by the playground sync loop; falls back to a standalone pull. */
let pullHandler: (() => void) | null = null;

function setMcpPullHandler(handler: (() => void) | null): void {
    pullHandler = handler;
}

function requestMcpPull(): void {
    if (pullHandler) {
        pullHandler();
        return;
    }
    void pullMcpFilesStandalone();
}

/** Pull the server snapshot and merge it, without the sync loop's bookkeeping. */
async function pullMcpFilesStandalone(): Promise<void> {
    if (!browser) return;
    const snapshot = await pullMcpFiles();
    if (!snapshot) return;
    mergeSnapshotIntoStore(snapshot, null);
    mcpClientState.update((s) => ({ ...s, revision: snapshot.revision, fileCount: snapshot.entries.length }));
    void syncMcpImages();
}

/**
 * Pull agent-made changes from the MCP server and merge them into the store.
 * Works from any page; on the playground page it routes through the sync loop
 * so new agent files also appear as tabs.
 */
export async function pullMcpFilesNow(): Promise<void> {
    if (!browser) return;
    if (pullHandler) {
        pullHandler();
        return;
    }
    await pullMcpFilesStandalone();
}

let eventSource: EventSource | null = null;
let eventSourceRefCount = 0;

/**
 * Open the SSE event stream from the MCP server. The browser reconnects
 * automatically on drops; events trigger an instant pull instead of waiting
 * for the polling interval. Refcounted: pages call it in onMount and dispose
 * in onDestroy; the last page to leave closes the connection.
 */
export function startMcpEventSync(): () => void {
    if (!browser) return () => {};
    eventSourceRefCount++;
    if (!eventSource) {
        eventSource = new EventSource('/api/mcp/events');
        eventSource.addEventListener('files-changed', (event) => {
            try {
                const data = JSON.parse((event as MessageEvent).data) as { revision?: number };
                if (typeof data.revision !== 'number') return;
                const known = get(mcpClientState).revision;
                if (known > 0 && data.revision <= known) return;
                requestMcpPull();
            } catch {
                // Ignore malformed events.
            }
        });
        eventSource.addEventListener('images-changed', () => {
            void syncMcpImages();
        });
        eventSource.addEventListener('state-changed', () => {
            void refreshMcpState();
        });
        eventSource.addEventListener('hello', () => {
            void refreshMcpState();
        });
    }
    return () => {
        eventSourceRefCount--;
        if (eventSourceRefCount <= 0 && eventSource) {
            eventSource.close();
            eventSource = null;
        }
    };
}

/** Read the current playground rows straight from the file store. */
export function entriesOfStore(): FileEntry[] {
    if (!browser) return [];
    const store = get(fileStore);
    const raw = store[MCP_FILE_KEY] ?? '[]';
    try {
        return JSON.parse(raw) as FileEntry[];
    } catch {
        return [];
    }
}

/**
 * Subscribe to the file store, push it to the MCP server while running, and
 * pull agent-made changes back into the store instantly over the SSE stream
 * (with a polling interval as a fallback).
 *
 * Returns a cleanup function.
 */
export function setupMcpFileSync(options: {
    pushDebounceMs?: number;
    pullIntervalMs?: number;
    onApplied?: (applied: PullApplied) => void;
} = {}): () => void {
    if (!browser) return () => {};
    const pushDebounceMs = options.pushDebounceMs ?? 600;
    const pullIntervalMs = options.pullIntervalMs ?? 4000;

    let lastPushSignature = '';
    let prevKnownIds = new Set<string>();
    let reportedDeletions = new Set<string>();
    let pushTimer: ReturnType<typeof setTimeout> | undefined;
    let pullTimer: ReturnType<typeof setInterval> | undefined;
    let disposed = false;

    function schedulePush() {
        if (disposed) return;
        if (pushTimer) clearTimeout(pushTimer);
        pushTimer = setTimeout(() => void pushNow(), pushDebounceMs);
    }

    async function pushNow() {
        if (disposed) return;
        const entries = entriesOfStore();
        const signature = JSON.stringify(toMcpEntries(entries));
        if (signature === lastPushSignature) return;
        lastPushSignature = signature;

        const currentIds = new Set(entries.map((entry) => entry.fileId));
        const tombstones: { fileId: string; time: number }[] = [];
        const now = Date.now();
        for (const id of prevKnownIds) {
            if (!currentIds.has(id) && !reportedDeletions.has(id)) {
                tombstones.push({ fileId: id, time: now });
                reportedDeletions.add(id);
            }
        }
        for (const id of currentIds) {
            reportedDeletions.delete(id);
        }
        prevKnownIds = currentIds;
        await pushMcpFiles(entries, tombstones);
    }

    async function pullNow() {
        if (disposed) return;
        const snapshot = await pullMcpFiles();
        if (!snapshot || disposed) return;
        const applied = mergeSnapshotIntoStore(snapshot, prevKnownIds);
        if (applied.added.length > 0 || applied.changed > 0 || applied.removed > 0) {
            options.onApplied?.(applied);
        }
        mcpClientState.update((s) => ({ ...s, revision: snapshot.revision, fileCount: snapshot.entries.length }));
        void syncMcpImages();
    }

    const unsubStore = fileStore.subscribe(() => schedulePush());
    let wasRunning = false;
    const unsubClientState = mcpClientState.subscribe((state) => {
        if (state.running && !wasRunning) {
            // The server just came up: push the current snapshot immediately,
            // otherwise files stay empty until the next store change.
            lastPushSignature = '';
            schedulePush();
            void pullNow();
        }
        if (!state.running) {
            lastPushSignature = '';
            reportedDeletions.clear();
        }
        wasRunning = state.running;
    });
    pullTimer = setInterval(() => void pullNow(), pullIntervalMs);
    void pullNow();
    setMcpPullHandler(() => void pullNow());

    return () => {
        disposed = true;
        setMcpPullHandler(null);
        unsubStore();
        unsubClientState();
        if (pushTimer) clearTimeout(pushTimer);
        if (pullTimer) clearInterval(pullTimer);
    };
}
