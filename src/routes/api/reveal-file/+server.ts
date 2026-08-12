import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execFile } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { filePath } = await request.json();
        if (typeof filePath !== 'string' || !filePath.trim()) {
            return json({ error: 'Missing filePath' }, { status: 400 });
        }

        const platform = os.platform();
        if (platform === 'win32') {
            execFile('explorer.exe', ['/select,' + filePath]);
        } else if (platform === 'darwin') {
            execFile('open', ['-R', filePath]);
        } else {
            const dirPath = path.dirname(filePath);
            execFile('xdg-open', [dirPath]);
        }

        return json({ success: true });
    } catch (error: any) {
        console.error('Failed to reveal file:', error);
        return json({ error: error.message || 'Failed to reveal file' }, { status: 500 });
    }
};
