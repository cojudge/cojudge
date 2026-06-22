import Dockerode from 'dockerode';
import { javaImage } from '$lib/utils/javaUtil';
import { pythonImage } from '$lib/utils/pythonUtil';
import { cppImage } from '$lib/utils/cppUtil';
import { csharpImage } from '$lib/utils/csharpUtil';
import { rustImage } from '$lib/utils/rustUtil';
import { goImage } from '$lib/utils/goUtil';

const docker = new Dockerode();

interface PullStatus {
    progress: number; // 0 to 1
    status: string;
    cancelled: boolean;
    stream?: any;
}

const pulls = new Map<string, PullStatus>();

function imageForLanguage(language: string) {
    if (language === 'java') return javaImage;
    if (language === 'python') return pythonImage;
    if (language === 'cpp') return cppImage;
    if (language === 'csharp') return csharpImage;
    if (language === 'rust') return rustImage;
    if (language === 'go') return goImage;
    return null;
}

export function getPullStatus(language: string) {
    const status = pulls.get(language);
    if (!status) return null;
    return { progress: status.progress, status: status.status };
}

export async function startPull(language: string) {
    const image = imageForLanguage(language);
    if (!image) throw new Error(`Unsupported language: ${language}`);

    if (pulls.has(language)) return;

    const pullStatus: PullStatus = {
        progress: 0,
        status: 'Starting',
        cancelled: false
    };
    pulls.set(language, pullStatus);

    try {
        await new Promise<void>((resolve, reject) => {
            docker.pull(image, (err: any, stream: any) => {
                if (err) {
                    pulls.delete(language);
                    return reject(err);
                }
                pullStatus.stream = stream;

                const progressMap = new Map<string, { current: number, total: number }>();

                (docker as any).modem.followProgress(
                    stream,
                    (doneErr: any) => {
                        pulls.delete(language);
                        if (doneErr) reject(doneErr);
                        else resolve();
                    },
                    (event: any) => {
                        if (pullStatus.cancelled) {
                            stream.destroy();
                            return;
                        }
                        
                        if (event.id && event.progressDetail && event.progressDetail.total) {
                            progressMap.set(event.id, {
                                current: event.progressDetail.current,
                                total: event.progressDetail.total
                            });
                            
                            let totalCurrent = 0;
                            let totalSize = 0;
                            for (const p of progressMap.values()) {
                                totalCurrent += p.current;
                                totalSize += p.total;
                            }
                            if (totalSize > 0) {
                                pullStatus.progress = totalCurrent / totalSize;
                            }
                        }
                        pullStatus.status = event.status || pullStatus.status;
                    }
                );
            });
        });
    } catch (err) {
        pulls.delete(language);
        throw err;
    }
}

export function cancelPull(language: string) {
    const status = pulls.get(language);
    if (status) {
        status.cancelled = true;
        if (status.stream) {
            status.stream.destroy();
        }
        pulls.delete(language);
    }
}
