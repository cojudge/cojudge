import { startCleanupCron, stopCleanupCron } from '$lib/server/cleanup';
import { ensureUserContentSeeded } from '$lib/server/contentPaths';
import process from 'node:process';

// Seed ~/cojudge/problems + ~/cojudge/courses from the bundled content on
// first start. Missing files only — never overwrites user edits.
void ensureUserContentSeeded();

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
