import { json } from '@sveltejs/kit';
import { mcpManager } from '$lib/server/mcp/manager';
import type { McpPermissions, McpStateAction } from '$lib/mcp/types';

export const GET = async () => json(mcpManager.getState());

export const POST = async ({ request }) => {
    let body: McpStateAction;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const action = (body as { action?: string })?.action ?? '';
    const permissions = (body as { permissions?: McpPermissions }).permissions;
    switch (action) {
        case 'start':
            await mcpManager.start();
            break;
        case 'stop':
            await mcpManager.stop();
            break;
        case 'restart':
            await mcpManager.restart();
            break;
        case 'setPermissions':
            if (!permissions) {
                return json({ error: 'Missing permissions.' }, { status: 400 });
            }
            mcpManager.setPermissions(permissions);
            break;
        default:
            return json({ error: `Unknown action "${action}".` }, { status: 400 });
    }
    return json(mcpManager.getState());
};
