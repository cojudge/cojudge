import { startCleanupCron, stopCleanupCron } from '$lib/server/cleanup';
import process from 'node:process';

declare global {
    var __cleanup_cron_started: boolean | undefined;
    var __cojudge_shutdown_registered: boolean | undefined;
    var __cojudgeShutdown: (() => Promise<void>) | undefined;
}

// Prevent multiple cron jobs in development
if (!globalThis.__cleanup_cron_started) {
    startCleanupCron();
    globalThis.__cleanup_cron_started = true;
}

globalThis.__cojudgeShutdown = stopCleanupCron;
if (!globalThis.__cojudge_shutdown_registered) {
    process.once('sveltekit:shutdown', () => void stopCleanupCron());
    globalThis.__cojudge_shutdown_registered = true;
}
