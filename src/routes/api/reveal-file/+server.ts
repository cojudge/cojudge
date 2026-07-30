import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exec } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { filePath } = await request.json();
        if (!filePath) {
            return json({ error: 'Missing filePath' }, { status: 400 });
        }

        const platform = os.platform();
        if (platform === 'win32') {
            exec(`explorer.exe /select,"${filePath}"`);
        } else if (platform === 'darwin') {
            exec(`open -R "${filePath}"`);
        } else {
            const dirPath = path.dirname(filePath);
            exec(`xdg-open "${dirPath}"`);
        }

        return json({ success: true });
    } catch (error: any) {
        console.error('Failed to reveal file:', error);
        return json({ error: error.message || 'Failed to reveal file' }, { status: 500 });
    }
};
