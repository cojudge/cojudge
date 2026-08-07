import { expect, test } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'http://localhost:4173/mcp';

const IMAGE_BASE64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const IMAGE_DATA_URL = `data:image/png;base64,${IMAGE_BASE64}`;

async function startMcpServer(): Promise<void> {
    const res = await fetch('http://localhost:4173/api/mcp/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
    });
    expect(res.ok).toBeTruthy();
}

test('upload_image with a data URL returns a link that read_image can fetch back', async () => {
    await startMcpServer();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const upload = await client.callTool({
        name: 'upload_image',
        arguments: { data: IMAGE_DATA_URL }
    });
    expect(upload.isError).toBeFalsy();
    const uploadMeta = JSON.parse(upload.content[0].text) as { id: string; link: string; mimeType: string };
    expect(uploadMeta.link).toBe(`cojudge://image/${uploadMeta.id}`);
    expect(uploadMeta.mimeType).toBe('image/png');

    const read = await client.callTool({
        name: 'read_image',
        arguments: { link: uploadMeta.link }
    });
    expect(read.isError).toBeFalsy();
    const imageBlock = read.content.find((block) => block.type === 'image');
    expect(imageBlock).toBeDefined();
    expect(imageBlock.data).toBe(IMAGE_BASE64);
    expect(imageBlock.mimeType).toBe('image/png');
    await client.close();

    const imagesRes = await fetch(`http://localhost:4173/api/mcp/images?since=0`);
    expect(imagesRes.ok).toBeTruthy();
    const imagesPayload = (await imagesRes.json()) as { revision: number; images: Record<string, string> };
    expect(imagesPayload.images[uploadMeta.id]).toBe(IMAGE_DATA_URL);

    const noChangeRes = await fetch(`http://localhost:4173/api/mcp/images?since=${imagesPayload.revision}`);
    const noChangePayload = (await noChangeRes.json()) as { revision: number; images?: Record<string, string> };
    expect(noChangePayload.images).toBeUndefined();
});

test('upload_image accepts raw base64 with a mimeType', async () => {
    await startMcpServer();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const upload = await client.callTool({
        name: 'upload_image',
        arguments: { data: IMAGE_BASE64, mimeType: 'image/png' }
    });
    await client.close();

    expect(upload.isError).toBeFalsy();
    const uploadMeta = JSON.parse(upload.content[0].text) as { link: string; size: number };
    expect(uploadMeta.link.startsWith('cojudge://image/')).toBeTruthy();
    expect(uploadMeta.size).toBe(70);
});

test('upload_image reads base64 from a playground file', async () => {
    await startMcpServer();

    const now = Date.now();
    const seed = await fetch('http://localhost:4173/api/mcp/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entries: [
                {
                    fileId: 'b64-file',
                    fileName: 'diagram.txt',
                    content: IMAGE_BASE64,
                    language: 'plaintext',
                    parentId: null,
                    type: 'editor',
                    lastUpdated: now
                }
            ],
            tombstones: []
        })
    });
    expect(seed.ok).toBeTruthy();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const upload = await client.callTool({
        name: 'upload_image',
        arguments: { path: 'diagram.txt' }
    });
    expect(upload.isError).toBeFalsy();
    const uploadMeta = JSON.parse(upload.content[0].text) as { link: string; mimeType: string };
    expect(uploadMeta.link.startsWith('cojudge://image/')).toBeTruthy();

    const read = await client.callTool({
        name: 'read_image',
        arguments: { link: uploadMeta.link }
    });
    expect(read.isError).toBeFalsy();
    const imageBlock = read.content.find((block) => block.type === 'image');
    expect(imageBlock.data).toBe(IMAGE_BASE64);
    await client.close();
});

test('upload_image rejects garbage payloads and unknown paths', async () => {
    await startMcpServer();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const garbage = await client.callTool({
        name: 'upload_image',
        arguments: { data: 'not base64 at all!' }
    });
    expect(garbage.isError).toBeTruthy();

    const missingPath = await client.callTool({
        name: 'upload_image',
        arguments: { path: 'nope.txt' }
    });
    expect(missingPath.isError).toBeTruthy();

    const neither = await client.callTool({
        name: 'upload_image',
        arguments: {}
    });
    expect(neither.isError).toBeTruthy();
    await client.close();
});

test('an uploaded image renders in the user\'s open note', async ({ page }) => {
    await page.goto('/playground');
    await page.evaluate(() => {
        localStorage.removeItem('user-settings');
        localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify([]) }));
        localStorage.setItem(
            'mcp-server-settings',
            JSON.stringify({
                running: true,
                permissions: { read: true, write: true, create: true, delete: false, includeHidden: false }
            })
        );
    });
    await page.reload();

    await expect
        .poll(async () => {
            const res = await fetch('http://localhost:4173/api/mcp/state');
            return (await res.json()).running;
        })
        .toBe(true);

    // Agent uploads the image and writes a note that references it.
    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const upload = await client.callTool({
        name: 'upload_image',
        arguments: { data: IMAGE_DATA_URL }
    });
    expect(upload.isError).toBeFalsy();
    const link = (JSON.parse(upload.content[0].text) as { link: string }).link;
    const write = await client.callTool({
        name: 'write_file',
        arguments: { path: 'note.md', content: `# Note\n\n![diagram](${link})\n` }
    });
    expect(write.isError).toBeFalsy();
    await client.close();

    // The note opens as a tab; activate it so the WYSIWYG renders, then the
    // pasted image resolves to the data URL once the browser pulls the
    // uploaded image into IndexedDB.
    const noteTab = page.getByRole('tab', { name: /note\.md/ });
    await expect(noteTab).toBeVisible({ timeout: 20000 });
    await noteTab.click();
    await expect(page.locator('img[data-cojudge-img]')).toHaveAttribute('src', /^data:image\/png/, {
        timeout: 20000
    });
});
