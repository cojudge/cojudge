import { json } from '@sveltejs/kit';
import { mcpManager } from '$lib/server/mcp/manager';
import type { McpFilePush } from '$lib/mcp/types';

export const GET = async () => {
    if (!mcpManager.isRunning()) {
        return json({ error: 'MCP server is stopped.' }, { status: 503 });
    }
    return json(mcpManager.getSnapshot());
};

export const POST = async ({ request }) => {
    if (!mcpManager.isRunning()) {
        return json({ error: 'MCP server is stopped.' }, { status: 503 });
    }
    let push: McpFilePush;
    try {
        push = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    if (!Array.isArray(push?.entries)) {
        return json({ error: 'Missing entries array.' }, { status: 400 });
    }
    mcpManager.syncClientFiles({
        entries: push.entries,
        tombstones: Array.isArray(push.tombstones) ? push.tombstones : [],
        images:
            push.images && typeof push.images === 'object' && !Array.isArray(push.images) ? push.images : {}
    });
    return json(mcpManager.getState());
};
