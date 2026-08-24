<script lang="ts">
    import { onDestroy } from 'svelte';

    export let startTime: number;
    export let stopped = false;
    export let countdownSeconds: number | null = null;
    export let onExpired: (() => void) | null = null;

    let elapsed = 0;
    let expired = false;
    let interval: ReturnType<typeof setInterval>;

    function tick() {
        elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (countdownSeconds !== null && elapsed >= countdownSeconds && !expired) {
            expired = true;
            onExpired?.();
        }
    }

    tick();
    interval = setInterval(tick, 1000);

    $: if (stopped && interval) {
        clearInterval(interval);
        interval = null as any;
    }

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });

    $: remaining = countdownSeconds === null ? elapsed : Math.max(0, countdownSeconds - elapsed);
    $: minutes = Math.floor(remaining / 60);
    $: seconds = remaining % 60;
    $: display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
</script>

<span class="timer">{display}</span>

<style>
    .timer {
        font-family: var(--font-mono, monospace);
        font-size: 0.85rem;
        font-variant-numeric: tabular-nums;
        color: var(--color-text-secondary);
        user-select: none;
        margin-right: 12px;
        display: inline-flex;
        align-items: center;
        line-height: 1.2;
    }
</style>
