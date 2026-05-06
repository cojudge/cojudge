import { cppImage } from '$lib/utils/cppUtil';
import { csharpImage } from '$lib/utils/csharpUtil';
import { javaImage } from '$lib/utils/javaUtil';
import { pythonImage } from '$lib/utils/pythonUtil';
import { getPullStatus } from '$lib/server/imagePuller';
import { json } from '@sveltejs/kit';
import Dockerode from 'dockerode';
import type { RequestHandler } from './$types';

const docker = new Dockerode();

function imageForLanguage(language: string) {
    if (language === 'java') return { image: javaImage, language };
    if (language === 'python') return { image: pythonImage, language };
    if (language === 'cpp') return { image: cppImage, language };
    if (language === 'csharp') return { image: csharpImage, language };
    return null;
}

export const GET: RequestHandler = async ({ url }) => {
    const language = url.searchParams.get('language') || '';
    const mapping = imageForLanguage(language);
    if (!mapping) {
        return json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }
    const pullStatus = getPullStatus(language);
    try {
        await docker.getImage(mapping.image).inspect();
        return json({ present: true, image: mapping.image, language: mapping.language, pulling: !!pullStatus, ...pullStatus });
    } catch (err: any) {
        const notFound = err?.statusCode === 404 || /no such image/i.test(String(err?.message ?? ''));
        if (notFound) {
            return json({ present: false, image: mapping.image, language: mapping.language, pulling: !!pullStatus, ...pullStatus });
        }
        return json({ error: 'Failed to check image status', pulling: !!pullStatus, ...pullStatus }, { status: 500 });
    }
};
