import { json } from '@sveltejs/kit';
import { mcpManager } from '$lib/server/mcp/manager';
import type { McpTabState } from '$lib/mcp/types';

export const POST = async ({ request }) => {
    if (!mcpManager.isRunning()) {
        return json({ error: 'MCP server is stopped.' }, { status: 503 });
    }
    let state: McpTabState;
    try {
        state = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    if (!Array.isArray(state?.openTabs)) {
        return json({ error: 'Missing openTabs array.' }, { status: 400 });
    }
    mcpManager.setTabState({
        activeTabId: typeof state.activeTabId === 'string' ? state.activeTabId : null,
        openTabs: state.openTabs
    });
    return json(mcpManager.getState());
};
