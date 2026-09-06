import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { ensureUserContentSeeded, resolveProblemDir } from '$lib/server/contentPaths';

const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

export const GET: RequestHandler = async ({ params }) => {
    await ensureUserContentSeeded();
    // Serve from ~/cojudge/problems/<slug> first, bundled copy as fallback.
    const baseDir = await resolveProblemDir(params.slug);
    const assetPath = path.join(baseDir, params.path);

    if (!path.resolve(assetPath).startsWith(path.resolve(baseDir))) {
        throw error(403, 'Forbidden');
    }

    try {
        const data = await fs.readFile(assetPath);
        const ext = path.extname(assetPath).toLowerCase();
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
        return new Response(data, {
            headers: { 'Content-Type': mimeType },
        });
    } catch {
        throw error(404, 'Not found');
    }
};
