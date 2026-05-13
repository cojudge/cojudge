<script lang="ts">
    import { saveStatus } from '$lib/stores/saveStatus';
    import { fade } from 'svelte/transition';
    import Tooltip from "./Tooltip.svelte";
</script>

{#if $saveStatus !== 'idle'}
    <Tooltip text={`${$saveStatus === 'saving' ? 'Saving' : 'Saved'} to local storage`}>
        <span 
            class="save-status" 
            class:saving={$saveStatus === 'saving'}
            class:saved={$saveStatus === 'saved'}
            transition:fade={{ duration: 200 }}
        >
            {$saveStatus === 'saving' ? 'Saving' : 'Saved'}
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
