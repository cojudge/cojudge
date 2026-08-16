<script lang="ts">
    import { onDestroy, tick } from 'svelte';
    import { browser } from '$app/environment';
    import {
        checkCloudNow,
        checkCloudSignOut,
        cloudSyncState,
        connectCloud,
        deleteCloudRevision,
        disconnectCloud,
        discardLocalFileChanges,
        fetchCloudFileChanges,
        pushLocalFileChanges,
        refreshCloudLocalState,
        resolveCloudProgress,
        restoreCloudRevision,
        syncCloudNow
    } from '$lib/cloudSync';
    import type { FileChange } from '$lib/cloudFileChange';
    import { activeDialog, showChoice, showConfirm } from '$lib/dialogs';
    import { hasDotFiles, listDotFiles } from '$lib/progressBackup';

    export let open = false;
    export let onClose: () => void = () => {};

    let isMac = false;
    if (browser) {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }

    let cloudModalCard: HTMLElement | null = null;
    let cloudPrimaryButton: HTMLButtonElement | null = null;
    let cloudActionPending = false;
    let showAllCloudHistory = false;
    let cloudFileChanges: FileChange[] = [];
    let cloudFileChangesLoading = false;
    let cloudFileChangesError = '';
    let selectedCloudFileIds = new Set<string>();
    let expandedDiffs = new Set<string>();
    function toggleDiff(key: string) {
        const next = new Set(expandedDiffs);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        expandedDiffs = next;
    }
    function diffKey(fileId: string, language: string): string {
        return `${fileId}:${language}`;
    }
    const DIFF_LINE_LIMIT = 240;
    function shortenDiffLine(text: string): string {
        if (text.length <= DIFF_LINE_LIMIT) return text;
        return `${text.slice(0, DIFF_LINE_LIMIT)}…`;
    }

    function formatAgo(value: number, long = false): string {
        const elapsed = Math.max(0, Date.now() - value);
        if (elapsed < 60_000) return 'just now';
        const minutes = Math.floor(elapsed / 60_000);
        if (minutes < 60)
            return long
                ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
                : `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return long
                ? `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
                : `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return long
            ? `${days} ${days === 1 ? 'day' : 'days'} ago`
            : `${days}d ago`;
    }

    function formatLastSynced(value: number | null): string {
        if (!value) return 'Not synced yet';
        return `Synced ${formatAgo(value)}`;
    }

    function formatCloudRevision(value: number): string {
        return formatAgo(value, true);
    }

    function formatCloudRevisionSize(value: number): string {
        if (value < 1024) return `${value} B`;
        if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} KB`;
        return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    }

    function close() {
        onClose();
    }

    async function openModal() {
        showAllCloudHistory = false;
        selectedCloudFileIds = new Set();
        await refreshCloudLocalState();
        await tick();
        cloudPrimaryButton?.focus();
    }

    $: if (open) void openModal();

    // Load the file changes only when entering the local-changes state, not on
    // every cloudSyncState emission. The store emits a new object for unrelated
    // updates (e.g. dirty checks after local saves), and refetching on each one
    // makes this section flicker between the diff and "Comparing with the cloud…".
    let fileChangesLoadArmed = false;
    $: {
        const shouldLoadFileChanges = open && $cloudSyncState.resolution === 'local-changes';
        if (shouldLoadFileChanges && !fileChangesLoadArmed) {
            fileChangesLoadArmed = true;
            void loadCloudFileChanges();
        } else if (!shouldLoadFileChanges && fileChangesLoadArmed) {
            fileChangesLoadArmed = false;
            selectedCloudFileIds = new Set();
        }
    }

    $: if (browser) {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    onDestroy(() => {
        if (browser) document.body.style.overflow = '';
    });

    async function loadCloudFileChanges() {
        if (cloudFileChangesLoading) return;
        if ($cloudSyncState.authStatus !== 'signed-in' || $cloudSyncState.resolution !== 'local-changes') {
            cloudFileChanges = [];
            cloudFileChangesError = '';
            selectedCloudFileIds = new Set();
            return;
        }
        cloudFileChangesLoading = true;
        cloudFileChangesError = '';
        try {
            cloudFileChanges = await fetchCloudFileChanges();
            const availableIds = new Set(cloudFileChanges.map((change) => change.fileId));
            selectedCloudFileIds = new Set(
                [...selectedCloudFileIds].filter((fileId) => availableIds.has(fileId))
            );
        } catch {
            cloudFileChangesError = 'Could not compare with the cloud. Check your connection and try again.';
            cloudFileChanges = [];
            selectedCloudFileIds = new Set();
        } finally {
            cloudFileChangesLoading = false;
        }
    }

    function cloudFileChangeLabel(change: FileChange): string {
        return change.fileName ? `${change.slug}/${change.fileName}` : change.slug;
    }

    function setCloudFileSelected(fileId: string, selected: boolean) {
        const next = new Set(selectedCloudFileIds);
        if (selected) next.add(fileId);
        else next.delete(fileId);
        selectedCloudFileIds = next;
    }

    async function discardCloudFiles(changes: FileChange[]) {
        if (changes.length === 0) return;
        const labels = changes.map((change) => `- ${cloudFileChangeLabel(change)}`).join('\n');
        const multiple = changes.length > 1;
        const confirmed = await showConfirm(
            `The following local ${multiple ? 'changes' : 'change'} will be discarded:\n\n${labels}\n\n${multiple ? 'They will' : 'It will'} be restored from the latest cloud version. This cannot be undone.`,
            {
                title: multiple ? 'Discard selected changes' : 'Discard file changes',
                confirmLabel: multiple ? `Discard ${changes.length} changes` : 'Discard changes',
                tone: 'danger'
            }
        );
        if (!confirmed) return;

        cloudActionPending = true;
        try {
            const discardedIds = new Set(changes.map((change) => change.fileId));
            await discardLocalFileChanges([...discardedIds]);
            selectedCloudFileIds = new Set(
                [...selectedCloudFileIds].filter((fileId) => !discardedIds.has(fileId))
            );
            await loadCloudFileChanges();
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    function discardSelectedCloudFiles() {
        return discardCloudFiles(selectedCloudFileChanges());
    }

    function selectedCloudFileChanges(): FileChange[] {
        return cloudFileChanges.filter((change) => selectedCloudFileIds.has(change.fileId));
    }

    async function pushSelectedCloudFiles() {
        const changes = selectedCloudFileChanges();
        if (changes.length === 0) return;

        cloudActionPending = true;
        try {
            const pushedIds = new Set(changes.map((change) => change.fileId));
            await pushLocalFileChanges([...pushedIds]);
            selectedCloudFileIds = new Set(
                [...selectedCloudFileIds].filter((fileId) => !pushedIds.has(fileId))
            );
            await loadCloudFileChanges();
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function signInToCloud() {
        cloudActionPending = true;
        try {
            await connectCloud();
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function syncCloud() {
        cloudActionPending = true;
        try {
            await syncCloudNow();
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function checkCloud() {
        cloudActionPending = true;
        try {
            await checkCloudNow();
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    function chooseSignOutCleanup(check: 'unsynced' | 'unknown'): Promise<boolean | null> {
        return showChoice(
            check === 'unsynced'
                ? 'This device has local data that does not match the latest cloud version. Clear it from this device when signing out? Your cloud versions will not be deleted.'
                : 'Cojudge could not confirm whether this device matches the latest cloud version. Clear its local data when signing out?',
            {
                title: check === 'unsynced' ? 'Unsynced local data' : 'Cloud status unavailable',
                confirmLabel: 'Clear and sign out',
                cancelLabel: 'Keep and sign out',
                tone: 'danger'
            }
        );
    }

    async function decideDotFileCleanup(): Promise<'remove' | 'keep' | null> {
        if (!hasDotFiles(localStorage)) return Promise.resolve('remove');
        const choice = await showChoice(
            'This device has hidden files (names starting with `.`, like `.env`). They are not backed up to the cloud, so clearing the device would delete them permanently. Remove them too, or keep them on this device?',
            {
                title: 'Hidden files',
                confirmLabel: 'Remove hidden files',
                cancelLabel: 'Keep them',
                tone: 'danger'
            }
        );
        if (choice === null) return null;
        if (choice === false) return 'keep';
        const names = listDotFiles(localStorage);
        const files = names.length > 0 ? names.join('\n') : 'hidden files';
        const confirmed = await showConfirm(
            `${files}\n\nThese hidden files exist only on this device and are not saved to the cloud, so they will be permanently deleted.`,
            {
                title: 'Permanently delete these files?',
                confirmLabel: 'Delete hidden files',
                tone: 'danger'
            }
        );
        return confirmed ? 'remove' : null;
    }

    async function signOutOfCloud() {
        cloudActionPending = true;
        try {
            const check = await checkCloudSignOut();
            let clearLocalData = check === 'matching';
            let requireCloudMatch = check === 'matching';
            let keepDotFiles = false;
            if (check !== 'matching') {
                const choice = await chooseSignOutCleanup(check);
                if (choice === null) return;
                clearLocalData = choice;
            }
            if (clearLocalData) {
                const hidden = await decideDotFileCleanup();
                if (hidden === null) return;
                keepDotFiles = hidden === 'keep';
            }
            const result = await disconnectCloud({ clearLocalData, requireCloudMatch, keepDotFiles });
            if (result !== 'signed-out') {
                const choice = await chooseSignOutCleanup(result);
                if (choice === null) return;
                requireCloudMatch = false;
                await disconnectCloud({ clearLocalData: choice, requireCloudMatch, keepDotFiles: choice ? keepDotFiles : false });
            }
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function confirmLocalOverwriteRestore(): Promise<'push-first' | 'restore' | 'cancel'> {
        const dirty = await refreshCloudLocalState();
        if (!dirty) return 'restore';
        const choice = await showChoice(
            'Restoring a cloud version will replace your current local progress. Any local changes that have not been pushed to the cloud will be lost. Push them to the cloud first to keep them?',
            {
                title: 'Local changes will be lost',
                confirmLabel: 'Push changes first',
                cancelLabel: 'Discard and restore',
                tone: 'danger'
            }
        );
        if (choice === null) return 'cancel';
        return choice ? 'push-first' : 'restore';
    }

    async function resolveCloudCopy(preference: 'local' | 'cloud') {
        if (preference === 'cloud') {
            const decision = await confirmLocalOverwriteRestore();
            if (decision === 'cancel') return;
            if (decision === 'push-first') {
                cloudActionPending = true;
                try {
                    await resolveCloudProgress('local');
                } catch {
                    // The shared cloud state renders the actionable error.
                } finally {
                    cloudActionPending = false;
                }
                return;
            }
        }
        cloudActionPending = true;
        try {
            await resolveCloudProgress(preference);
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function restoreRevision(revisionId: string) {
        const decision = await confirmLocalOverwriteRestore();
        if (decision === 'cancel') return;
        cloudActionPending = true;
        try {
            if (decision === 'push-first') {
                await resolveCloudProgress('local');
            }
            await restoreCloudRevision(revisionId);
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
    }

    async function deleteRevision(revisionId: string, createdAt: number) {
        const confirmed = await showConfirm(
            `The cloud backup from ${formatCloudRevision(createdAt)} will be permanently deleted.`,
            {
                title: 'Delete cloud backup?',
                confirmLabel: 'Delete backup',
                tone: 'danger'
            }
        );
        if (!confirmed) return;

        cloudActionPending = true;
        try {
            await deleteCloudRevision(revisionId);
            if ($cloudSyncState.history.length <= 3) showAllCloudHistory = false;
        } catch {
            // The shared cloud state renders the actionable error.
        } finally {
            cloudActionPending = false;
        }
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
        if ($activeDialog) return;
        if (!open) return;
        const activeModal = cloudModalCard;
        if (!activeModal) return;
        if (event.defaultPrevented) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key === 'Tab') trapModalFocus(event, activeModal);
        // Cmd+Enter or Ctrl+Enter — trigger the primary action (e.g. push local changes)
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            if (cloudPrimaryButton && !cloudPrimaryButton.disabled) {
                cloudPrimaryButton.click();
            }
        }
    }
</script>

<svelte:window onkeydown={handleModalKeydown} />

{#if open}
    <div class="home-modal-shell" inert={Boolean($activeDialog)}>
        <button class="home-modal-backdrop" aria-label="Close Cojudge Cloud" tabindex="-1" onclick={close}></button>
        <div
            bind:this={cloudModalCard}
            class="home-modal-card cloud-settings-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cloud-settings-title"
            aria-hidden={$activeDialog ? 'true' : undefined}
        >
            <div class="modal-heading-row">
                <div>
                    <span id="cloud-settings-title" class="modal-eyebrow">Cojudge Cloud</span>
                </div>
                <div class="modal-heading-right">
                    <span class:configured={$cloudSyncState.authStatus === 'signed-in'} class="firebase-status-pill">
                        <span></span>{$cloudSyncState.authStatus === 'signed-in' ? 'Connected' : 'Local only'}
                    </span>
                    <button class="modal-close-btn" type="button" onclick={close} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {#if $cloudSyncState.authStatus === 'unavailable'}
                <p>Cloud sync is not configured in this build. Everything remains available locally.</p>
            {:else if $cloudSyncState.authStatus === 'signed-in' && $cloudSyncState.user}
                <div class="cloud-account">
                    {#if $cloudSyncState.user.photoURL}
                        <img src={$cloudSyncState.user.photoURL} alt="" referrerpolicy="no-referrer" />
                    {:else}
                        <span class="cloud-avatar">{($cloudSyncState.user.displayName || $cloudSyncState.user.email || 'C').slice(0, 1).toUpperCase()}</span>
                    {/if}
                    <div>
                        <strong>{$cloudSyncState.user.displayName || 'Google account'}</strong>
                        <span>{$cloudSyncState.user.email}</span>
                    </div>
                </div>
                <div class="cloud-sync-summary">
                    <span class:offline={$cloudSyncState.syncStatus === 'offline'} class:error={$cloudSyncState.syncStatus === 'error'} class:pending={Boolean($cloudSyncState.resolution)} class="cloud-sync-dot"></span>
                    <div>
                        <strong>
                            {$cloudSyncState.resolution === 'account'
                                ? 'Choose the starting copy'
                                : $cloudSyncState.resolution === 'local-changes'
                                    ? 'Local changes not pushed'
                                    : $cloudSyncState.resolution === 'conflict'
                                        ? 'Local and cloud both changed'
                                : $cloudSyncState.syncStatus === 'syncing'
                                ? 'Syncing progress…'
                                : $cloudSyncState.syncStatus === 'offline'
                                    ? 'Waiting for a connection'
                                    : formatLastSynced($cloudSyncState.lastSyncedAt)}
                        </strong>
                        <span>
                            {$cloudSyncState.resolution === 'account'
                                ? "Push this workspace or restore this account's cloud snapshot."
                                : $cloudSyncState.resolution === 'local-changes'
                                    ? 'Push explicitly, or discard these changes by restoring cloud.'
                                    : $cloudSyncState.resolution === 'conflict'
                                        ? 'Choose which complete snapshot should become the working copy.'
                                        : 'Cloud updates pull automatically; local changes push only when requested.'}
                        </span>
                    </div>
                </div>
                {#if $cloudSyncState.progress}
                    <div class="cloud-progress" role="progressbar" aria-label={$cloudSyncState.progress.label} aria-valuenow={$cloudSyncState.progress.value ?? undefined} aria-valuemin={0} aria-valuemax={100}>
                        <span class="cloud-progress-label">{$cloudSyncState.progress.label}</span>
                        <div class="cloud-progress-track">
                            <div class="cloud-progress-fill" class:indeterminate={$cloudSyncState.progress.value === null} style={$cloudSyncState.progress.value === null ? '' : `width: ${$cloudSyncState.progress.value}%`}></div>
                        </div>
                    </div>
                {/if}
                {#if $cloudSyncState.resolution === 'local-changes'}
                    <div class="cloud-file-changes">
                        <div class="cloud-file-changes-heading">
                            <strong>Local changes</strong>
                            <div class="cloud-file-changes-actions">
                                <button class="btn cloud-file-reload" type="button" onclick={loadCloudFileChanges} disabled={cloudActionPending}>{cloudFileChangesLoading ? 'Comparing…' : 'Refresh'}</button>
                                <button class="btn cloud-file-push-selected" type="button" onclick={pushSelectedCloudFiles} disabled={cloudActionPending || cloudFileChangesLoading || selectedCloudFileIds.size === 0}>Push selected{selectedCloudFileIds.size > 0 ? ` (${selectedCloudFileIds.size})` : ''}</button>
                                <button class="btn cloud-file-discard cloud-file-discard-selected" type="button" onclick={discardSelectedCloudFiles} disabled={cloudActionPending || cloudFileChangesLoading || selectedCloudFileIds.size === 0}>Discard selected{selectedCloudFileIds.size > 0 ? ` (${selectedCloudFileIds.size})` : ''}</button>
                            </div>
                        </div>
                        {#if cloudFileChangesError}
                            <p class="modal-error" role="alert">{cloudFileChangesError}</p>
                        {:else if cloudFileChangesLoading}
                            <p class="cloud-file-changes-empty">Comparing with the cloud…</p>
                        {:else if cloudFileChanges.length === 0}
                            <p class="cloud-file-changes-empty">No differences found. Local data matches the latest cloud version.</p>
                        {:else}
                            {#each cloudFileChanges as change}
                                <div class:selected={selectedCloudFileIds.has(change.fileId)} class="cloud-file-change">
                                    <div class="cloud-file-change-row">
                                        <label class="cloud-file-change-selection">
                                            <input class="cloud-file-change-checkbox" type="checkbox" checked={selectedCloudFileIds.has(change.fileId)} onchange={(event) => setCloudFileSelected(change.fileId, event.currentTarget.checked)} disabled={cloudActionPending} />
                                            <span class="cloud-file-change-name" title={cloudFileChangeLabel(change)}><span class="cloud-file-change-slug">{change.slug}</span>{change.fileName ? `/${change.fileName}` : ''}</span>
                                        </label>
                                        <button class="btn cloud-file-discard" type="button" onclick={() => discardCloudFiles([change])} disabled={cloudActionPending}>Discard changes</button>
                                    </div>
                                    {#each change.languages as lang}
                                        {@const diffKeyValue = diffKey(change.fileId, lang.language)}
                                        {#if lang.blob}
                                            <div class="cloud-file-blob-note">
                                                <span class="cloud-file-lang-label">
                                                    {lang.language}{lang.local && !lang.cloud ? ' (new locally)' : !lang.local && lang.cloud ? ' (deleted locally)' : ''}
                                                </span>
                                                <span>Binary or generated content — diff hidden.</span>
                                            </div>
                                        {:else}
                                            <div class="cloud-file-diff">
                                                <button class="cloud-file-diff-heading" type="button" onclick={() => toggleDiff(diffKeyValue)} aria-expanded={expandedDiffs.has(diffKeyValue)}>
                                                    <span class="diff-caret" aria-hidden="true">▾</span>
                                                    <span class="cloud-file-lang-label">
                                                        {lang.language}{lang.local && !lang.cloud ? ' (new locally)' : !lang.local && lang.cloud ? ' (deleted locally)' : ''}
                                                    </span>
                                                </button>
                                                {#if expandedDiffs.has(diffKeyValue)}
                                                    <div class="cloud-file-diff-body">
                                                        {#each lang.lines as line}
                                                            <div class="diff-line {line.type}">
                                                                <span class="diff-marker">{line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}</span>
                                                                <code title={line.text.length > DIFF_LINE_LIMIT ? line.text : undefined}>{shortenDiffLine(line.text)}</code>
                                                            </div>
                                                        {/each}
                                                    </div>
                                                {/if}
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            {:else}
                <p>Sign in with Google to keep solutions, progress, test cases, and whiteboards in sync across your devices.</p>
            {/if}

            <p class="cloud-offline-note">Cojudge stays offline-first. Local saves never wait for the cloud, and judging works without signing in or connecting to the internet. Files that start with `.` (e.g. `.env`) are left out of cloud backups and appear faded as hidden files in the playground file tabs</p>
            {#if $cloudSyncState.authStatus === 'signed-in' && $cloudSyncState.resolution !== 'account' && $cloudSyncState.history.length > 0}
                <div class="cloud-history">
                    <div class="cloud-history-heading">
                        <strong>Recent cloud versions</strong>
                        <span>Restore locally, then push to make it current.</span>
                    </div>
                    <div class:expanded={showAllCloudHistory} class="cloud-history-list">
                        {#each (showAllCloudHistory ? $cloudSyncState.history : $cloudSyncState.history.slice(0, 3)) as revision}
                            <div class="cloud-history-row">
                                <div class="cloud-history-details">
                                    <strong>{formatCloudRevision(revision.createdAt)}</strong>
                                    <span>{formatCloudRevisionSize(revision.totalBytes)}</span>
                                </div>
                                {#if revision.current}
                                    <span class="cloud-current-version">Cloud Latest</span>
                                {:else}
                                    <div class="cloud-history-actions">
                                        <button class="btn cloud-restore-version" type="button" onclick={() => restoreRevision(revision.revisionId)} disabled={cloudActionPending}>Restore locally</button>
                                        <button class="btn cloud-delete-version" type="button" onclick={() => deleteRevision(revision.revisionId, revision.createdAt)} disabled={cloudActionPending}>Delete</button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    {#if $cloudSyncState.history.length > 3}
                        <button
                            class="cloud-history-toggle"
                            type="button"
                            aria-expanded={showAllCloudHistory}
                            onclick={() => showAllCloudHistory = !showAllCloudHistory}
                        >
                            {showAllCloudHistory ? 'Show less' : 'Show more'}
                        </button>
                    {/if}
                </div>
            {/if}
            {#if $cloudSyncState.error}
                <p class="modal-error" role="alert">{$cloudSyncState.error}</p>
            {/if}

            <div class="home-modal-actions settings-actions">
                {#if $cloudSyncState.authStatus === 'signed-in'}
                    <button class="btn remove-settings-btn" type="button" onclick={signOutOfCloud} disabled={cloudActionPending || $cloudSyncState.syncStatus === 'syncing'}>Sign out</button>
                    <div class="modal-actions-right">
                        <button class="btn" type="button" onclick={close}>Close</button>
                        {#if $cloudSyncState.resolution && $cloudSyncState.remoteStatus === 'present'}
                            <button class="btn" type="button" onclick={() => resolveCloudCopy('cloud')} disabled={cloudActionPending}>Restore cloud</button>
                        {/if}
                        <button bind:this={cloudPrimaryButton} class="btn modal-primary-btn" type="button" onclick={$cloudSyncState.remoteStatus === 'error' ? checkCloud : $cloudSyncState.resolution ? () => resolveCloudCopy('local') : syncCloud} disabled={cloudActionPending || $cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading' || ($cloudSyncState.remoteStatus === 'unknown' && Boolean($cloudSyncState.resolution))}>
                            <span>
                                {$cloudSyncState.remoteStatus === 'error'
                                    ? 'Retry cloud check'
                                    : $cloudSyncState.resolution === 'account'
                                    ? 'Push this workspace'
                                    : $cloudSyncState.resolution === 'local-changes'
                                        ? 'Push local changes'
                                        : $cloudSyncState.resolution === 'conflict'
                                            ? 'Use local progress'
                                    : $cloudSyncState.syncStatus === 'syncing'
                                        ? 'Syncing…'
                                        : 'Sync now'}
                            </span>
                            <kbd class="modal-btn-kbd">{isMac ? '⌘Enter' : 'Ctrl+Enter'}</kbd>
                        </button>
                    </div>
                {:else if $cloudSyncState.authStatus === 'unavailable'}
                    <div class="modal-actions-right">
                        <button bind:this={cloudPrimaryButton} class="btn" type="button" onclick={close}>Close</button>
                    </div>
                {:else}
                    <div class="modal-actions-right">
                        <button class="btn" type="button" onclick={close}>Not now</button>
                        <button bind:this={cloudPrimaryButton} class="btn modal-primary-btn" type="button" onclick={signInToCloud} disabled={cloudActionPending || $cloudSyncState.authStatus === 'initializing' || $cloudSyncState.authStatus === 'signing-in'}>
                            {$cloudSyncState.authStatus === 'initializing'
                                ? 'Initializing…'
                                : $cloudSyncState.authStatus === 'signing-in'
                                    ? 'Opening Google…'
                                    : 'Continue with Google'}
                        </button>
                    </div>
                {/if}
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
    .modal-primary-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        border-color: var(--color-highlight);
        background: var(--color-highlight);
        color: #fff;
        font-weight: 650;
    }
    .modal-primary-btn:hover {
        filter: brightness(1.05);
    }
    .modal-btn-kbd {
        display: inline-flex;
        align-items: center;
        font-family: inherit;
        font-size: 0.72rem;
        font-weight: 600;
        line-height: 1;
        padding: 0.15rem 0.35rem;
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.22);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.32);
        letter-spacing: -0.01em;
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
    .cloud-settings-card {
        width: min(560px, 100%);
    }
    .cloud-account {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-top: 1.25rem;
        padding: 0.9rem;
        border: 1px solid var(--color-border);
        border-radius: 0.65rem;
        background: var(--color-surface);
    }
    .cloud-account img,
    .cloud-avatar {
        width: 2.5rem;
        height: 2.5rem;
        flex: 0 0 auto;
        border-radius: 50%;
    }
    .cloud-account img {
        object-fit: cover;
    }
    .cloud-avatar {
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--color-highlight) 20%, var(--color-surface));
        color: var(--color-highlight);
        font-weight: 750;
    }
    .cloud-account div,
    .cloud-sync-summary div {
        display: grid;
        min-width: 0;
        gap: 0.2rem;
    }
    .cloud-account strong,
    .cloud-sync-summary strong {
        overflow: hidden;
        color: var(--color-text);
        font-size: 0.9rem;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cloud-account div > span,
    .cloud-sync-summary div > span {
        overflow: hidden;
        color: var(--color-text-secondary);
        font-size: 0.76rem;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cloud-sync-summary {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding: 0.8rem 0.9rem;
        border-radius: 0.65rem;
        background: var(--color-second-bg);
    }
    .cloud-sync-dot {
        width: 0.55rem;
        height: 0.55rem;
        flex: 0 0 auto;
        border-radius: 50%;
        background: var(--color-easy);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-easy) 16%, transparent);
    }
    .cloud-sync-dot.offline {
        background: var(--color-text-secondary);
        box-shadow: none;
    }
    .cloud-sync-dot.error {
        background: var(--color-hard);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-hard) 16%, transparent);
    }
    .cloud-sync-dot.pending {
        background: var(--color-medium);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-medium) 16%, transparent);
    }
    .cloud-progress {
        display: grid;
        gap: 0.35rem;
        margin-top: 0.5rem;
    }
    .cloud-progress-label {
        color: var(--color-text-secondary);
        font-size: 0.72rem;
    }
    .cloud-progress-track {
        height: 0.4rem;
        overflow: hidden;
        border-radius: 999px;
        background: color-mix(in srgb, var(--color-text) 14%, transparent);
    }
    .cloud-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: var(--color-highlight);
        transition: width 0.25s ease;
    }
    .cloud-progress-fill.indeterminate {
        width: 35%;
        animation: cloud-progress-slide 1.1s ease-in-out infinite;
    }
    @keyframes cloud-progress-slide {
        0% {
            transform: translateX(-110%);
        }
        100% {
            transform: translateX(310%);
        }
    }
    .cloud-file-changes {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.75rem;
        max-height: min(50vh, 22rem);
        overflow-y: auto;
        padding-right: 0.25rem;
    }
    .cloud-file-changes-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .cloud-file-changes-heading strong {
        color: var(--color-text);
        font-size: 0.78rem;
    }
    .cloud-file-changes-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.4rem;
        flex-wrap: wrap;
    }
    .cloud-file-reload {
        padding: 0.25rem 0.6rem;
        font-size: 0.72rem;
    }
    .cloud-file-push-selected {
        padding: 0.25rem 0.6rem;
        border-color: color-mix(in srgb, var(--color-highlight) 45%, var(--color-border));
        color: var(--color-highlight);
        font-size: 0.72rem;
    }
    .cloud-file-changes-empty {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: 0.76rem;
    }
    .cloud-file-change {
        display: grid;
        gap: 0.45rem;
        padding: 0.7rem;
        border: 1px solid var(--color-border);
        border-radius: 0.65rem;
        background: var(--color-second-bg);
    }
    .cloud-file-change.selected {
        border-color: color-mix(in srgb, var(--color-highlight) 48%, var(--color-border));
    }
    .cloud-file-change-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .cloud-file-change-selection {
        display: flex;
        align-items: center;
        min-width: 0;
        flex: 1 1 auto;
        gap: 0.5rem;
        cursor: pointer;
    }
    .cloud-file-change-checkbox {
        width: 1rem;
        height: 1rem;
        margin: 0;
        flex: 0 0 auto;
        accent-color: var(--color-highlight);
        cursor: pointer;
    }
    .cloud-file-change-checkbox:disabled {
        cursor: not-allowed;
    }
    .cloud-file-change-name {
        min-width: 0;
        overflow: hidden;
        color: var(--color-text);
        font-size: 0.82rem;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cloud-file-change-slug {
        color: var(--color-text-secondary);
        font-weight: 500;
    }
    .cloud-file-discard {
        padding: 0.25rem 0.6rem;
        flex: 0 0 auto;
        font-size: 0.72rem;
        border-color: color-mix(in srgb, var(--color-hard) 45%, var(--color-border));
    }
    .cloud-file-discard-selected {
        color: var(--color-hard);
    }
    .cloud-file-diff {
        min-width: 0;
        border-radius: 0.45rem;
        background: var(--color-bg);
        font-family: var(--font-mono);
        font-size: 0.72rem;
        line-height: 1.45;
    }
    .cloud-file-diff-heading {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        width: 100%;
        padding: 0.4rem 0.6rem;
        border: none;
        border-bottom: 1px solid var(--color-border);
        border-radius: 0.45rem 0.45rem 0 0;
        background: none;
        color: var(--color-text-secondary);
        font-family: var(--font-sans);
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
    }
    .cloud-file-diff-heading:hover {
        background: color-mix(in srgb, var(--color-highlight) 8%, transparent);
    }
    .cloud-file-diff-heading:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: -2px;
    }
    .diff-caret {
        flex: 0 0 auto;
        color: var(--color-text-secondary);
        font-size: 0.72rem;
        transition: transform 0.15s ease;
    }
    .cloud-file-diff-heading[aria-expanded='true'] .diff-caret {
        transform: rotate(0deg);
    }
    .cloud-file-diff-heading[aria-expanded='false'] .diff-caret {
        transform: rotate(-90deg);
    }
    .cloud-file-diff-body {
        max-height: 14rem;
        overflow: auto;
    }
    .cloud-file-lang-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }
    .cloud-file-blob-note {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        min-width: 0;
        overflow: hidden;
        padding: 0.4rem 0.6rem;
        border-radius: 0 0 0.45rem 0.45rem;
        background: color-mix(in srgb, var(--color-text) 6%, transparent);
        color: var(--color-text-secondary);
        font-family: var(--font-sans);
        font-size: 0.72rem;
    }
    .cloud-file-blob-note span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .diff-line {
        display: flex;
        gap: 0.5rem;
        padding: 0 0.6rem;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .diff-line code {
        font: inherit;
        color: inherit;
    }
    .diff-line.same {
        color: var(--color-text-secondary);
    }
    .diff-line.add {
        background: color-mix(in srgb, var(--color-easy) 12%, transparent);
        color: var(--color-text);
    }
    .diff-line.remove {
        background: color-mix(in srgb, var(--color-hard) 16%, transparent);
        color: var(--color-text);
    }
    .diff-marker {
        flex: 0 0 auto;
        width: 0.9rem;
        text-align: center;
        opacity: 0.6;
        user-select: none;
    }
    .diff-marker.add {
        color: var(--color-easy);
    }
    .diff-marker.remove {
        color: var(--color-hard);
    }
    .home-modal-card .cloud-offline-note {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: var(--color-second-bg);
        font-size: 0.76rem;
    }
    .cloud-history {
        display: grid;
        gap: 0.45rem;
        margin-top: 0.75rem;
        margin-right: 0.75rem;
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.65rem;
    }
    .cloud-history-heading,
    .cloud-history-details {
        display: grid;
        gap: 0.15rem;
    }
    .cloud-history-heading {
        margin-bottom: 0.2rem;
    }
    .cloud-history-heading strong {
        color: var(--color-text);
        font-size: 0.78rem;
    }
    .cloud-history-row strong {
        color: var(--color-text);
        font-size: 0.78rem;
        text-transform: uppercase;
    }
    .cloud-history-heading span,
    .cloud-history-details > span {
        color: var(--color-text-secondary);
        font-size: 0.7rem;
    }
    .cloud-history-list {
        display: grid;
    }
    .cloud-history-list.expanded {
        max-height: 10.5rem;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
    }
    .cloud-history-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-height: 2.35rem;
        padding-top: 0.45rem;
        border-top: 1px solid var(--color-border);
    }
    .cloud-history-details {
        min-width: 0;
    }
    .cloud-history-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 0.4rem;
    }
    .cloud-current-version {
        color: var(--color-easy);
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
    }
    .cloud-restore-version {
        padding: 0.35rem 0.55rem;
        font-size: 0.7rem;
    }
    .cloud-delete-version {
        padding: 0.35rem 0.5rem;
        color: var(--color-hard);
        font-size: 0.7rem;
    }
    .cloud-history-toggle {
        justify-self: center;
        padding: 0.2rem 0.35rem;
        border: 0;
        border-radius: 0.35rem;
        background: transparent;
        color: var(--color-highlight);
        font: inherit;
        font-size: 0.72rem;
        font-weight: 650;
        cursor: pointer;
    }
    .cloud-history-toggle:hover {
        background: var(--color-surface-hover);
    }
    .cloud-history-toggle:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 2px;
    }
    .firebase-status-pill {
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
    .firebase-status-pill span {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
        background: var(--color-text-secondary);
    }
    .firebase-status-pill.configured {
        color: var(--color-easy);
    }
    .firebase-status-pill.configured span {
        background: var(--color-easy);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-easy) 16%, transparent);
    }
    .modal-error {
        margin-top: 0.75rem !important;
        color: var(--color-hard) !important;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .settings-actions {
        border-top: 1px solid var(--color-border);
        padding-top: 1rem;
    }
    .remove-settings-btn {
        color: var(--color-hard);
    }
</style>
