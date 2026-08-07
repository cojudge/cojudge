import { expect, test } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'http://localhost:4173/mcp';

const IMAGE_BASE64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const IMAGE_LINK = 'cojudge://image/img-1';
const IMAGE_DATA_URL = `data:image/png;base64,${IMAGE_BASE64}`;

async function seedServerWithImage(): Promise<void> {
    const stateRes = await fetch('http://localhost:4173/api/mcp/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
    });
    expect(stateRes.ok).toBeTruthy();

    const now = Date.now();
    const pushRes = await fetch('http://localhost:4173/api/mcp/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            entries: [
                {
                    fileId: 'note-a',
                    fileName: 'note.md',
                    content: `# Design\n\n![diagram](${IMAGE_LINK})\n`,
                    language: 'markdown',
                    parentId: null,
                    type: 'editor',
                    lastUpdated: now
                }
            ],
            tombstones: [],
            images: { [IMAGE_LINK]: IMAGE_DATA_URL }
        })
    });
    expect(pushRes.ok).toBeTruthy();
}

test('read_image returns the pasted image for a known reference', async () => {
    await seedServerWithImage();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const result = await client.callTool({
        name: 'read_image',
        arguments: { link: IMAGE_LINK }
    });
    await client.close();

    expect(result.isError).toBeFalsy();
    const textBlock = result.content.find((block) => block.type === 'text');
    expect(textBlock).toBeDefined();
    const metadata = JSON.parse(textBlock.text) as { link: string; mimeType: string; size: number };
    expect(metadata.link).toBe(IMAGE_LINK);
    expect(metadata.mimeType).toBe('image/png');
    expect(metadata.size).toBe(IMAGE_BASE64.length);

    const imageBlock = result.content.find((block) => block.type === 'image');
    expect(imageBlock).toBeDefined();
    expect(imageBlock.mimeType).toBe('image/png');
    expect(imageBlock.data).toBe(IMAGE_BASE64);
});

test('read_image fails cleanly for an unknown reference', async () => {
    await seedServerWithImage();

    const client = new Client({ name: 'e2e', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
    const result = await client.callTool({
        name: 'read_image',
        arguments: { link: 'cojudge://image/does-not-exist' }
    });
    await client.close();

    expect(result.isError).toBeTruthy();
    const textBlock = result.content.find((block) => block.type === 'text');
    expect(textBlock).toBeDefined();
    expect(textBlock.text).toContain('not available');
});
