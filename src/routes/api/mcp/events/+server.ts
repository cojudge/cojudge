import { mcpManager } from '$lib/server/mcp/manager';

const POLL_INTERVAL_MS = 500;
const HEARTBEAT_INTERVAL_MS = 15000;

function send(controller: ReadableStreamDefaultController<Uint8Array>, encoder: TextEncoder, name: string, data: unknown): void {
    try {
        controller.enqueue(encoder.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`));
    } catch {
        // Stream already closed; the abort handler stops the timers.
    }
}

/**
 * Server-Sent Events stream broadcasting MCP server changes to the UI.
 *
 * Emits "files-changed" whenever the file snapshot revision moves (agent
 * writes, client pushes, deletes) and "state-changed" when the server
 * starts/stops. The UI uses this to pull the snapshot instantly instead of
 * waiting for its polling interval.
 *
 * The stream stays open while the server is stopped so start/stop transitions
 * are always delivered; a heartbeat keeps proxies from dropping the idle
 * connection.
 */
export const GET = ({ request }): Response => {
    let lastRevision = mcpManager.getState().revision;
    let lastImagesRevision = mcpManager.getImagesRevision();
    let lastRunning = mcpManager.isRunning();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            send(controller, encoder, 'hello', mcpManager.getState());

            const poll = setInterval(() => {
                const state = mcpManager.getState();
                if (state.running !== lastRunning) {
                    lastRunning = state.running;
                    send(controller, encoder, 'state-changed', { running: state.running });
                }
                if (state.revision !== lastRevision) {
                    lastRevision = state.revision;
                    send(controller, encoder, 'files-changed', {
                        revision: state.revision,
                        fileCount: state.fileCount
                    });
                }
                const imagesRevision = mcpManager.getImagesRevision();
                if (imagesRevision !== lastImagesRevision) {
                    lastImagesRevision = imagesRevision;
                    send(controller, encoder, 'images-changed', { revision: imagesRevision });
                }
            }, POLL_INTERVAL_MS);

            const heartbeat = setInterval(() => {
                send(controller, encoder, 'ping', {});
            }, HEARTBEAT_INTERVAL_MS);

            request.signal.addEventListener('abort', () => {
                clearInterval(poll);
                clearInterval(heartbeat);
                try {
                    controller.close();
                } catch {
                    // already closed
                }
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive'
        }
    });
};
