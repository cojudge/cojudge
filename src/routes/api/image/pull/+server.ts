import { getPullStatus, startPull, cancelPull } from '$lib/server/imagePuller';
import { json } from '@sveltejs/kit';
import Dockerode from 'dockerode';
import type { RequestHandler } from './$types';
import { javaImage } from '$lib/utils/javaUtil';
import { pythonImage } from '$lib/utils/pythonUtil';
import { cppImage } from '$lib/utils/cppUtil';
import { csharpImage } from '$lib/utils/csharpUtil';

const docker = new Dockerode();

function imageForLanguage(language: string) {
    if (language === 'java') return javaImage;
    if (language === 'python') return pythonImage;
    if (language === 'cpp') return cppImage;
    if (language === 'csharp') return csharpImage;
    return null;
}

export const GET: RequestHandler = async ({ url }) => {
    const language = url.searchParams.get('language') || '';
    const status = getPullStatus(language);
    return json({ pulling: !!status, ...status });
};

export const POST: RequestHandler = async ({ request }) => {
    const { language } = await request.json();
    const image = imageForLanguage(language);
    if (!image) {
        return json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }
    try {
        // Just start it and return
        startPull(language).catch(err => {
            console.error(`Failed to pull image for ${language}:`, err);
        });
        return json({ started: true });
    } catch (err: any) {
        return json({ error: 'Failed to start pull', details: String(err?.message ?? err) }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { language } = await request.json();
    cancelPull(language);
    return json({ cancelled: true });
};
