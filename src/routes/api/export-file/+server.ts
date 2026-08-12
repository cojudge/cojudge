import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { base64Data, textData, filename } = await request.json();
        if (typeof filename !== 'string' || !filename.trim()) {
            return json({ error: 'Missing filename' }, { status: 400 });
        }

        const homeDir = os.homedir();
        let targetDir = path.join(homeDir, 'Downloads');

        try {
            await fs.access(targetDir);
        } catch {
            targetDir = homeDir;
        }

        const safeFilename =
            path.basename(filename)
                .replace(/["\u201C\u201D\u201E\u201F\uFF02]/g, '"')
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
                .trim()
                .slice(0, 200) || 'export.json';
        const filePath = path.join(targetDir, safeFilename);

        if (textData !== undefined) {
            await fs.writeFile(filePath, textData, 'utf8');
        } else if (base64Data !== undefined) {
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.writeFile(filePath, buffer);
        } else {
            return json({ error: 'Missing file data' }, { status: 400 });
        }

        return json({ success: true, filePath });
    } catch (error: any) {
        console.error('Failed to export file on desktop:', error);
        return json({ error: error.message || 'Failed to export file' }, { status: 500 });
    }
};
