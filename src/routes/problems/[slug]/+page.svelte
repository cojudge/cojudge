<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';
    import ExecutionPanel from '$lib/components/ExecutionPanel.svelte';
    import { getDifficultyClass, type ProgrammingLanguage } from '$lib/utils/util.js';
    import { leftPaneWidthStore } from '$lib/stores/layoutStore';
    import codeStore from '$lib/stores/codeStore';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import Tooltip from '$lib/components/Tooltip.svelte';

    export let data;
    const problemId = data.problem.id;
    let CodeEditor: any = null;
    // support per-problem-per-language storage using key `${problemId}:${language}`
    // default to user's preferred language from settings
    let language: ProgrammingLanguage = $userSettingsStorage.preferredLanguage ?? 'java';
    const codeKey = () => `${problemId}:${language}`;
    let code = $codeStore[codeKey()] ?? data.problem.starterCode?.[language] ?? '';
    let isResizing = false;
    let workspaceElement: HTMLElement;
    let openedHints = new Set<number>([]);

    // Persist code to store per problem+language
    $: if (code !== undefined) {
        const key = codeKey();
        codeStore.update((s) => (s[key] === code ? s : { ...s, [key]: code }));
    }

    function handleMouseDown(event: MouseEvent) {
        isResizing = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing || !workspaceElement) return;
        const workspaceRect = workspaceElement.getBoundingClientRect();
        const newWidth = event.clientX - workspaceRect.left;
        let newPercentage = (newWidth / workspaceRect.width) * 100;
        const constrainedPercentage = Math.min(90, newPercentage);
        $leftPaneWidthStore = constrainedPercentage;
    }

    function handleMouseUp() {
        isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;
    });

    // When language changes, refresh code from store or starter code, and persist globally
    $: if (language) {
        const stored = $codeStore[codeKey()];
        const starter = data.problem.starterCode?.[language] ?? '';
        if (stored !== undefined) {
            code = stored;
        } else {
            code = starter;
        }
    }

    // Runtime image name (like in ExecutionPanel)
    let imageStatus: 'unknown' | 'present' | 'absent' = 'unknown';
    let imageName: string = '';

    async function refreshImageStatus() {
        try {
            const res = await fetch(`/api/image/status?language=${encodeURIComponent(language)}`);
            if (!res.ok) throw new Error('status request failed');
            const body = await res.json();
            imageStatus = body.present ? 'present' : 'absent';
            imageName = body.image || '';
        } catch (e) {
            imageStatus = 'unknown';
            imageName = '';
        }
    }

    // Refresh image status on mount and when language changes
    onMount(refreshImageStatus);
    let lastLanguageChecked: string | null = null;
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = 'unknown';
        imageName = '';
        refreshImageStatus();
    }

    // Reset code for the current problem + language
    function handleResetClick() {
        const confirmed = confirm('Are you sure you want to reset the code for this language? This action cannot be undone.');
        if (!confirmed) return;
        // Remove only the current language of current problem from store
        const key = codeKey();
        codeStore.update((s) => {
            const next = { ...s };
            delete next[key];
            return next;
        });
        // Revert the editor to starter code for the current language
        code = data.problem.starterCode?.[language] ?? '';
    }
</script>

<svelte:head>
    <title>{data.problem.title}</title>
</svelte:head>

<div
    class="workspace"
    bind:this={workspaceElement}
    style="grid-template-columns: {Math.max(2, $leftPaneWidthStore === null ? 50 : $leftPaneWidthStore)}% auto 1fr;"
>
    <!-- Left Pane: Problem Statement -->
    <div class="problem-pane" class:hide={($leftPaneWidthStore === null ? 50 : $leftPaneWidthStore) < 5}>
        <div class="prose">
            <a class="back-button" href="/" aria-label="Back to problems list">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </a>
            <h1>{data.problem.title}</h1>
            <span class="badge {getDifficultyClass(data.problem.difficulty)}">
                {data.problem.difficulty}
            </span>
            <a href={data.problem.link} target="_blank" rel="noopener noreferrer" class="external-link">↗</a>
            <!-- Statement content is sourced from problems/[slug]/statement.md (attached on server as problem.statement) -->
            {@html marked(data.problem.statement)}
            {#each data.problem.examples as example}
                <div class="example">
                    <pre class="example-input">{example.input}</pre>
                    <pre class="example-output">{example.output}</pre>
                    {#if example.explanation}
                        {@html marked(example.explanation)}
                    {/if}
                </div>
            {/each}

            {#if data.problem.hints && data.problem.hints.length}
                {#each data.problem.hints as hint, i}
                    <div class="hint-item">
                        <button
                            class="hint-header"
                            on:click={() => {
                                const next = new Set(openedHints);
                                if (next.has(i)) next.delete(i); else next.add(i);
                                openedHints = next; // reassign to trigger reactivity
                            }}
                        >
                            <span>Hint {i + 1}</span>
                            <span class="chevron">{openedHints.has(i) ? "▾" : "▸"}</span>
                        </button>
                        {#if openedHints.has(i)}
                            <div class="hint-body">
                                {@html marked(hint)}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <button class="resizer" aria-label="Resize panes" on:mousedown={handleMouseDown} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isResizing = true; } }}></button>

    <!-- Right Pane: Editor and Console -->
    <div class="editor-pane">
        <div class="editor-header" style="display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-2);border-bottom:1px solid var(--color-border);">
            <div style="display:flex;gap:var(--spacing-2);align-items:center;">
                <label for="language-select" style="font-size:0.9rem;color:var(--color-text-secondary);">Language</label>
                <select id="language-select" bind:value={language} on:change={() => { 
                    // Update editor code with stored or starter code for the selected language
                    code = $codeStore[codeKey()] ?? data.problem.starterCode?.[language] ?? ''; 
                    // Persist the preferred language globally
                    userSettingsStorage.update((s) => ({ ...s, preferredLanguage: language }));
                }}>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                </select>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-2);">
                <Tooltip text={"Reset Code"} pos={"bottom"}>
                    <button
                        class="icon-button"
                        title="Reset Code"
                        aria-label="Reset Code"
                        on:click={handleResetClick}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 10a8 8 0 0 0-8-8 8 8 0 0 0-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 14a8 8 0 0 0 8 8 8 8 0 0 0 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </Tooltip>
                <div style="font-size:0.85rem;color:var(--color-text-secondary);">{imageName || language.toUpperCase()}</div>
            </div>
        </div>

        <div class="editor-container">
            {#if CodeEditor}
                <svelte:component this={CodeEditor} bind:value={code} {language} />
            {:else}
                Loading...
            {/if}
        </div>
        <ExecutionPanel problem={data.problem} {code} {language} />
    </div>
</div>

<style>
    .workspace {
        display: grid;
        gap: var(--spacing-1);
        height: 100vh;
        padding: var(--spacing-3);
        background-color: var(--color-bg); /* Use the main background */
    }

    .problem-pane, .editor-pane {
        background-color: var(--color-surface); /* Floating surface */
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .hide {
        opacity: 0;
    }

    .problem-pane {
        padding: var(--spacing-4);
        overflow: auto;
    }

    /* Prose styling for the dark theme */
    .prose h1 { font-size: 1.75rem; margin-bottom: var(--spacing-3); }
    
    .back-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: transparent;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: background-color 0.12s ease, color 0.12s ease;
    }

    .back-button:hover {
        background-color: rgba(255,255,255,0.03);
        color: var(--color-text);
    }
    
    /* Right Pane Layout */
    .editor-pane {
        padding: 0; /* No padding on the pane itself */
    }

    .editor-container {
        flex-grow: 1;
        min-height: 0;
        padding: var(--spacing-1); /* Padding around the editor */
    }

    .badge {
        display: inline-block;
        padding: var(--spacing-1) var(--spacing-2);
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 999px; /* Pill shape */
        color: var(--color-primary-text);
    }

    .difficulty-easy { background-color: var(--color-easy); }
    .difficulty-medium { background-color: var(--color-medium); }
    .difficulty-hard { background-color: var(--color-hard); color: #fff; }

    .external-link {
        color: var(--color-text-secondary);
        font-size: 0.8em;
        margin-left: var(--spacing-1);
    }

    .resizer {
        width: 10px; /* The clickable area is still 10px wide */
        cursor: col-resize;
        position: relative;
        background-color: transparent; /* Make the bar itself invisible */
        appearance: none;
        border: none;
        padding: 0;
        margin: 0;
    }

    /* This is the small, darker "grip" indicator */
    .resizer::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 32px;
        background-color: var(--color-border-active);
        border-radius: 4px;
        transition: background-color 0.2s ease-in-out;
    }

    /* On hover, we make the grip indicator more prominent */
    .resizer:hover::before {
        background-color: #b0b0b0; /* A darker grey for emphasis */
    }

    /* Example block styling */
    .example {
        margin-top: var(--spacing-4);
        background-color: rgba(255,255,255,0.02);
        border: 1px solid var(--color-border-active);
        padding: var(--spacing-3);
        border-radius: var(--border-radius-md);
    }

    .example pre {
        background: rgba(0,0,0,0.25);
        color: var(--color-text);
        padding: var(--spacing-2);
        border-radius: 6px;
        overflow: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
        font-size: 0.9rem;
        margin: var(--spacing-2) 0;
    }

    .example-input::before { content: 'Input: '; font-weight: 700; }
    .example-output::before { content: 'Output: '; font-weight: 700; }

    /* Small, subtle icon button */
    .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: transparent;
        color: var(--color-text-secondary);
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .icon-button:hover {
        transform: translateY(-2px);
    }

    /* Hints section */
    .hint-item {
        margin-top: var(--spacing-3);
        background-color: rgba(255,255,255,0.02);
        border: 1px solid var(--color-border-active);
        border-radius: var(--border-radius-md);
        overflow: hidden;
    }
    .hint-header {
        width: 100%;
        background: transparent;
        color: var(--color-text);
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2);
        padding: var(--spacing-2) var(--spacing-3);
        border: none;
        cursor: pointer;
        font-weight: 700;
    }
    .chevron {
        font-size: 1rem;
        opacity: 0.8;
    }
    .hint-body {
        padding: 0 var(--spacing-3) var(--spacing-3);
    }
</style>