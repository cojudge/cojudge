import { expect, test } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'http://localhost:4173/mcp';

type OpenTabsResult = {
    active: { path: string | null; name: string; type: string } | null;
    open: { path: string | null; name: string; type: string }[];
};

async function startMcpServer(): Promise<void> {
    const res = await fetch('http://localhost:4173/api/mcp/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
    });
    expect(res.ok).toBeTruthy();
}

async function getOpenTabs(client: Client): Promise<OpenTabsResult> {
    const result = await client.callTool({ name: 'get_open_tabs', arguments: {} });
    expect(result.isError).toBeFalsy();
    return JSON.parse(result.content[0].text) as OpenTabsResult;
}

test('get_open_tabs reports the active tab, open tabs, previews and hidden-file gating', async () => {
    await startMcpServer();

    const now = Date.now();
    const seed = await fetch('http://localhost:4173/api/mcp/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entries: [
                {
                    fileId: 'note-a',
                    fileName: 'a.md',
                    content: '# A',
                    language: 'markdown',
                    parentId: null,
                    type: 'editor',
                    lastUpdated: now
                },
                {
                    fileId: 'file-b',
                    fileName: 'b.txt',
                    content: 'b',
                    language: 'plaintext',
                    parentId: null,
                    type: 'editor',
                    lastUpdated: now
                },
                {
                    fileId: 'file-c',
                    fileName: '.secret.md',
                    content: 's',
                    language: 'markdown',
                    parentId: null,
                    type: 'editor',
                    lastUpdated: now
                }
            ],
            tombstones: []
        })
    });
    expect(seed.ok).toBeTruthy();

    const tabs = await fetch('http://localhost:4173/api/mcp/tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            activeTabId: 'note-a',
            openTabs: [
                { fileId: 'note-a', fileName: 'a.md', type: 'editor', sourceFileId: null, lastUpdated: now + 2000 },
                { fileId: 'preview-1', fileName: 'a.md', type: 'preview', sourceFileId: 'note-a', lastUpdated: now + 1500 },
                { fileId: 'file-b', fileName: 'b.txt', type: 'editor', sourceFileId: null, lastUpdated: now + 1000 },
                { fileId: 'file-c', fileName: '.secret.md', type: 'editor', sourceFileId: null, lastUpdated: now },
                { fileId: 'wb-1', fileName: 'Whiteboard', type: 'whiteboard', sourceFileId: null, lastUpdated: now }
            ]
        })
    });
    expect(tabs.ok).toBeTruthy();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const result = await getOpenTabs(client);
    await client.close();

    expect(result.active).toEqual({ path: 'a.md', name: 'a.md', type: 'editor' });
    const paths = result.open.map((tab) => tab.path);
    expect(paths).toEqual(['a.md', 'b.txt', null]);
    const whiteboard = result.open.find((tab) => tab.path === null);
    expect(whiteboard).toEqual({ path: null, name: 'Whiteboard', type: 'whiteboard' });
    expect(result.open.some((tab) => tab.name === '.secret.md')).toBeFalsy();
});

test('the playground pushes tab state and tab switches update the active tab', async ({ page, request }) => {
    const now = Date.now();
    // Clear the shared server's state from the previous test so the page's
    // MCP file sync has nothing to pull or open as tabs. The server merges
    // by mtime, so existing files need tombstones to be deleted.
    const snapshot = await (await fetch('http://localhost:4173/api/mcp/files')).json();
    const resetFiles = await request.post('http://localhost:4173/api/mcp/files', {
        data: {
            entries: [],
            tombstones: (snapshot.entries ?? []).map((e: { fileId: string }) => ({
                fileId: e.fileId,
                time: Date.now() + 1000
            }))
        }
    });
    expect(resetFiles.ok()).toBeTruthy();
    const resetTabs = await request.post('http://localhost:4173/api/mcp/tabs', {
        data: { activeTabId: null, openTabs: [] }
    });
    expect(resetTabs.ok()).toBeTruthy();

    // Seed storage before the page loads (applies to every navigation, so
    // there is no unseeded first load that persists a stray default tab).
    await page.addInitScript(
        ([now]) => {
            localStorage.setItem(
                'files',
                JSON.stringify({
                    playground: JSON.stringify([
                        {
                            fileId: 'ui-a',
                            fileName: 'a.md',
                            type: 'editor',
                            language: 'markdown',
                            content: '# A',
                            order: 0,
                            isOpen: true,
                            lastUpdated: now + 2000
                        },
                        {
                            fileId: 'ui-b',
                            fileName: 'b.txt',
                            type: 'editor',
                            language: 'plaintext',
                            content: 'b',
                            order: 1,
                            isOpen: true,
                            lastUpdated: now + 1000
                        },
                        {
                            fileId: 'ui-c',
                            fileName: 'c.txt',
                            type: 'editor',
                            language: 'plaintext',
                            content: 'c',
                            order: 2,
                            isOpen: false,
                            lastUpdated: now
                        }
                    ])
                })
            );
            localStorage.setItem(
                'mcp-server-settings',
                JSON.stringify({
                    running: true,
                    permissions: { read: true, write: true, create: true, delete: false, includeHidden: false }
                })
            );
        },
        [now]
    );

    await page.goto('/playground');
    // The playground page starts the MCP server from onMount, which runs
    // after the load event; wait for it so the SDK connect below does not
    // race a stopped server.
    await expect
        .poll(async () => {
            const res = await fetch('http://localhost:4173/api/mcp/state');
            return (await res.json()).running;
        })
        .toBe(true);

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    try {
        await expect
            .poll(async () => {
                const result = await getOpenTabs(client);
                const paths = result.open.map((tab) => tab.path).sort();
                return result.active?.path === 'a.md' && JSON.stringify(paths) === JSON.stringify(['a.md', 'b.txt']);
            })
            .toBe(true);

        await page.getByRole('tab', { name: /b\.txt/ }).click();
        await expect
            .poll(async () => {
                const result = await getOpenTabs(client);
                return result.active?.path === 'b.txt';
            })
            .toBe(true);
    } finally {
        await client.close();
    }
});
