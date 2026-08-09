import { mcpManager } from '$lib/server/mcp/manager';

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID, Accept',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Last-Event-ID'
};

function corsPreflight(): Response {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

function addCors(response: Response): Response {
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

export const OPTIONS = () => corsPreflight();

export const GET = async ({ request }) => addCors(await mcpManager.handleProtocolRequest(request));

export const POST = async ({ request }) => addCors(await mcpManager.handleProtocolRequest(request));

export const DELETE = async ({ request }) => addCors(await mcpManager.handleProtocolRequest(request));
