import { expect, test } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'http://localhost:4173/mcp';

async function seedPlayground(page) {
    const now = Date.now();
    const files = [
        {
            fileId: 'file-a',
            fileName: 'FileA.java',
            language: 'java',
            lastLanguage: 'java',
            content: 'public class FileA {\n    public static void main(String[] args) {\n        System.out.println("hi");\n    }\n}\n',
            viewState: null,
            output: '',
            logs: '',
            isActive: false,
            order: 0,
            isOpen: true,
            lastUpdated: now
        }
    ];
    await page.evaluate(
        ([files, now]) => {
            localStorage.removeItem('user-settings');
            localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
            localStorage.setItem(
                'mcp-server-settings',
                JSON.stringify({
                    running: true,
                    permissions: { read: true, write: true, create: true, delete: false, includeHidden: false }
                })
            );
        },
        [files, now]
    );
}

test('agent edit_file updates the active tab', async ({ page }) => {
    await page.goto('/playground');
    await seedPlayground(page);
    await page.reload();
    await expect(page.locator('.monaco-editor')).toBeVisible();
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('println("hi")');

    // Wait until the page pushed its snapshot to the MCP server. The file map
    // is shared across browser tabs, so check for this test's own file.
    let fileCount = 0;
    await expect
        .poll(async () => {
            const res = await fetch('http://localhost:4173/api/mcp/files');
            const snapshot = await res.json();
            fileCount = snapshot.entries.length;
            return snapshot.entries.some((e) => e.fileName === 'FileA.java');
        })
        .toBe(true);

    // Agent surgically edits the file the user has open as the active tab.
    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const result = await client.callTool({
        name: 'edit_file',
        arguments: {
            path: 'FileA.java',
            edits: [{ oldText: 'println("hi")', newText: 'println("edited by agent")' }]
        }
    });
    expect(result.isError).toBeFalsy();
    await client.close();

    // The SSE push must flow through to the visible editor of the active tab.
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('edited by agent');
    await expect(page.locator('.monaco-editor .view-lines')).not.toContainText('println("hi")');
});
