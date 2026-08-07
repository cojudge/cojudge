import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { McpFileEntry, McpFilePush, McpFileSnapshot, McpPermissions, McpServerState, McpTabState } from '$lib/mcp/types';
import { parsePastedImageLink } from '$lib/utils/imageStore';
import { registerTools } from './tools';

type ManagedFile = {
    entry: McpFileEntry;
    /** Last write time in ms since epoch (client save or agent tool call). */
    mtime: number;
};

type Session = {
    transport: WebStandardStreamableHTTPServerTransport;
    server: McpServer;
};

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID, Accept',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Last-Event-ID'
};

/**
 * Server-side singleton holding the MCP server lifecycle, permission
 * configuration, and the playground file snapshot synced from the client.
 *
 * The MCP protocol endpoint lives at /mcp and speaks the Streamable HTTP
 * transport; start/stop/restart and permission changes go through the
 * /api/mcp/state and /api/mcp/files control endpoints.
 */
export class McpManager {    private running = false;
    private permissions: McpPermissions = {
        read: true,
        write: true,
        create: true,
        delete: false,
        includeHidden: false
    };
    private files = new Map<string, ManagedFile>();
    private tombstones = new Map<string, number>();
    /** Pasted-image payloads keyed by image id (the `cojudge://image/<id>` id). */
    private images = new Map<string, string>();
    private imagesRevision = 0;
    /** Last tab state pushed by a playground page (active tab + open tabs). */
    private tabState: McpTabState = { activeTabId: null, openTabs: [] };
    private revision = 0;
    private sessions = new Map<string, Session>();

    isRunning(): boolean {
        return this.running;
    }

    getPermissions(): McpPermissions {
        return { ...this.permissions };
    }

    getFileCount(): number {
        return this.files.size;
    }

    getState(): McpServerState {
        return {
            running: this.running,
            permissions: this.getPermissions(),
            revision: this.revision,
            fileCount: this.files.size
        };
    }

    async start(): Promise<void> {
        this.running = true;
    }

    async stop(): Promise<void> {
        this.running = false;
        await this.closeSessions();
    }

    async restart(): Promise<void> {
        await this.closeSessions();
        this.running = true;
    }

    setPermissions(permissions: McpPermissions): void {
        this.permissions = {
            read: Boolean(permissions.read),
            write: Boolean(permissions.write),
            create: Boolean(permissions.create),
            delete: Boolean(permissions.delete),
            includeHidden: Boolean(permissions.includeHidden)
        };
    }

    /** Entry lookup used by the tool layer. */
    getFile(fileId: string): McpFileEntry | undefined {
        return this.files.get(fileId)?.entry;
    }

    /** All live entries (folders included), as stored. */
    listFiles(): McpFileEntry[] {
        return Array.from(this.files.values()).map((f) => ({ ...f.entry }));
    }

    /**
     * Data URL of a pasted image, looked up by its fake link
     * (`cojudge://image/<id>`) or bare id.
     */
    getImage(linkOrId: string): string | undefined {
        const id = parsePastedImageLink(linkOrId) ?? linkOrId;
        return this.images.get(id);
    }

    /** Store an image payload (agent upload) under a fresh id. */
    setImage(id: string, dataUrl: string): void {
        this.images.set(id, dataUrl);
        this.imagesRevision++;
    }

    /** Every image payload keyed by id ({ [id]: dataUrl }). */
    getImages(): Record<string, string> {
        return Object.fromEntries(this.images);
    }

    /** Bumped on every agent image upload; drives the images-changed SSE event. */
    getImagesRevision(): number {
        return this.imagesRevision;
    }

    /** Remember the tab state pushed by a playground page (last writer wins). */
    setTabState(state: McpTabState): void {
        this.tabState = {
            activeTabId: state.activeTabId ?? null,
            openTabs: Array.isArray(state.openTabs) ? state.openTabs : []
        };
    }

    /** The current tab state (active tab + open tabs). */
    getTabState(): McpTabState {
        return {
            activeTabId: this.tabState.activeTabId,
            openTabs: this.tabState.openTabs.map((tab) => ({ ...tab }))
        };
    }

    /** Called by tools after an agent creates/edits a file. */
    applyAgentWrite(entry: McpFileEntry): void {
        const mtime = Date.now();
        this.files.set(entry.fileId, { entry: { ...entry }, mtime });
        this.tombstones.delete(entry.fileId);
        this.revision++;
    }

    /** Called by tools after an agent deletes a file. */
    applyAgentDelete(fileId: string): void {
        const time = Date.now();
        this.files.delete(fileId);
        this.tombstones.set(fileId, Math.max(this.tombstones.get(fileId) ?? 0, time));
        this.revision++;
    }

    /**
     * Re-parent an entry and every entry beneath it (used for folder moves).
     * Each moved entry gets a fresh mtime/lastUpdated so the browser's
     * last-writer-wins merge picks the move up. Returns the number of entries
     * moved.
     */
    applyAgentMove(fileId: string, newParentId: string | null): number {
        const children = Array.from(this.files.values())
            .filter((f) => f.entry.parentId === fileId)
            .map((f) => f.entry);
        let moved = 0;
        for (const child of children) {
            moved += this.applyAgentMove(child.fileId, fileId);
        }
        const existing = this.files.get(fileId);
        if (!existing) return moved;
        const mtime = Date.now();
        this.files.set(fileId, {
            entry: { ...existing.entry, parentId: newParentId, lastUpdated: mtime },
            mtime
        });
        this.revision++;
        return moved + 1;
    }

    /**
     * Merge a client-pushed snapshot. The client is authoritative for files it
     * last touched; the server keeps its own (agent-written) version when its
     * mtime is newer, so agent edits are not clobbered by stale client pushes.
     */
    syncClientFiles(push: McpFilePush): void {
        for (const entry of push.entries) {
            if (!entry || typeof entry.fileId !== 'string') continue;
            const existing = this.files.get(entry.fileId);
            const mtime = typeof entry.lastUpdated === 'number' ? entry.lastUpdated : 0;
            if (!existing || mtime >= existing.mtime) {
                this.files.set(entry.fileId, { entry, mtime });
                this.tombstones.delete(entry.fileId);
            }
        }
        for (const tombstone of push.tombstones ?? []) {
            const existing = this.files.get(tombstone.fileId);
            if (existing && existing.mtime <= tombstone.time) {
                this.files.delete(tombstone.fileId);
            }
            this.tombstones.set(
                tombstone.fileId,
                Math.max(this.tombstones.get(tombstone.fileId) ?? 0, tombstone.time)
            );
        }
        for (const [link, dataUrl] of Object.entries(push.images ?? {})) {
            if (typeof link === 'string' && typeof dataUrl === 'string') {
                const id = parsePastedImageLink(link) ?? link;
                this.images.set(id, dataUrl);
            }
        }
        this.revision++;
    }

    getSnapshot(): McpFileSnapshot {
        return {
            revision: this.revision,
            entries: this.listFiles(),
            tombstones: Array.from(this.tombstones.entries()).map(([fileId, time]) => ({ fileId, time }))
        };
    }

    /** True when the client should consider `fileId` deleted (per tombstones). */
    getTombstoneTime(fileId: string): number {
        return this.tombstones.get(fileId) ?? 0;
    }

    /**
     * Route an HTTP request for the /mcp protocol endpoint. Serves the
     * Streamable HTTP transport; requests that carry an unknown session id
     * receive a 404 per the specification.
     */
    async handleProtocolRequest(request: Request): Promise<Response> {
        if (!this.running) {
            return this.withCors(new Response('MCP server is stopped', { status: 503 }));
        }

        const sessionId = request.headers.get('mcp-session-id');
        if (sessionId) {
            const session = this.sessions.get(sessionId);
            if (!session) {
                return this.withCors(new Response('Session not found', { status: 404 }));
            }
            return this.withCors(await session.transport.handleRequest(request));
        }

        const transport = new WebStandardStreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID()
        });
        const server = new McpServer({ name: 'cojudge-playground', version: '0.1.0' });
        registerTools(server, this);
        await server.connect(transport);
        try {
            const response = await transport.handleRequest(request);
            const assigned = transport.sessionId;
            if (assigned && !this.sessions.has(assigned)) {
                this.sessions.set(assigned, { transport, server });
                transport.onclose = () => {
                    this.sessions.delete(assigned);
                    void server.close();
                };
            } else {
                void server.close();
            }
            return this.withCors(response);
        } catch (error) {
            void server.close();
            throw error;
        }
    }

    private async closeSessions(): Promise<void> {
        const sessions = Array.from(this.sessions.values());
        this.sessions.clear();
        await Promise.allSettled(
            sessions.map(async (session) => {
                try {
                    await session.transport.close();
                } catch {
                    // transport is already closed
                }
                try {
                    await session.server.close();
                } catch {
                    // server is already closed
                }
            })
        );
    }

    private withCors(response: Response): Response {
        const headers = new Headers(response.headers);
        for (const [name, value] of Object.entries(CORS_HEADERS)) {
            headers.set(name, value);
        }
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });
    }
}

export const mcpManager = new McpManager();
