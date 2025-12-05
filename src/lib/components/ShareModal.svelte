<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let url: string;
    export let qrCodeDataUrl: string;

    let copied = false;
    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

    function generateNew() {
        dispatch('generateNew');
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(url);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 3000);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-backdrop" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
        <h3>Share</h3>
        <p class="info-text">Latest changes saved to the following url:</p>
        <div class="url-container">
            <input type="text" readonly value={url} />
            <button on:click={copyToClipboard}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
        {#if qrCodeDataUrl}
            <div class="qr-container">
                <img src={qrCodeDataUrl} alt="QR Code" />
            </div>
        {/if}
        <button class="generate-btn" on:click={generateNew}>Generate New Link</button>
        <button class="close-btn" on:click={close}>Close</button>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--color-bg);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        color: var(--color-text);
    }

    h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    .info-text {
        margin: 0;
        font-size: 0.7rem;
        color: var(--color-text-secondary);
    }

    .url-container {
        display: flex;
        gap: 8px;
    }

    input {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        padding: 4px 8px;
        border-radius: 4px;
    }

    button {
        cursor: pointer;
        padding: 4px 12px;
        background: var(--color-highlight);
        color: white;
        border: none;
        border-radius: 4px;
    }

    .qr-container {
        display: flex;
        justify-content: center;
        background: white;
        padding: 10px;
        border-radius: 4px;
    }

    .qr-container img {
        width: 150px;
        height: 150px;
    }

    .close-btn {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }
    
    .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .generate-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--color-highlight);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-weight: 500;
    }
    .generate-btn:hover {
        opacity: 0.9;
    }
</style>
