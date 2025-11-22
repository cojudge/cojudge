import type Dockerode from "dockerode";

export type JobStatus = 'pending' | 'preparing' | 'running' | 'completed' | 'error' | 'judging';

export function getDifficultyClass(difficulty: string) {
    if (!difficulty) return '';
    return `difficulty-${difficulty.toLowerCase()}`;
}

export type Param = {
    name: string;
    type: string;
};

export type ProgrammingLanguage = 'java' | 'python' | 'cpp';

export const LINUX_TIMEOUT_CODE = 124;

export const EXECUTION_TIMEOUT_SECONDS = '30';

export const TIMEOUT_MESSAGE = 'TIMEOUT';

export async function ensureImageAvailable(docker: Dockerode, image: string) {
    try {
        await docker.getImage(image).inspect();
        return;
    } catch (err: any) {
        const notFound = err?.statusCode === 404 || /no such image/i.test(String(err?.message ?? ''));
        if (!notFound) throw err;
        await new Promise<void>((resolve, reject) => {
            docker.pull(image, (pullErr: any, stream: any) => {
                if (pullErr) return reject(pullErr);
                (docker as any).modem.followProgress(
                    stream,
                    (doneErr: any) => (doneErr ? reject(doneErr) : resolve()),
                    () => {}
                );
            });
        });
    }
}