<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { initFirebase } from '$lib/firebase';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import { doc, getDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let code = '';
    let language = 'java';
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

    const id = $page.params.id || '';

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;
        const panelModule = await import('$lib/components/PlaygroundExecutionPanel.svelte');
        PlaygroundExecutionPanel = panelModule.default;

        const fb = initFirebase();
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
                fileName = data.fileName || 'Solution';
                problemId = data.problemId || '';
                problemTitle = data.problemTitle || '';
                output = data.output || '';
                logs = data.logs || '';
            } else {
                error = 'Solution not found';
            }
        } catch (e) {
            console.error(e);
            error = 'Error loading solution';
        } finally {
            loading = false;
        }
    });

    function handleFork() {
        if (problemId) {
            goto(`/problems/${problemId}`, {
                state: {
                    forkData: {
                        content: code,
                        language: language,
                        fileName: fileName
                    }
                }
            });
        } else {
            goto('/playground', {
                state: {
                    forkData: {
                        content: code,
                        language: language,
                        fileName: fileName
                    }
                }
            });
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
        <div class="center-msg error">{error}</div>
    {:else}
        <div class="header">
            <div class="title">
                <span class="lang-badge">{problemTitle}</span>
                <span class="lang-badge">{fileName} ({language})</span>
            </div>
            <div class="actions">
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
                    readOnly={true}
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

    .error {
        color: #ff4d4f;
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
</style>
