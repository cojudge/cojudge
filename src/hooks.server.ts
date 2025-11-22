import { startCleanupCron } from '$lib/server/cleanup';

// Prevent multiple cron jobs in development
if (!(globalThis as any).__cleanup_cron_started) {
    startCleanupCron();
    (globalThis as any).__cleanup_cron_started = true;
}
