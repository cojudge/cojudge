<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { marked } from 'marked';
    import ExecutionPanel from '$lib/components/ExecutionPanel.svelte';
    import { getDifficultyClass, type ProgrammingLanguage } from '$lib/utils/util.js';
    import { leftPaneWidthStore } from '$lib/stores/layoutStore';
    import fileStore, { type FileEntry } from '$lib/stores/fileStore.js';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import codeStore from '$lib/stores/codeStore.js';

    export let data;
    const problemId = data.problem.id;
    let CodeEditor: any = null;
    let language: ProgrammingLanguage = $userSettingsStorage.preferredLanguage ?? 'java';
    const fileKey = () => `${problemId}`;
    const codeKey = () => `${problemId}:${language}`;

    // Tabs are grouped by fileId (language-agnostic)
    type TabMeta = { fileId: string; fileName: string };

    function getFiles(): FileEntry[] {
        try {
            return JSON.parse($fileStore[fileKey()] || '[]') as FileEntry[];
        } catch (err) {
            return [];
        }
    }

    function getInitialTabs(): TabMeta[] {
        const files = getFiles();
        if (!files.length) {
            // Create a default tab; the language-specific entry will be created lazily
            return [{ fileId: uuidv4(), fileName: 'Solution' }];
        }
        const groups = new Map<string, { fileId: string; fileName: string; order: number | null; firstIndex: number }>();
        files.forEach((f, idx) => {
            const existing = groups.get(f.fileId);
            const orderVal = (typeof (f as any).order === 'number') ? (f as any).order as number : null;
            if (!existing) {
                groups.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: f.fileName || 'Solution',
                    order: orderVal,
                    firstIndex: idx
                });
            } else {
                if (orderVal !== null) {
                    if (existing.order === null || orderVal < existing.order) existing.order = orderVal;
                }
            }
        });
        const list = Array.from(groups.values());
        list.sort((a, b) => {
            const ao = a.order; const bo = b.order;
            if (ao !== null && bo !== null) return ao - bo;
            if (ao !== null) return -1;
            if (bo !== null) return 1;
            // Fallback to first appearance order in stored array
            return a.firstIndex - b.firstIndex;
        });
        return list.map((g) => ({ fileId: g.fileId, fileName: g.fileName }));
    }

    // Ensure an entry exists for current tab+language, optionally with initial content
    function ensureEntry(fileId: string, lang: ProgrammingLanguage, initialContent: string) {
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existing = files.find((x) => x.fileId === fileId && x.language === lang);
            if (!existing) {
                const tabIndex = tabs.findIndex((t) => t.fileId === fileId);
                files = [
                    ...files,
                    {
                        fileId,
                        fileName: (tabs.find((t) => t.fileId === fileId)?.fileName) || 'Solution',
                        language: lang,
                        content: initialContent,
                        isActive: false,
                        order: tabIndex >= 0 ? tabIndex : undefined
                    } as FileEntry
                ];
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    let suppressSave = false; // prevent save during programmatic loads

    async function loadOrInitFile(lang: ProgrammingLanguage) {
        if (activeTabId < 0 || activeTabId >= tabs.length) return;
        const currentId = tabs[activeTabId].fileId;
        const files = getFiles();
        const entry = files.find((x) => x.fileId === currentId && x.language === lang);
        suppressSave = true;
        if (entry) {
            code = entry.content;
        } else {
            const starter = $codeStore[codeKey()] ?? data.problem.starterCode?.[lang] ?? '';
            code = starter;
            ensureEntry(currentId, lang, starter);
        }
        await tick();
        suppressSave = false;
    }

    let code: string;
    let isResizing = false;
    let workspaceElement: HTMLElement;
    let openedHints = new Set<number>([]);

    let showSettings = false;
    let settingsContainer: HTMLElement | null = null;
    const fontSizes: number[] = Array.from({ length: 13 }, (_, i) => 12 + i); // 12..24
    let fontSize: number = $userSettingsStorage.editorFontSize ?? 14;

    let tabs: TabMeta[] = getInitialTabs();
    let activeTabId: number = 0;
    let editingTabId: string | null = null;
    let editingName = '';
    let renameInputEl: HTMLInputElement | null = null;

    function startRename(fileId: string, currentName: string) {
        editingTabId = fileId;
        editingName = currentName;
        // Focus the input on next tick
        tick().then(() => {
            renameInputEl?.focus();
            renameInputEl?.select();
        });
    }

    function applyRename() {
        if (!editingTabId) return;
        const newName = editingName.trim();
        const targetId = editingTabId;
        const oldName = tabs.find(t => t.fileId === targetId)?.fileName || 'Solution';
        const finalName = newName || oldName;
        // Update tabs
        tabs = tabs.map(t => t.fileId === targetId ? { ...t, fileName: finalName } : t);
        // Update all store entries for this fileId
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                if (f.fileId === targetId) f.fileName = finalName;
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        editingTabId = null;
        editingName = '';
        renameInputEl = null;
    }

    function cancelRename() {
        editingTabId = null;
        editingName = '';
        renameInputEl = null;
    }

    // New tab state (simple add button)
    async function addNewTab() {
        const newTabName = `Solution-${tabs.length + 1}`;
        const nextId = uuidv4();
        const fileName = newTabName.trim() || `Solution-${nextId}`;
        tabs = [...tabs, { fileId: nextId, fileName }];
        const newCode = data.problem.starterCode?.[language] ?? '';
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = [
                ...files,
                {
                    fileId: nextId,
                    fileName,
                    language: language,
                    content: newCode,
                    isActive: false,
                    order: tabs.length - 1
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        await loadOrInitFile(language);
        persistTabOrder();
        startRename(nextId, fileName);
    }

    function persistTabOrder() {
        const fkey = fileKey();
        const orderById = new Map<string, number>();
        tabs.forEach((t, idx) => orderById.set(t.fileId, idx));
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                const idx = orderById.get(f.fileId);
                if (idx !== undefined) (f as any).order = idx;
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    function moveTab(sourceId: string, targetId: string) {
        if (sourceId === targetId) return;
        const from = tabs.findIndex((t) => t.fileId === sourceId);
        const to = tabs.findIndex((t) => t.fileId === targetId);
        if (from < 0 || to < 0) return;
        const activeFileId = tabs[activeTabId]?.fileId;
        const updated = [...tabs];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        tabs = updated;
        // Recompute activeTabId by locating current active fileId
        if (activeFileId) {
            const newIdx = tabs.findIndex((t) => t.fileId === activeFileId);
            if (newIdx !== -1) activeTabId = newIdx;
        }
        persistTabOrder();
    }

    let draggingId: string | null = null;
    function handleDragStart(e: DragEvent, fileId: string) {
        draggingId = fileId;
        try { e.dataTransfer?.setData('text/plain', fileId); } catch {}
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    }
    function handleDragOver(e: DragEvent, _fileId: string) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    }
    function handleDrop(e: DragEvent, targetId: string) {
        e.preventDefault();
        const source = draggingId || e.dataTransfer?.getData('text/plain') || '';
        if (source) moveTab(source, targetId);
        draggingId = null;
    }
    function handleDragEnd() {
        draggingId = null;
    }
    $: if (!suppressSave && code !== undefined) {
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            if (activeTabId < 0 || activeTabId >= tabs.length) return s;
            const existingFile = files.find(x => 
                x.fileId === tabs[activeTabId].fileId &&
                x.language === language
            );
            if (existingFile) {
                existingFile.content = code;
            } else {
                files = [...files, {
                    fileId: tabs[activeTabId].fileId,
                    fileName: tabs[activeTabId].fileName,
                    language: language,
                    content: code,
                    isActive: false
                } as FileEntry];
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
    }

    $: if (language) {
        loadOrInitFile(language);
    }

    function closeTab(fileId: string) {
        if (tabs.length <= 1) return;
        if (!confirm("Are you sure you want to remove this file? This action cannot be undone")) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        if (activeTabId === idx) {
            activateTab(tabs.find(x => x.fileId !== fileId)?.fileId);
        }
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.filter((f) => f.fileId !== fileId);
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        // Update tabs list
        const newTabs = tabs.filter((t) => t.fileId !== fileId);
        tabs = newTabs;
        // Re-number orders after removal
        persistTabOrder();
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

    onMount(() => {
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                showSettings = false;
            }
        };
        document.addEventListener('click', handleDocClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('click', handleDocClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    async function activateTab(fileId?: string) {
        if (!fileId) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        activeTabId = idx;
        await loadOrInitFile(language);
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
        const confirmed = confirm('Are you sure you want to reset the code for this file? This action cannot be undone.');
        if (!confirmed) return;
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existingFile = files.find(x => x.fileId === tabs[activeTabId].fileId && x.language === language); 
            if (existingFile) {
                existingFile.content = data.problem.starterCode?.[language] ?? '';
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
        code = data.problem.starterCode?.[language] ?? '';
    }

    $: if (typeof fontSize === 'number') {
        userSettingsStorage.update((s) => ({ ...s, editorFontSize: fontSize }));
    }
</script>

<svelte:head>
    <title>{data.problem.title} - Cojudge</title>
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
            <div class="lang-dropdown-tabs-container">
                <div style="display:flex;gap:var(--spacing-2);align-items:center;">
                    <label for="language-select" style="font-size:0.9rem;color:var(--color-text-secondary);">Language</label>
                    <select
                        id="language-select"
                        bind:value={language}
                        on:focus={() => (suppressSave = true)}
                        on:mousedown={() => (suppressSave = true)}
                        on:keydown={() => (suppressSave = true)}
                        on:change={() => {
                            // Persist preference; actual loading will be triggered by reactive `$: if (language)`
                            userSettingsStorage.update((s) => ({ ...s, preferredLanguage: language }));
                        }}
                        on:blur={() => (suppressSave = false)}
                    >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <div style="display:flex;gap:var(--spacing-2);align-items:center;">
                    <div class="tab-bar" role="tablist" aria-label="Editor tabs">
                        {#each tabs as t}
                            <div
                                class="tab {t.fileId === tabs[activeTabId].fileId ? 'active' : ''}"
                                role="tab"
                                aria-selected={t.fileId === tabs[activeTabId].fileId}
                                tabindex={t.fileId === tabs[activeTabId].fileId ? 0 : -1}
                                on:click={() => activateTab(t.fileId)}
                                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(t.fileId); } }}
                                draggable={true}
                                on:dragstart={(e) => handleDragStart(e, t.fileId)}
                                on:dragover={(e) => handleDragOver(e, t.fileId)}
                                on:drop={(e) => handleDrop(e, t.fileId)}
                                on:dragend={handleDragEnd}
                                on:auxclick={(e) => { if (e.button === 1) { e.preventDefault(); e.stopPropagation(); closeTab(t.fileId); } }}
                            >
                                {#if editingTabId === t.fileId}
                                    <input
                                        class="tab-rename-input"
                                        type="text"
                                        bind:value={editingName}
                                        bind:this={renameInputEl}
                                        on:click|stopPropagation
                                        on:keydown|stopPropagation={(e) => {
                                            if (e.key === 'Enter') { e.preventDefault(); applyRename(); }
                                            else if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
                                        }}
                                        on:blur={applyRename}
                                    />
                                {:else}
                                    <span class="tab-title">{t.fileName}</span>
                                {/if}
                                <button
                                    class="tab-rename"
                                    aria-label="Rename tab"
                                    title="Rename"
                                    on:click|stopPropagation={() => startRename(t.fileId, t.fileName)}
                                >
                                    <!-- Pencil icon -->
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                        <path d="M14.06 6.19l3.75 3.75 1.69-1.69a1.5 1.5 0 000-2.12L17.87 4.5a1.5 1.5 0 00-2.12 0l-1.69 1.69z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                    </svg>
                                </button>
                                {#if tabs.length > 1}
                                    <button
                                        class="tab-close"
                                        aria-label="Close tab"
                                        title="Close"
                                        on:click|stopPropagation={() => closeTab(t.fileId)}
                                    >
                                        ×
                                    </button>
                                {/if}
                            </div>
                        {/each}
                        <button class="tab-add" aria-label="New tab" title="New tab" on:click={addNewTab}>+</button>
                    </div>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-2);">
                <Tooltip text={"Reset Code"} pos={"bottom"}>
                    <button
                        class="icon-button"
                        title="Reset Code"
                        aria-label="Reset Code"
                        on:click={handleResetClick}
                    >
                        <!-- Reset icon -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 10a8 8 0 0 0-8-8 8 8 0 0 0-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 14a8 8 0 0 0 8 8 8 8 0 0 0 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </Tooltip>
                <div class="settings-wrapper" bind:this={settingsContainer}>
                    <Tooltip text={"Settings"} pos={"bottom"}>
                        <button
                            class="icon-button"
                            title="Editor Settings"
                            aria-label="Editor Settings"
                            on:click={() => (showSettings = !showSettings)}
                        >
                            <!-- Cog icon -->
                            <svg width="16px" height="16px" viewBox="0 0 32 32" id="Lager_100" data-name="Lager 100" xmlns="http://www.w3.org/2000/svg">
                                <path id="Path_78" data-name="Path 78" d="M30.329,13.721l-2.65-.441a11.922,11.922,0,0,0-1.524-3.653l1.476-2.066a1.983,1.983,0,0,0-.211-2.553l-.428-.428a1.983,1.983,0,0,0-2.553-.211L22.373,5.845A11.922,11.922,0,0,0,18.72,4.321l-.441-2.65A2,2,0,0,0,16.306,0h-.612a2,2,0,0,0-1.973,1.671l-.441,2.65A11.922,11.922,0,0,0,9.627,5.845L7.561,4.369a1.983,1.983,0,0,0-2.553.211l-.428.428a1.983,1.983,0,0,0-.211,2.553L5.845,9.627A11.922,11.922,0,0,0,4.321,13.28l-2.65.441A2,2,0,0,0,0,15.694v.612a2,2,0,0,0,1.671,1.973l2.65.441a11.922,11.922,0,0,0,1.524,3.653L4.369,24.439a1.983,1.983,0,0,0,.211,2.553l.428.428a1.983,1.983,0,0,0,2.553.211l2.066-1.476a11.922,11.922,0,0,0,3.653,1.524l.441,2.65A2,2,0,0,0,15.694,32h.612a2,2,0,0,0,1.973-1.671l.441-2.65a11.922,11.922,0,0,0,3.653-1.524l2.066,1.476a1.983,1.983,0,0,0,2.553-.211l.428-.428a1.983,1.983,0,0,0,.211-2.553l-1.476-2.066a11.922,11.922,0,0,0,1.524-3.653l2.65-.441A2,2,0,0,0,32,16.306v-.612A2,2,0,0,0,30.329,13.721ZM16,22a6,6,0,1,1,6-6A6,6,0,0,1,16,22Z" 
                                    fill="currentColor"/>
                            </svg>
                        </button>
                    </Tooltip>
                    {#if showSettings}
                        <div class="settings-dropdown" role="dialog" aria-label="Editor settings">
                            <label for="font-size-select">Font size</label>
                            <select id="font-size-select" bind:value={fontSize}>
                                {#each fontSizes as size}
                                    <option value={size}>{size}px</option>
                                {/each}
                            </select>
                        </div>
                    {/if}
                </div>
                <div style="font-size:0.85rem;color:var(--color-text-secondary);">{imageName || language.toUpperCase()}</div>
            </div>
        </div>

        <div class="editor-container">
            {#if CodeEditor}
                <svelte:component this={CodeEditor} bind:value={code} {language} {fontSize} />
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

    /* --- Browser-like Tabs --- */
    .tab-bar {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        padding: 0 var(--spacing-1) var(--spacing-1) var(--spacing-1);
        overflow-x: auto;
        scrollbar-width: thin;
    }
    /* Compact the tab bar when shown inside the header */
    .editor-header .tab-bar {
        padding: 0;
    }
    .tab-bar {
        flex-wrap: nowrap;
    }
    .tab-add {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        margin-left: 4px;
    }
    .tab-add:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }
    .tab {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border: 1px solid var(--color-border);
        background: rgba(255,255,255,0.02);
        color: var(--color-text);
        border-radius: 10px 10px 0 0;
        font-size: 0.85rem;
        line-height: 1;
        user-select: none;
    }
    .tab.active {
        background-color: var(--color-surface);
        border-bottom-color: var(--color-highlight);
        box-shadow: 0 -1px 0 var(--color-surface), 0 1px 0 var(--color-surface);
    }
    .tab-favicon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.7rem;
        color: var(--color-primary-text);
        background: var(--color-border-active);
    }
    .tab-title {
        white-space: nowrap;
        max-width: 24ch;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tab:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
        cursor: pointer;
    }

    .tab-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        line-height: 1;
        font-size: 12px;
        padding: 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.12s ease-in-out;
    }
    .tab-close:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }

    .tab-rename {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 4px;
        border-radius: 4px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        line-height: 1;
        font-size: 12px;
        padding: 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.12s ease-in-out;
    }
    .tab-rename:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }

    .tab:hover .tab-rename,
    .tab:hover .tab-close,
    .tab.active .tab-rename,
    .tab.active .tab-close {
        visibility: visible;
        opacity: 1;
    }

    .tab-rename-input {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        border-radius: 4px;
        padding: 2px 4px;
        font-size: 0.85rem;
        max-width: 18ch;
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

    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: grid;
        place-items: center;
        z-index: 50;
    }
    .modal {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        width: min(420px, calc(100vw - 32px));
        box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        overflow: hidden;
    }
    .modal-body {
        display: grid;
        gap: 8px;
        padding: 16px;
    }
    .modal-label {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
    }
    .modal-input {
        background: transparent;
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 6px 8px;
        font-family: inherit;
    }
    .modal-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        padding: 12px 16px 16px;
    }
    .btn {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        font: inherit;
    }
    .btn.primary {
        border-color: var(--color-border-active);
        background: rgba(255,255,255,0.06);
    }

    /* Settings dropdown */
    .settings-wrapper {
        position: relative;
        display: inline-block;
    }
    .settings-dropdown {
        position: absolute;
        top: 36px;
        right: 0;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-2);
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        z-index: 20;
        min-width: 170px;
        display: grid;
        gap: var(--spacing-1);
    }
    .settings-dropdown label {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
    }
    .settings-dropdown select, #language-select {
        background: var(--color-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 6px 8px;
        font-family: inherit;
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

    .lang-dropdown-tabs-container {
        display: flex;
        gap:var(--spacing-2);
    }
</style>