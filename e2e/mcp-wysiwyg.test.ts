import { expect, test } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'http://localhost:4173/mcp';

async function seedPreviewWysiwyg(page) {
    const now = Date.now();
    const files = [
        {
            fileId: 'doc-1',
            fileName: 'doc.md',
            language: 'markdown',
            lastLanguage: 'markdown',
            content: '# My Document\n\nSome body text.\n',
            viewState: null,
            output: '',
            logs: '',
            isActive: false,
            order: 0,
            isOpen: true,
            lastUpdated: now
        },
        {
            fileId: 'preview-1',
            fileName: 'Preview: doc.md',
            language: 'markdown',
            content: '',
            viewState: null,
            output: '',
            logs: '',
            isActive: false,
            order: 1,
            isOpen: true,
            type: 'preview',
            sourceFileId: 'doc-1',
            lastUpdated: now
        }
    ];
    await page.evaluate(
        ([files]) => {
            localStorage.removeItem('user-settings');
            localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
            localStorage.setItem('playground-markdown-mode', 'wysiwyg');
            localStorage.setItem(
                'mcp-server-settings',
                JSON.stringify({
                    running: true,
                    permissions: { read: true, write: true, create: true, delete: false, includeHidden: false }
                })
            );
        },
        [files]
    );
}

test('agent edit_file re-renders the WYSIWYG view of the active tab', async ({ page }) => {
    await page.goto('/playground');
    await seedPreviewWysiwyg(page);
    await page.reload();

    const wysiwyg = page.locator('.wysiwyg-editing');
    await expect(wysiwyg).toBeVisible();
    await expect(wysiwyg).toContainText('Some body text');

    await expect
        .poll(async () => {
            const res = await fetch('http://localhost:4173/api/mcp/files');
            const snapshot = await res.json();
            return snapshot.entries.some((e) => e.fileName === 'doc.md');
        })
        .toBe(true);

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const result = await client.callTool({
        name: 'edit_file',
        arguments: {
            path: 'doc.md',
            edits: [{ oldText: 'Some body text', newText: 'Edited by the agent' }]
        }
    });
    expect(result.isError).toBeFalsy();
    await client.close();

    await expect(wysiwyg).toContainText('Edited by the agent');
    await expect(wysiwyg).not.toContainText('Some body text');
});
