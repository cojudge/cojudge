import { beginExecutionShutdown, EXECUTION_TIMEOUT_SECONDS } from '$lib/utils/util';
import { containerSessionId } from '$lib/server/containerSession';
import Dockerode from 'dockerode';
import ContainerPool from '$lib/runners/ContainerPool';

const docker = new Dockerode();
const TIMEOUT_MS = (parseInt(EXECUTION_TIMEOUT_SECONDS) + 10) * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | undefined;
let shutdownPromise: Promise<void> | undefined;

export function startCleanupCron() {
    if (cleanupTimer) return;
    console.log('Starting container cleanup cron job...');
    void cleanupContainers();
    cleanupTimer = setInterval(cleanupContainers, 60 * 1000);
}

export function stopCleanupCron(): Promise<void> {
    shutdownPromise ??= shutdownContainers();
    return shutdownPromise;
}

async function shutdownContainers() {
    beginExecutionShutdown();
    ContainerPool.beginShutdown();
    if (cleanupTimer) {
        clearInterval(cleanupTimer);
        cleanupTimer = undefined;
    }

    await ContainerPool.destroyAll();
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const containers = await docker.listContainers({
                all: true,
                filters: {
                    label: ['cojudge.created=true', `cojudge.session=${containerSessionId}`]
                }
            });
            await Promise.allSettled(
                containers.map(({ Id }) => docker.getContainer(Id).remove({ force: true }))
            );
        } catch (err) {
            console.error('Failed to remove containers during shutdown:', err);
        }
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

async function cleanupContainers() {
    try {
        console.log(`[cleanup] running at ${new Date().toISOString()}`);
        console.log(`[cleanup] pool stats: ${JSON.stringify(ContainerPool.getStats())}`);

        // Clean stale containers from the pool (idle > 5 minutes)
        await ContainerPool.cleanupStale(300000);

        // Clean any orphaned containers (not in pool) older than 5 minutes
        const containers = await docker.listContainers({
            all: true,
            filters: {
                // Age checks below make cross-session cleanup safe and reclaim crash leftovers.
                label: ['cojudge.created=true']
            }
        });

        const now = Date.now();
        for (const containerInfo of containers) {
            const createdTime = containerInfo.Created * 1000;
            const age = now - createdTime;
            const inPool = ContainerPool.hasContainer(containerInfo.Id);
            const isDebug = containerInfo.Labels && containerInfo.Labels['cojudge.debug'] === 'true';
            console.log(`[cleanup] container ${containerInfo.Id.substring(0, 12)} age=${age}ms inPool=${inPool} debug=${isDebug} image=${containerInfo.Image}`);

            const maxAge = isDebug ? 300000 : TIMEOUT_MS;
            if (age > maxAge && !inPool) {
                const container = docker.getContainer(containerInfo.Id);
                try {
                    console.log(`Cleaning up orphaned container ${containerInfo.Id.substring(0, 12)} (age: ${age}ms)`);
                    if (containerInfo.State === 'running') {
                        await container.stop({ t: 1 });
                    }
                    await container.remove({ force: true });
                } catch (err) {
                    console.error(`Failed to cleanup container ${containerInfo.Id.substring(0, 12)}:`, err);
                }
            }
        }
    } catch (err) {
        console.error('Error in container cleanup cron:', err);
    }
}
