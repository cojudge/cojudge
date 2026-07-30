import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { data } = await request.json();
        if (!data) {
            return json({ error: 'Missing data' }, { status: 400 });
        }

        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `cojudge-localStorage-backup-${ts}.json`;

        const homeDir = os.homedir();
        let targetDir = path.join(homeDir, 'Downloads');

        try {
            await fs.access(targetDir);
        } catch {
            targetDir = homeDir;
        }

        const filePath = path.join(targetDir, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return json({ success: true, filePath });
    } catch (error: any) {
        console.error('Failed to export progress on desktop:', error);
        return json({ error: error.message || 'Failed to export progress' }, { status: 500 });
    }
};
