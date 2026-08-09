<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let x = 0;
    export let y = 0;
    export let closeDisabled = false;
    export let closeLeftDisabled = false;
    export let closeRightDisabled = false;
    export let closeOthersDisabled = false;
    export let renameDisabled = false;

    const dispatch = createEventDispatcher<{
        close: void;
        closeLeft: void;
        closeRight: void;
        closeOthers: void;
        rename: void;
    }>();
</script>

<div
    class="tab-context-menu"
    role="menu"
    aria-label="Tab actions"
    tabindex="-1"
    style="left: {x}px; top: {y}px;"
    on:contextmenu|preventDefault|stopPropagation
>
    <button
        type="button"
        class="tab-context-menu-item"
        role="menuitem"
        disabled={closeDisabled}
        on:click={() => dispatch('close')}
    >Close</button>
    <button
        type="button"
        class="tab-context-menu-item"
        role="menuitem"
        disabled={closeLeftDisabled}
        on:click={() => dispatch('closeLeft')}
    >Close Left</button>
    <button
        type="button"
        class="tab-context-menu-item"
        role="menuitem"
        disabled={closeRightDisabled}
        on:click={() => dispatch('closeRight')}
    >Close Right</button>
    <button
        type="button"
        class="tab-context-menu-item"
        role="menuitem"
        disabled={closeOthersDisabled}
        on:click={() => dispatch('closeOthers')}
    >Close Others</button>
    <div class="tab-context-menu-separator" role="separator"></div>
    <button
        type="button"
        class="tab-context-menu-item"
        role="menuitem"
        disabled={renameDisabled}
        on:click={() => dispatch('rename')}
    >Rename</button>
</div>

<style>
    .tab-context-menu {
        position: fixed;
        min-width: 160px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        z-index: 1001;
        padding: 4px;
        display: flex;
        flex-direction: column;
    }

    .tab-context-menu-item {
        width: 100%;
        background: transparent;
        border: none;
        color: var(--color-text);
        text-align: left;
        padding: 8px 10px;
        border-radius: 4px;
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
        white-space: nowrap;
    }

    .tab-context-menu-item:hover:not(:disabled) {
        background-color: var(--color-second-bg);
    }

    .tab-context-menu-item:disabled {
        color: var(--color-text-secondary);
        cursor: default;
        opacity: 0.45;
    }

    .tab-context-menu-separator {
        height: 1px;
        margin: 4px 0;
        background-color: var(--color-border);
    }
</style>
