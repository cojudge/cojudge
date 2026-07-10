<script lang="ts">
    import { onDestroy } from 'svelte';

    export let startTime: number;

    let elapsed = 0;
    let interval: ReturnType<typeof setInterval>;

    function tick() {
        elapsed = Math.floor((Date.now() - startTime) / 1000);
    }

    tick();
    interval = setInterval(tick, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });

    $: minutes = Math.floor(elapsed / 60);
    $: seconds = elapsed % 60;
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
