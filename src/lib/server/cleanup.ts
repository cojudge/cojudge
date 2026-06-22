import { EXECUTION_TIMEOUT_SECONDS } from '$lib/utils/util';
import Dockerode from 'dockerode';
import ContainerPool from '$lib/runners/ContainerPool';

const docker = new Dockerode();
const TIMEOUT_MS = (parseInt(EXECUTION_TIMEOUT_SECONDS) + 10) * 1000;

export function startCleanupCron() {
    console.log('Starting container cleanup cron job...');
    cleanupContainers();
    setInterval(cleanupContainers, 60 * 1000);
}

async function cleanupContainers() {
    try {
        // Clean stale containers from the pool (idle > 5 minutes)
        await ContainerPool.cleanupStale(300000);

        // Clean any orphaned containers (not in pool) older than 5 minutes
        const containers = await docker.listContainers({
            all: true,
            filters: {
                label: ['cojudge.created=true']
            }
        });

        const now = Date.now();
        for (const containerInfo of containers) {
            const createdTime = containerInfo.Created * 1000;
            const age = now - createdTime;

            if (age > TIMEOUT_MS && !ContainerPool.hasContainer(containerInfo.Id)) {
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
