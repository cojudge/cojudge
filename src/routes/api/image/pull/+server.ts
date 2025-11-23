import { cppImage } from '$lib/utils/cppUtil';
import { csharpImage } from '$lib/utils/csharpUtil';
import { javaImage } from '$lib/utils/javaUtil';
import { pythonImage } from '$lib/utils/pythonUtil';
import { ensureImageAvailable } from '$lib/utils/util';
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

export const POST: RequestHandler = async ({ request }) => {
    const { language } = await request.json();
    const mapping = imageForLanguage(language);
    if (!mapping) {
        return json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }
    try {
        // Ensure the marker image (i.e. javaImage) exists
        ensureImageAvailable(docker, javaImage);
        // If it already exists, return early
        try {
            await docker.getImage(mapping.image).inspect();
            return json({ pulled: false, present: true, image: mapping.image });
        } catch {}
        const result = await new Promise<{ pulled: boolean }>((resolve, reject) => {
            docker.pull(mapping.image, (err: any, stream: any) => {
                if (err) return reject(err);
                (docker as any).modem.followProgress(
                    stream,
                    (doneErr: any) => (doneErr ? reject(doneErr) : resolve({ pulled: true })),
                    () => {}
                );
            });
        });
        return json({ pulled: result.pulled, present: true, image: mapping.image });
    } catch (err: any) {
        return json({ error: 'Failed to pull image', details: String(err?.message ?? err) }, { status: 500 });
    }
};
