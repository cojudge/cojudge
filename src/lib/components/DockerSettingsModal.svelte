<script lang="ts">
    import { tick } from 'svelte';
    import { browser } from '$app/environment';

    export let open = false;
    export let onClose: () => void = () => {};
    export let onSaved: () => void = () => {};

    let modalCard: HTMLElement | null = null;
    let runtimeSelect: HTMLSelectElement | null = null;
    let selection = 'auto';
    let options: { id: string; label: string }[] = [];
    let busy = false;
    let testing = false;
    let error = '';
    let saved = false;
    let development = false;
    let testResult: { success: boolean; message: string } | null = null;
    let wasOpen = false;

    function invokeDesktop<T>(command: string, args?: Record<string, unknown>): Promise<T> {
        const tauriInternals = (window as Window & {
            __TAURI_INTERNALS__?: { invoke: (name: string, args?: Record<string, unknown>) => Promise<T> };
        }).__TAURI_INTERNALS__;
        if (!tauriInternals?.invoke) {
            return Promise.reject(new Error('Desktop bridge unavailable.'));
        }
        return tauriInternals.invoke(command, args);
    }

    async function loadSettings() {
        busy = true;
        error = '';
        saved = false;
        options = [];
        testResult = null;
        try {
            const settings = await invokeDesktop<{
                selected: string; options: { id: string; label: string }[]; development: boolean;
            }>('docker_settings');
            selection = settings.selected;
            options = settings.options;
            development = settings.development;
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            busy = false;
            await tick();
            if (open) (runtimeSelect ?? modalCard?.querySelector('button'))?.focus();
        }
    }

    $: if (browser && open && !wasOpen) {
        wasOpen = true;
        document.body.style.overflow = 'hidden';
        void loadSettings();
    } else if (browser && !open && wasOpen) {
        wasOpen = false;
        document.body.style.overflow = '';
    }

    function close() {
        if (busy || testing) return;
        onClose();
    }

    async function save() {
        busy = true;
        error = '';
        saved = false;
        try {
            await invokeDesktop('save_docker_settings', { selected: selection });
            saved = true;
            onSaved();
            onClose();
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            busy = false;
            await tick();
            if (open) runtimeSelect?.focus();
        }
    }

    async function testConnection() {
        testing = true;
        testResult = null;
        try {
            const message = await invokeDesktop<string>('test_docker_connection', { selected: selection });
            testResult = { success: true, message };
        } catch (err) {
            testResult = { success: false, message: err instanceof Error ? err.message : String(err) };
        } finally {
            testing = false;
            await tick();
            runtimeSelect?.focus();
        }
    }

    function trapModalFocus(event: KeyboardEvent, modal: HTMLElement) {
        const focusable = Array.from(
            modal.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled)')
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function handleModalKeydown(event: KeyboardEvent) {
        if (!open || !modalCard) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key === 'Tab') trapModalFocus(event, modalCard);
    }
</script>

<svelte:window onkeydown={handleModalKeydown} />

{#if open}
    <div class="home-modal-shell">
        <button class="home-modal-backdrop" aria-label="Close Docker settings" tabindex="-1" onclick={close}></button>
        <div bind:this={modalCard} class="home-modal-card docker-settings-card" role="dialog" aria-modal="true" aria-labelledby="docker-settings-title" aria-busy={busy}>
            <span class="modal-eyebrow">Code execution</span>
            <h2 id="docker-settings-title">Docker settings</h2>
            <p class="docker-intro">Choose a runtime for running, submitting, and debugging code.</p>
            <label class="docker-runtime-field" for="docker-runtime">Docker runtime
                <select id="docker-runtime" bind:this={runtimeSelect} bind:value={selection} disabled={busy || testing || !options.length} onchange={() => { saved = false; testResult = null; }}>
                    {#each options as option}
                        <option value={option.id}>{option.label}</option>
                    {/each}
                </select>
            </label>
            <button class="btn docker-test-button" type="button" onclick={testConnection} disabled={busy || testing || !options.length}>{testing ? 'Testing…' : 'Test connection'}</button>
            <div class="docker-connection-status" class:success={!error && testResult?.success} class:failure={!!error || testResult?.success === false} role="status" aria-live="polite" aria-atomic="true">
                <span class="docker-status-icon" aria-hidden="true">{error || testResult?.success === false ? '!' : testResult?.success ? '✓' : '·'}</span>
                <div class="docker-status-copy">
                    <strong>{error ? 'Settings error' : testing ? 'Checking connection…' : testResult ? (testResult.success ? 'Connected' : 'Connection failed') : 'Ready to test'}</strong>
                    <span>{error || testResult?.message || 'Start your runtime, then test the connection.'}</span>
                </div>
            </div>
            <p class="docker-help">Automatic checks <code>DOCKER_HOST</code>, then local sockets. Select a runtime to override detection.</p>
            {#if development}
                <p class="docker-help docker-dev-note">Development mode: configure the external server with <code>DOCKER_HOST</code>. This preference applies to the packaged app.</p>
            {/if}
            <p class="docker-save-note" class:saved role="status">{saved ? '✓ Saved on this device.' : 'Saved on this device.'} Quit and reopen Cojudge to apply.</p>
            <div class="home-modal-actions">
                <span class="modal-action-spacer"></span>
                <button class="btn" type="button" onclick={close} disabled={busy || testing}>Close</button>
                <button class="btn modal-primary-btn" type="button" onclick={save} disabled={busy || testing || !options.length}>{busy ? 'Please wait…' : 'Save'}</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .btn {
        appearance: none;
        border: 1px solid var(--color-border);
        padding: 0.35rem 0.75rem;
        border-radius: 0.375rem;
        background: var(--color-btn);
        cursor: pointer;
        font-size: 0.9rem;
        color: inherit;
    }
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .home-modal-shell {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        overflow-y: auto;
    }
    .home-modal-backdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: rgba(0, 0, 0, 0.52);
        cursor: default;
    }
    .home-modal-card {
        position: relative;
        width: min(430px, 100%);
        max-height: calc(100vh - 2.5rem);
        max-height: calc(100dvh - 2.5rem);
        overflow-y: auto;
        padding: 1.5rem;
        border: 1px solid var(--color-border);
        border-radius: 0.875rem;
        background: var(--color-bg);
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
    }
    .home-modal-card h2 {
        margin: 0 0 0.75rem;
        font-size: 1.25rem;
    }
    .home-modal-card p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.55;
    }
    .home-modal-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 0.625rem;
        margin-top: 1.5rem;
    }
    .modal-action-spacer {
        flex: 1 1 auto;
    }
    .modal-primary-btn {
        border-color: var(--color-highlight);
        background: var(--color-highlight);
        color: #fff;
        font-weight: 650;
    }
    .modal-primary-btn:hover {
        filter: brightness(1.05);
    }
    .modal-eyebrow {
        display: block;
        margin-top: 0.35rem;
        color: var(--color-highlight);
        font-size: 0.7rem;
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .docker-runtime-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem 0;
        font-weight: 600;
    }
    .docker-runtime-field select {
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23818b98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.85rem center;
        width: 100%;
        min-height: 2.75rem;
        padding: 0.65rem 2.5rem 0.65rem 0.85rem;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background-color: var(--color-surface);
        color: var(--color-text);
        font: inherit;
        font-weight: 500;
    }
    .docker-runtime-field select:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 2px;
    }
    .docker-settings-card {
        width: min(460px, 100%);
    }
    .docker-settings-card h2 {
        margin-bottom: 0.65rem;
    }
    .docker-settings-card .docker-intro {
        margin: 0 0 1.25rem;
        font-size: 0.9rem;
    }
    .docker-test-button {
        min-width: 9rem;
        justify-content: center;
    }
    .docker-connection-status {
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        height: 5.5rem;
        box-sizing: border-box;
        margin: 0.85rem 0 1rem;
        padding: 0.8rem;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        background: var(--color-surface);
        color: var(--color-text-secondary);
        font-size: 0.8rem;
        line-height: 1.4;
    }
    .docker-connection-status.success {
        color: #16803d;
        border-color: rgba(34, 197, 94, 0.35);
        background: rgba(34, 197, 94, 0.08);
    }
    .docker-connection-status.failure {
        color: #dc2626;
        border-color: rgba(239, 68, 68, 0.35);
        background: rgba(239, 68, 68, 0.08);
    }
    :global([data-theme='dark']) .docker-connection-status.success,
    :global([data-theme='dark']) .docker-save-note.saved {
        color: #4ade80;
    }
    :global([data-theme='dark']) .docker-connection-status.failure {
        color: #f87171;
    }
    .docker-status-icon {
        display: grid;
        place-items: center;
        flex: 0 0 1.25rem;
        height: 1.25rem;
        border: 1px solid currentColor;
        border-radius: 50%;
        font-weight: 700;
    }
    .docker-status-copy {
        min-width: 0;
        max-height: 100%;
        overflow: auto;
        overflow-wrap: anywhere;
    }
    .docker-status-copy strong,
    .docker-status-copy span {
        display: block;
    }
    .docker-status-copy span {
        margin-top: 0.2rem;
        font-size: 0.75rem;
    }
    .docker-settings-card .docker-help,
    .docker-settings-card .docker-save-note {
        margin: 0.75rem 0 0;
        font-size: 0.78rem;
        line-height: 1.5;
    }
    .docker-dev-note {
        padding-left: 0.75rem;
        border-left: 2px solid var(--color-border);
    }
    .docker-settings-card .docker-save-note {
        height: 2.5rem;
        margin-top: 1rem;
    }
    .docker-settings-card .docker-save-note.saved {
        color: #16803d;
    }
</style>
