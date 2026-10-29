<script lang="ts">
    import { saveStatus } from '$lib/stores/saveStatus';
    import { fade } from 'svelte/transition';
    import Tooltip from "./Tooltip.svelte";
</script>

{#if $saveStatus !== 'idle'}
    <Tooltip text={$saveStatus === 'saving' ? 'Сохранение в локальное хранилище' : 'Сохранено в локальном хранилище'}>
        <span 
            class="save-status" 
            class:saving={$saveStatus === 'saving'}
            class:saved={$saveStatus === 'saved'}
            transition:fade={{ duration: 200 }}
        >
            {$saveStatus === 'saving' ? 'Сохранение' : 'Сохранено'}
        </span>
    </Tooltip>
{/if}

<style>
    .save-status {
        font-size: 0.85rem;
        transition: color 0.2s ease;
        user-select: none;
    }
    .saving {
        color: var(--color-text-secondary);
    }
    .saved {
        color: var(--color-text-secondary);
    }
</style>
