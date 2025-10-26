import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Dockerode from 'dockerode';
import { javaImage } from '$lib/utils/javaUtil';
import { pythonImage } from '$lib/utils/pythonUtil';
import { cppImage } from '$lib/utils/cppUtil';

const docker = new Dockerode();

function imageForLanguage(language: string) {
    if (language === 'java') return { image: javaImage, language };
    if (language === 'python') return { image: pythonImage, language };
    if (language === 'cpp') return { image: cppImage, language };
    return null;
}

export const GET: RequestHandler = async ({ url }) => {
    const language = url.searchParams.get('language') || '';
    const mapping = imageForLanguage(language);
    if (!mapping) {
        return json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }
    try {
        await docker.getImage(mapping.image).inspect();
        return json({ present: true, image: mapping.image, language: mapping.language });
    } catch (err: any) {
        const notFound = err?.statusCode === 404 || /no such image/i.test(String(err?.message ?? ''));
        if (notFound) {
            return json({ present: false, image: mapping.image, language: mapping.language });
        }
        return json({ error: 'Failed to check image status' }, { status: 500 });
    }
};
