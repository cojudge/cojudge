import { EXECUTION_TIMEOUT_SECONDS } from '$lib/utils/util';
import Dockerode from 'dockerode';

const docker = new Dockerode();
// Add a buffer to the timeout to avoid race conditions with running jobs
const TIMEOUT_MS = (parseInt(EXECUTION_TIMEOUT_SECONDS) + 10) * 1000;

export function startCleanupCron() {
    console.log('Starting container cleanup cron job...');
    
    // Run immediately on startup
    cleanupContainers();

    // Run every minute
    setInterval(cleanupContainers, 60 * 1000);
}

async function cleanupContainers() {
    try {
        const containers = await docker.listContainers({
            all: true,
            filters: {
                label: ['cojudge.created=true']
            }
        });

        const now = Date.now();

        for (const containerInfo of containers) {
            // Created is in seconds
            const createdTime = containerInfo.Created * 1000;
            const age = now - createdTime;

            if (age > TIMEOUT_MS) {
                const container = docker.getContainer(containerInfo.Id);
                try {
                    console.log(`Cleaning up container ${containerInfo.Id} (age: ${age}ms)`);
                    if (containerInfo.State === 'running') {
                        await container.stop();
                    }
                    await container.remove({ force: true });
                } catch (err) {
                    console.error(`Failed to cleanup container ${containerInfo.Id}:`, err);
                }
            }
        }
    } catch (err) {
        console.error('Error in container cleanup cron:', err);
    }
}
