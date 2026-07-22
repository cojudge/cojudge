import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

export const GET: RequestHandler = async ({ params }) => {
    const assetPath = path.resolve('problems', params.slug, params.path);
    const baseDir = path.resolve('problems', params.slug);

    if (!assetPath.startsWith(baseDir)) {
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
