<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { initFirebase } from '$lib/firebase';
    import { storeForkTransfer, type ForkTransfer } from '$lib/forkTransfer';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import { doc, getDoc } from 'firebase/firestore/lite';
    import { onMount } from 'svelte';

    let code = '';
    let language = 'java';
    let viewState = '';
    let fileName = '';
    let problemId = '';
    let problemTitle = '';
    let output = '';
    let logs = '';
    let loading = true;
    let error = '';
    let CodeEditor: any = null;
    let PlaygroundExecutionPanel: any = null;
    let fontSize = $userSettingsStorage.editorFontSize ?? 14;
    let theme = $userSettingsStorage.theme ?? 'light';
    let vimMode = $userSettingsStorage.vimMode ?? 'off';

    const id = $page.params.id || '';

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;
        const panelModule = await import('$lib/components/PlaygroundExecutionPanel.svelte');
        PlaygroundExecutionPanel = panelModule.default;

        const fb = await initFirebase();
        if (!fb || !fb.db) {
            error = 'Firebase not configured';
            loading = false;
            return;
        }

        try {
            const snap = await getDoc(doc(fb.db, 'shares', id));
            if (snap.exists()) {
                const data = snap.data();
                code = data.content || '';
                language = data.language || 'java';
                viewState = data.viewState || '';
                fileName = data.fileName || 'Solution';
                problemId = data.problemId || '';
                problemTitle = data.problemTitle || '';
                output = data.output || '';
                logs = data.logs || '';
            } else {
                error = 'Code does not exist.';
            }
        } catch (e) {
            console.error(e);
            error = 'Error loading solution';
        } finally {
            loading = false;
        }
    });

    function handleFork() {
        const transfer: ForkTransfer = {
            content: code,
            language: language as ForkTransfer['language'],
            viewState,
            fileName
        };
        storeForkTransfer(transfer);
        if (problemId) {
            void goto(`/problems/${problemId}`);
        } else {
            void goto('/playground');
        }
    }

    let sourceCopied = false;
    function copySourceCode() {
        navigator.clipboard.writeText(code);
        sourceCopied = true;
        setTimeout(() => {
            sourceCopied = false;
        }, 2000);
    }
</script>

<div class="page-container">
    {#if loading}
        <div class="center-msg">Loading...</div>
    {:else if error}
        <div class="center-msg error-state">
            <div class="error-card">
                <span class="error-eyebrow">Shared solution</span>
                <h1>{error === 'Code does not exist.' ? 'Solution not found' : 'Unable to load solution'}</h1>
                <p>
                    {#if error === 'Code does not exist.'}
                        Code <code>{id}</code> does not exist.
                    {:else}
                        {error}
                    {/if}
                </p>
                <button class="action-btn home-btn" on:click={() => goto('/')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 11 9-8 9 8"></path>
                        <path d="M5 10v11h14V10"></path>
                    </svg>
                    Home
                </button>
            </div>
        </div>
    {:else}
        <div class="header">
            <div class="title">
                <span class="lang-badge">{problemTitle}</span>
                <span class="lang-badge">{fileName} ({language})</span>
            </div>
            <div class="actions">
                <button class="action-btn" on:click={() => goto('/')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 11 9-8 9 8"></path>
                        <path d="M5 10v11h14V10"></path>
                    </svg>
                    Home
                </button>
                <button class="action-btn" on:click={copySourceCode}>
                    {#if sourceCopied}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Copied
                    {:else}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        Copy Source
                    {/if}
                </button>
                <button class="action-btn" on:click={handleFork}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 6a9 9 0 0 0-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Fork to {problemId ? 'Problem' : 'Playground'}
                </button>
            </div>
        </div>
        <div class="editor-wrapper">
            {#if CodeEditor}
                <svelte:component 
                    this={CodeEditor} 
                    value={code} 
                    {language} 
                    {fontSize} 
                    {theme} 
                    {vimMode}
                    readOnly={true}
                    viewState={viewState}
                />
            {/if}
        </div>
        {#if PlaygroundExecutionPanel}
            <svelte:component 
                this={PlaygroundExecutionPanel} 
                {code} 
                {language} 
                {output} 
                {logs} 
                readOnly={true}
            />
        {/if}
    {/if}
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--color-bg);
        color: var(--color-text);
    }

    .center-msg {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 1.2rem;
        color: var(--color-text-secondary);
    }

    .error-state {
        padding: 2rem;
        box-sizing: border-box;
    }

    .error-card {
        width: min(440px, 100%);
        padding: 2rem;
        box-sizing: border-box;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg, 16px);
        background: var(--color-surface);
        text-align: center;
        box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12);
    }

    .error-eyebrow {
        color: var(--color-highlight);
        font-size: 0.72rem;
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .error-card h1 {
        margin: 0.5rem 0;
        color: var(--color-text);
        font-size: 1.6rem;
    }

    .error-card p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.55;
    }

    .error-card code {
        padding: 0.1rem 0.35rem;
        border-radius: 0.3rem;
        background: var(--color-second-bg);
        color: var(--color-text);
        font-family: var(--font-mono);
    }

    .error-card .home-btn {
        margin: 1.4rem auto 0;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        border-bottom: 1px solid var(--color-border);
        background-color: var(--color-surface);
    }

    .title {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .lang-badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        color: var(--color-text-secondary);
        text-transform: uppercase;
    }

    .actions {
        display: flex;
        gap: 0.75rem;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
        font-size: 0.9rem;
        background-color: var(--color-highlight);
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }

    .action-btn:hover {
        opacity: 0.9;
    }

    .editor-wrapper {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    @media (max-width: 760px) {
        .header {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
        }
        .title {
            flex-wrap: wrap;
            gap: 0.45rem;
        }
        .actions {
            width: 100%;
            overflow-x: auto;
        }
        .action-btn {
            flex: 0 0 auto;
        }
    }
</style>
