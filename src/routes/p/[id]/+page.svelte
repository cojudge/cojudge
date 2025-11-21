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
    let loading = true;
    let error = '';
    let CodeEditor: any = null;
    let fontSize = $userSettingsStorage.editorFontSize ?? 14;
    let theme = $userSettingsStorage.theme ?? 'light';

    const id = $page.params.id;

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;

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
</script>

<div class="page-container">
    {#if loading}
        <div class="center-msg">Loading...</div>
    {:else if error}
        <div class="center-msg error">{error}</div>
    {:else}
        <div class="header">
            <div class="title">
                <span class="file-name">{fileName}</span>
                <span class="lang-badge">{language}</span>
            </div>
            <button class="fork-btn" on:click={handleFork}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 6a9 9 0 0 0-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Fork to Playground
            </button>
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

    .file-name {
        font-weight: 600;
        font-size: 1.1rem;
    }

    .lang-badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        color: var(--color-text-secondary);
        text-transform: uppercase;
    }

    .fork-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: var(--color-highlight);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .fork-btn:hover {
        opacity: 0.9;
    }

    .editor-wrapper {
        flex: 1;
        position: relative;
        overflow: hidden;
    }
</style>
