import { json } from '@sveltejs/kit';
import { mcpManager } from '$lib/server/mcp/manager';

/**
 * Pasted-image payloads the client does not have yet. The client passes the
 * revision it already knows via `?since=`: the full image map is only
 * returned when the revision moved, keeping the poll cheap.
 */
export const GET = async ({ url }) => {
    if (!mcpManager.isRunning()) {
        return json({ error: 'MCP server is stopped.' }, { status: 503 });
    }
    const since = Number(url.searchParams.get('since') ?? -1);
    const revision = mcpManager.getImagesRevision();
    return json({
        revision,
        images: revision !== since ? mcpManager.getImages() : undefined
    });
};
