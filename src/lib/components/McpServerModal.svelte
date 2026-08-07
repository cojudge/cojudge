<script lang="ts">
    import { onDestroy, tick } from 'svelte';
    import { browser } from '$app/environment';
    import {
        desktopMcpToken,
        getMcpUrl,
        mcpClientState,
        pullMcpFilesNow,
        refreshMcpState,
        restartMcpServer,
        rotateDesktopMcpToken,
        startMcpServer,
        stopMcpServer,
        syncMcpFilesNow,
        updateMcpPermissions
    } from '$lib/mcp/client';
    import { mcpSettings } from '$lib/mcp/settings';
    import type { McpPermissions } from '$lib/mcp/types';

    export let open = false;
    export let onClose: () => void = () => {};

    let mcpModalCard: HTMLElement | null = null;
    let copied = false;
    let copyTimer: ReturnType<typeof setTimeout> | undefined;
    let armRotation = false;
    let armTimer: ReturnType<typeof setTimeout> | undefined;
    let rotateError = '';
    let draftPermissions: McpPermissions = $mcpSettings.permissions;
    const permissionItems: { key: 'read' | 'write' | 'create' | 'delete'; label: string; hint: string }[] = [
        { key: 'read', label: 'READ', hint: 'Search and view files' },
        { key: 'write', label: 'WRITE', hint: 'Edit, move and rename files and folders' },
        { key: 'create', label: 'CREATE', hint: 'Create files and notes' },
        { key: 'delete', label: 'DELETE', hint: 'Delete files and folders' }
    ];

    function close() {
        onClose();
    }

    async function openModal() {
        copied = false;
        draftPermissions = $mcpSettings.permissions;
        await refreshMcpState();
        if ($mcpSettings.running && !$mcpClientState.running) {
            await startMcpServer();
        }
        void syncMcpFilesNow();
        void pullMcpFilesNow();
        await tick();
        mcpModalCard?.focus();
    }

    async function handleStart() {
        await startMcpServer();
        void syncMcpFilesNow();
    }

    async function handleRestart() {
        await restartMcpServer();
        void syncMcpFilesNow();
    }

    async function handleRefresh() {
        void syncMcpFilesNow();
        void pullMcpFilesNow();
        await refreshMcpState();
    }

    async function handleRotate() {
        rotateError = '';
        if (!armRotation) {
            armRotation = true;
            if (armTimer) clearTimeout(armTimer);
            armTimer = setTimeout(() => (armRotation = false), 4000);
            return;
        }
        if (armTimer) clearTimeout(armTimer);
        armRotation = false;
        try {
            // Navigates through the bootstrap endpoint; the app reloads with
            // the new token and a fresh session cookie.
            await rotateDesktopMcpToken();
        } catch (error) {
            rotateError = error instanceof Error ? error.message : 'Token rotation failed.';
        }
    }

    $: if (open) void openModal();

    $: if (browser) {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    onDestroy(() => {
        if (browser) document.body.style.overflow = '';
        if (copyTimer) clearTimeout(copyTimer);
        if (armTimer) clearTimeout(armTimer);
    });

    async function copyUrl() {
        if (!browser) return;
        try {
            await navigator.clipboard.writeText(getMcpUrl());
        } catch {
            // Clipboard API can be blocked; try a fallback selection.
            const input = document.querySelector<HTMLInputElement>('.mcp-url-input');
            input?.select();
        }
        copied = true;
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => (copied = false), 2000);
    }

    async function setPermission(key: keyof McpPermissions, value: boolean) {
        draftPermissions = { ...draftPermissions, [key]: value };
        await updateMcpPermissions(draftPermissions);
    }

    function trapModalFocus(event: KeyboardEvent, modal: HTMLElement) {
        const focusable = Array.from(
            modal.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)')
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
        if (!open) return;
        if (event.defaultPrevented) return;
        if (!mcpModalCard) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key === 'Tab') trapModalFocus(event, mcpModalCard);
    }
</script>

<svelte:window onkeydown={handleModalKeydown} />

{#if open}
    <div class="home-modal-shell">
        <button class="home-modal-backdrop" aria-label="Close MCP Server settings" tabindex="-1" onclick={close}></button>
        <div
            bind:this={mcpModalCard}
            class="home-modal-card mcp-settings-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mcp-settings-title"
            tabindex="-1"
        >
            <div class="modal-heading-row">
                <div>
                    <span class="modal-eyebrow">Agent access</span>
                    <h2 id="mcp-settings-title">MCP Server</h2>
                </div>
                <div class="modal-heading-right">
                    <span class:running={$mcpClientState.running} class="mcp-status-pill">
                        <span></span>{$mcpClientState.running ? 'Running' : 'Stopped'}
                    </span>
                    <button class="modal-close-btn" type="button" onclick={close} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <p>Agents connect to Cojudge over the Model Context Protocol to search, view, edit, and create notes on your playground files. Copy the URL into your agent as an MCP server, then control exactly what it may do below.</p>

            <div class="mcp-url-row">
                <input class="mcp-url-input" readonly value={getMcpUrl()} spellcheck="false" onfocus={(e) => e.currentTarget.select()} />
                <button class="btn mcp-copy-btn" type="button" onclick={copyUrl}>
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            {#if $desktopMcpToken}
                <div class="mcp-rotate-row">
                    <button
                        class="btn mcp-rotate-btn"
                        type="button"
                        onclick={handleRotate}
                        disabled={armRotation}
                    >
                        {armRotation ? 'Click again to confirm' : 'Rotate token'}
                    </button>
                    <span class="mcp-rotate-hint">Generate a new token. Agents with the old URL lose access.</span>
                </div>
            {/if}
            {#if rotateError}
                <p class="modal-error" role="alert">{rotateError}</p>
            {/if}

            <div class="mcp-section">
                <strong class="mcp-section-title">Permissions</strong>
                <div class="mcp-permission-list">
                    {#each permissionItems as item}
                        <div class="mcp-permission-row">
                            <div class="mcp-permission-label">
                                <strong>{item.label}</strong>
                                <span>{item.hint}</span>
                            </div>
                            <button
                                class="mcp-toggle"
                                class:on={draftPermissions[item.key]}
                                type="button"
                                role="switch"
                                aria-checked={draftPermissions[item.key]}
                                aria-label={item.label}
                                onclick={() => setPermission(item.key, !draftPermissions[item.key])}
                                disabled={$mcpClientState.loading}
                            >
                                <span></span>
                            </button>
                        </div>
                    {/each}
                    <div class="mcp-permission-row">
                        <div class="mcp-permission-label">
                            <strong>Hidden files</strong>
                            <span>Also expose dotfiles (names starting with <code>.</code>, like <code>.env</code>)</span>
                        </div>
                        <button
                            class="mcp-toggle"
                            class:on={draftPermissions.includeHidden}
                            type="button"
                            role="switch"
                            aria-checked={draftPermissions.includeHidden}
                            aria-label="Include hidden files"
                            onclick={() => setPermission('includeHidden', !draftPermissions.includeHidden)}
                            disabled={$mcpClientState.loading}
                        >
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mcp-section">
                <div class="mcp-section-heading">
                    <strong class="mcp-section-title">Server</strong>
                    <span class="mcp-file-count">{$mcpClientState.fileCount} { $mcpClientState.fileCount === 1 ? 'file' : 'files'} available</span>
                </div>
                <div class="mcp-server-actions">
                    <button class="btn" type="button" onclick={handleStart} disabled={$mcpClientState.loading || $mcpClientState.running}>
                        Start
                    </button>
                    <button class="btn" type="button" onclick={stopMcpServer} disabled={$mcpClientState.loading || !$mcpClientState.running}>
                        Stop
                    </button>
                    <button class="btn" type="button" onclick={handleRestart} disabled={$mcpClientState.loading || !$mcpClientState.running}>
                        Restart
                    </button>
                    <button class="btn mcp-refresh-btn" type="button" onclick={handleRefresh} disabled={$mcpClientState.loading}>
                        Refresh
                    </button>
                </div>
            </div>

            {#if $mcpClientState.error}
                <p class="modal-error" role="alert">{$mcpClientState.error}</p>
            {/if}

            <p class="mcp-offline-note">Everything runs locally on this device. The server only listens while Cojudge is open, and only serves the playground files synced from this browser. File changes sync live over a local event stream, so agent edits appear in the playground and the file count here as they happen.</p>

            <div class="home-modal-actions">
                <div class="modal-actions-right">
                    <button class="btn" type="button" onclick={close}>Close</button>
                </div>
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
    .home-modal-card p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.55;
    }
    .home-modal-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }
    .modal-actions-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
    }
    .modal-heading-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }
    .modal-heading-right {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }
    .modal-close-btn {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--color-text-secondary);
        display: grid;
        place-items: center;
        border-radius: 0.375rem;
        transition: background 0.15s ease, color 0.15s ease;
    }
    .modal-close-btn:hover {
        background: var(--color-surface, rgba(255, 255, 255, 0.08));
        color: var(--color-text);
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
    .modal-error {
        margin-top: 0.75rem !important;
        color: var(--color-hard) !important;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .mcp-settings-card {
        width: min(520px, 100%);
    }
    .mcp-status-pill {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 0.4rem;
        padding: 0.3rem 0.55rem;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        color: var(--color-text-secondary);
        font-size: 0.72rem;
        font-weight: 650;
    }
    .mcp-status-pill span {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
        background: var(--color-text-secondary);
    }
    .mcp-status-pill.running {
        color: var(--color-easy);
    }
    .mcp-status-pill.running span {
        background: var(--color-easy);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-easy) 16%, transparent);
    }
    .mcp-url-row {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    .mcp-url-input {
        flex: 1;
        min-width: 0;
        padding: 0.4rem 0.6rem;
        border: 1px solid var(--color-border);
        border-radius: 0.375rem;
        background: var(--color-second-bg);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: 0.76rem;
        outline: none;
    }
    .mcp-url-input:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 1px;
    }
    .mcp-copy-btn {
        flex: 0 0 auto;
        font-size: 0.8rem;
    }
    .mcp-rotate-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    .mcp-rotate-btn {
        flex: 0 0 auto;
        font-size: 0.8rem;
    }
    .mcp-rotate-hint {
        color: var(--color-text-secondary);
        font-size: 0.72rem;
    }
    .mcp-section {
        display: grid;
        gap: 0.5rem;
        margin-top: 1rem;
        padding: 0.85rem;
        border: 1px solid var(--color-border);
        border-radius: 0.65rem;
        background: var(--color-surface);
    }
    .mcp-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .mcp-section-title {
        color: var(--color-text);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }
    .mcp-file-count {
        color: var(--color-text-secondary);
        font-size: 0.72rem;
    }
    .mcp-permission-list {
        display: grid;
        gap: 0.25rem;
    }
    .mcp-permission-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.45rem 0.1rem;
    }
    .mcp-permission-row + .mcp-permission-row {
        border-top: 1px solid var(--color-border);
    }
    .mcp-permission-label {
        display: grid;
        gap: 0.1rem;
        min-width: 0;
    }
    .mcp-permission-label strong {
        color: var(--color-text);
        font-size: 0.8rem;
        letter-spacing: 0.02em;
    }
    .mcp-permission-label span {
        overflow: hidden;
        color: var(--color-text-secondary);
        font-size: 0.72rem;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mcp-permission-label code {
        font-family: var(--font-mono);
        font-size: 0.68rem;
    }
    .mcp-toggle {
        position: relative;
        flex: 0 0 auto;
        width: 2.2rem;
        height: 1.25rem;
        padding: 0;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        background: color-mix(in srgb, var(--color-text) 16%, transparent);
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
    }
    .mcp-toggle:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .mcp-toggle span {
        position: absolute;
        top: 50%;
        left: 0.15rem;
        width: 0.85rem;
        height: 0.85rem;
        border-radius: 50%;
        background: #fff;
        transform: translateY(-50%);
        transition: left 0.15s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    }
    .mcp-toggle.on {
        background: var(--color-highlight);
        border-color: var(--color-highlight);
    }
    .mcp-toggle.on span {
        left: calc(100% - 1rem);
    }
    .mcp-toggle:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 2px;
    }
    .mcp-server-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .mcp-refresh-btn {
        margin-left: auto;
    }
    .mcp-offline-note {
        margin-top: 1rem !important;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: var(--color-second-bg);
        font-size: 0.76rem;
    }
</style>
