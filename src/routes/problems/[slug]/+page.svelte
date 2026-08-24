<script lang="ts">
    import SaveStatus from '$lib/components/SaveStatus.svelte';
    import ExecutionPanel from '$lib/components/ExecutionPanel.svelte';
    import ShareModal from '$lib/components/ShareModal.svelte';
    import TabContextMenu from '$lib/components/TabContextMenu.svelte';
    import GameResultPopup from '$lib/components/GameResultPopup.svelte';
    import GameHistoryPopup from '$lib/components/GameHistoryPopup.svelte';
    import GameModePopup from '$lib/components/GameModePopup.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Whiteboard from '$lib/components/Whiteboard.svelte';
    import { WHITEBOARD_FILE_ID } from '$lib/cloudFileChange';
    import { showAlert, showConfirm } from '$lib/dialogs';
    import { consumeForkTransfer } from '$lib/forkTransfer';
    import { initFirebase, ensureAuthenticated } from '$lib/firebase';
    import { isDesktopRuntime } from '$lib/firebaseSettings';
    import { CLOUD_FLUSH_EVENT, isCloudRestoreInProgress, flushProgressStorageWrites } from '$lib/progressBackup';
    import codeStore from '$lib/stores/codeStore.js';
    import fileStore, { type FileEntry, fileSyncVersion } from '$lib/stores/fileStore.js';
    import { leftPaneWidthStore } from '$lib/stores/layoutStore';
    import userSettingsStorage, { type ThemeChoice } from '$lib/stores/userSettingsStorage';
    import userStore from '$lib/stores/userStore';
    import { getDifficultyClass, type ProgrammingLanguage } from '$lib/utils/util.js';
    import { doc, setDoc } from 'firebase/firestore/lite';
    import { browser } from '$app/environment';
    import { renderMarkdown } from '$lib/utils/markdown';
    import QRCode from 'qrcode';
    import { onMount, tick } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import gameResultsStore, { computeGameResult } from '$lib/stores/gameResultsStore';

    export let data;
    const problemId = data.problem.id;
    const isDesktopMode = browser && isDesktopRuntime();
    let isMac = false;
    let description = '';
    let constraints = '';

    $: {
        const text = data.problem.statement;
        const idx = text.search(/\n\*\*Constraints?\s*:/);
        if (idx === -1) {
            description = text;
            constraints = '';
        } else {
            description = text.slice(0, idx);
            constraints = text.slice(idx);
        }
    }
    let isGameMode = false;
    let gameStartTime = 0;
    let gameFinished = false;
    let gameCountdownSeconds: number | null = null;
    let gameExpired = false;
    let showGameResult = false;
    let gameResultStats: { runCount: number; submitCount: number; timeSpent: number } | null = null;
    let showGameHistory = false;
    let showGameStartPopup = false;

    $: problemResults = $gameResultsStore?.[problemId] || [];
    $: bestRank = (() => {
        const rankOrder: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
        let best = '';
        let bestVal = 0;
        for (const r of problemResults) {
            const v = rankOrder[r.rank] ?? 0;
            if (v > bestVal) { bestVal = v; best = r.rank; }
        }
        return best;
    })();
    let CodeEditor: any = null;
    let language: ProgrammingLanguage = $userSettingsStorage.preferredLanguage ?? 'java';
    const fileKey = () => `${problemId}`;
    const codeKey = () => `${problemId}:${language}`;

    // Tabs are grouped by fileId (language-agnostic)
    type TabMeta = { fileId: string; fileName: string; type?: 'editor' | 'whiteboard' };

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
        const groups = new Map<string, { fileId: string; fileName: string; order: number | null; firstIndex: number; type?: 'editor' | 'whiteboard' }>();
        files.forEach((f, idx) => {
            const existing = groups.get(f.fileId);
            const orderVal = (typeof f.order === 'number') ? f.order : null;
            const entryType: 'editor' | 'whiteboard' = f.type === 'whiteboard' ? 'whiteboard' : 'editor';
            if (!existing) {
                groups.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: entryType === 'whiteboard' ? 'Whiteboard' : (f.fileName || 'Solution'),
                    order: orderVal,
                    firstIndex: idx,
                    type: entryType
                });
            } else {
                if (entryType === 'whiteboard') {
                    existing.type = 'whiteboard';
                    existing.fileName = 'Whiteboard';
                }
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
        return list.map((g) => ({ fileId: g.fileId, fileName: g.fileName, type: g.type }));
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
                        viewState: null,
                        isActive: false,
                        order: tabIndex >= 0 ? tabIndex : undefined
                    } as FileEntry
                ];
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    let suppressSave = false; // prevent save during programmatic loads
    let skipNextSave = false; // prevent save when code was loaded from cross-tab sync

    let isFirebaseAvailable = false;
    let showShareModal = false;
    let shareUrl = '';
    let qrCodeDataUrl = '';

    async function loadOrInitFile(lang: ProgrammingLanguage) {
        if (activeTabId < 0 || activeTabId >= tabs.length) return;
        if (tabs[activeTabId].type === 'whiteboard') return;
        const currentId = tabs[activeTabId].fileId;
        const files = getFiles();
        const entry = files.find((x) => x.fileId === currentId && x.language === lang);
        suppressSave = true;
        if (entry) {
            code = entry.content;
            currentViewState = entry.viewState ?? null;
        } else {
            const starter = $codeStore[codeKey()] ?? data.problem.starterCode?.[lang] ?? '';
            code = starter;
            currentViewState = null;
            ensureEntry(currentId, lang, starter);
        }
        await tick();
        suppressSave = false;
    }

    let code: string;
    let currentViewState: string | null = null;
    let editorComponent: any;
    let debugBreakpoints: number[] = [];
    let activeDebugLine: number | null = null;
    let debugJobId: string | null = null;
    let isResizing = false;
    let workspaceElement: HTMLElement;
    let openedHints = new Set<number>([]);
    let viewMode: 'statement' | 'solution' = 'statement';

    let showSettings = false;
    let settingsContainer: HTMLElement | null = null;
    const fontSizes: number[] = Array.from({ length: 13 }, (_, i) => 12 + i); // 12..24
    let fontSize: number = $userSettingsStorage.editorFontSize ?? 14;
    let theme: ThemeChoice = $userSettingsStorage.theme ?? 'light';
    let vimMode: 'off' | 'on' = $userSettingsStorage.vimMode ?? 'off';

    let tabs: TabMeta[] = getInitialTabs();
    let activeTabId: number = 0;
    $: activeTab = tabs[activeTabId];
    let tabContextMenu: { x: number; y: number; fileId: string } | null = null;
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
    async function addNewTab(customName: string = '', customContent?: string, customLang: ProgrammingLanguage | null = null, customViewState: string | null = null) {
        suppressSave = true;
        const targetLang = customLang || language;
        const newTabName = customName || `Solution-${tabs.length + 1}`;
        const nextId = uuidv4();
        const fileName = newTabName;
        tabs = [...tabs, { fileId: nextId, fileName }];
        const newCode = customContent ?? (data.problem.starterCode?.[targetLang] ?? '');
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = [
                ...files,
                {
                    fileId: nextId,
                    fileName,
                    language: targetLang,
                    content: newCode,
                    viewState: customViewState,
                    isActive: false,
                    order: tabs.length - 1
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        language = targetLang;
        await loadOrInitFile(targetLang);
        persistTabOrder();
        if (!customName) {
            startRename(nextId, fileName);
        }
    }

    function persistTabOrder() {
        const fkey = fileKey();
        const orderById = new Map<string, number>();
        tabs.forEach((t, idx) => orderById.set(t.fileId, idx));
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                const idx = orderById.get(f.fileId);
                if (idx !== undefined) f.order = idx;
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    // --- Tab drag-and-drop reordering ---
    // HTML5 drag events are suppressed in Chromium by the tab's mousedown
    // preventDefault (which keeps focus in the editor), so tabs are reordered
    // with pointer events, same as the playground.
    type TabPointerDrag = { fileId: string; startX: number; startY: number; active: boolean; pointerId: number };
    let tabPointerDrag: TabPointerDrag | null = null;
    let tabDidDrag = false;
    /** Insertion index among tabs, -1 when not dragging */
    let tabDragInsertIndex = -1;

    function handleTabPointerDown(e: PointerEvent, fileId: string) {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest('button, input, a')) return;
        tabDidDrag = false;
        tabPointerDrag = { fileId, startX: e.clientX, startY: e.clientY, active: false, pointerId: e.pointerId };
        window.addEventListener('pointermove', onTabPointerMove);
        window.addEventListener('pointerup', onTabPointerUp);
        window.addEventListener('pointercancel', onTabPointerUp);
    }

    function onTabPointerMove(e: PointerEvent) {
        if (!tabPointerDrag || e.pointerId !== tabPointerDrag.pointerId) return;
        const dx = e.clientX - tabPointerDrag.startX;
        const dy = e.clientY - tabPointerDrag.startY;
        if (!tabPointerDrag.active) {
            if (Math.hypot(dx, dy) < 6) return;
            tabPointerDrag = { ...tabPointerDrag, active: true };
            tabDidDrag = true;
            document.body.classList.add('tab-dragging');
        }
        e.preventDefault();
        tabDragInsertIndex = computeTabInsertIndex(e.clientX);
    }

    function onTabPointerUp(e: PointerEvent) {
        if (!tabPointerDrag || e.pointerId !== tabPointerDrag.pointerId) return;
        const drag = tabPointerDrag;
        const wasActive = drag.active;
        const insertIndex = tabDragInsertIndex;
        window.removeEventListener('pointermove', onTabPointerMove);
        window.removeEventListener('pointerup', onTabPointerUp);
        window.removeEventListener('pointercancel', onTabPointerUp);
        document.body.classList.remove('tab-dragging');
        tabPointerDrag = null;
        tabDragInsertIndex = -1;
        if (!wasActive) {
            tabDidDrag = false;
            return;
        }
        e.preventDefault();
        if (insertIndex >= 0) {
            const fromIdx = tabs.findIndex((t) => t.fileId === drag.fileId);
            if (fromIdx >= 0 && fromIdx !== (fromIdx < insertIndex ? insertIndex - 1 : insertIndex)) {
                moveTabToIndex(drag.fileId, insertIndex);
            }
        }
        // Suppress the click that follows the drag
        setTimeout(() => { tabDidDrag = false; }, 0);
    }

    function computeTabInsertIndex(clientX: number): number {
        const els = Array.from(document.querySelectorAll<HTMLElement>('.editor-header .tab'));
        if (!els.length) return 0;
        for (let i = 0; i < els.length; i++) {
            const rect = els[i].getBoundingClientRect();
            if (clientX < rect.left + rect.width / 2) return i;
        }
        return els.length;
    }

    function moveTabToIndex(sourceFileId: string, insertIndex: number) {
        const fromIdx = tabs.findIndex((t) => t.fileId === sourceFileId);
        if (fromIdx < 0) return;
        insertIndex = Math.max(0, Math.min(insertIndex, tabs.length));
        const activeFileId = tabs[activeTabId]?.fileId;
        const updated = [...tabs];
        const [moved] = updated.splice(fromIdx, 1);
        const adjusted = fromIdx < insertIndex ? insertIndex - 1 : insertIndex;
        updated.splice(adjusted, 0, moved);
        tabs = updated;
        if (activeFileId) {
            const newIdx = tabs.findIndex((t) => t.fileId === activeFileId);
            if (newIdx !== -1) activeTabId = newIdx;
        }
        persistTabOrder();
    }

    function handleTabClick(t: TabMeta) {
        if (tabDidDrag) {
            tabDidDrag = false;
            return;
        }
        activateTab(t.fileId);
    }

    function closeTabContextMenu() {
        tabContextMenu = null;
    }

    function openTabContextMenu(e: MouseEvent, fileId: string) {
        e.preventDefault();
        e.stopPropagation();
        if (!tabs.some((tab) => tab.fileId === fileId)) return;

        const menuW = 160;
        const menuH = 120;
        const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
        const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
        tabContextMenu = { x: Math.max(8, x), y: Math.max(8, y), fileId };
    }

    $: tabDropIndicatorStyle = (() => {
        if (tabDragInsertIndex < 0) return null;
        const bar = document.querySelector<HTMLElement>('.editor-header .tab-bar');
        if (!bar) return null;
        const barRect = bar.getBoundingClientRect();
        const els = Array.from(document.querySelectorAll<HTMLElement>('.editor-header .tab'));
        let left: number;
        if (!els.length) {
            left = 0;
        } else if (tabDragInsertIndex === 0) {
            left = els[0].getBoundingClientRect().left - barRect.left - 4;
        } else if (tabDragInsertIndex >= els.length) {
            left = els[els.length - 1].getBoundingClientRect().right - barRect.left + 4;
        } else {
            const prev = els[tabDragInsertIndex - 1].getBoundingClientRect();
            const next = els[tabDragInsertIndex].getBoundingClientRect();
            left = (prev.right + next.left) / 2 - barRect.left;
        }
        return `left: ${left}px`;
    })();
    $: if (!suppressSave && code !== undefined) {
        if (!skipNextSave) {
            const fkey = fileKey();
            const latestViewState = editorComponent?.getViewState?.() || currentViewState;
            fileStore.update((s) => {
                let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                if (activeTabId < 0 || activeTabId >= tabs.length) return s;
                const existingFile = files.find(x => 
                    x.fileId === tabs[activeTabId].fileId &&
                    x.language === language
                );
                if (existingFile) {
                    existingFile.content = code;
                    existingFile.viewState = latestViewState;
                } else {
                    files = [...files, {
                        fileId: tabs[activeTabId].fileId,
                        fileName: tabs[activeTabId].fileName,
                        language: language,
                        content: code,
                        viewState: latestViewState,
                        isActive: false
                    } as FileEntry];
                }
                return {...s, [fkey]: JSON.stringify(files)};
            });
        }
        skipNextSave = false;
    }

    $: if (language) {
        debugBreakpoints = [];
        loadOrInitFile(language);
    }

    // Reload code when another browser tab changes the file store
    $: if ($fileSyncVersion > 0 && activeTabId >= 0 && activeTabId < tabs.length && language) {
        skipNextSave = true;
        loadOrInitFile(language);
        $fileSyncVersion;
    }

    async function closeTab(fileId: string, skipConfirm = false) {
        const tabToClose = tabs.find((t) => t.fileId === fileId);
        if (tabToClose?.type === 'whiteboard') {
            const idx = tabs.findIndex((t) => t.fileId === fileId);
            if (activeTabId === idx) {
                const next = tabs.find((x) => x.fileId !== fileId);
                if (next) await activateTab(next.fileId);
            }
            const fkey = fileKey();
            fileStore.update((s) => {
                let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                files = files.filter((f) => f.fileId !== fileId);
                return { ...s, [fkey]: JSON.stringify(files) };
            });
            tabs = tabs.filter((t) => t.fileId !== fileId);
            persistTabOrder();
            return;
        }
        if (tabs.length <= 1) return;
        if (!skipConfirm && !await showConfirm('This file and all of its saved language versions will be permanently removed.', {
            title: 'Remove file?',
            confirmLabel: 'Remove file',
            tone: 'danger'
        })) return;
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

    type TabContextAction = 'close' | 'left' | 'right' | 'others';

    function getContextTabIds(fileId: string, action: TabContextAction): string[] {
        const targetIndex = tabs.findIndex((tab) => tab.fileId === fileId);
        if (targetIndex === -1) return [];
        if (action === 'close') return [fileId];
        if (action === 'left') return tabs.slice(0, targetIndex).map((tab) => tab.fileId);
        if (action === 'right') return tabs.slice(targetIndex + 1).map((tab) => tab.fileId);
        return tabs.filter((_, index) => index !== targetIndex).map((tab) => tab.fileId);
    }

    async function closeTabsFromContext(action: TabContextAction) {
        const menu = tabContextMenu;
        if (!menu) return;
        const idsToClose = getContextTabIds(menu.fileId, action);
        closeTabContextMenu();
        if (!idsToClose.length) return;

        const filesToRemove = idsToClose.filter((fileId) => tabs.find((tab) => tab.fileId === fileId)?.type !== 'whiteboard');
        if (filesToRemove.length > 0) {
            const isSingleFile = filesToRemove.length === 1;
            if (!await showConfirm(
                isSingleFile
                    ? 'This file and all of its saved language versions will be permanently removed.'
                    : 'These files and all of their saved language versions will be permanently removed.',
                {
                    title: isSingleFile ? 'Remove file?' : 'Remove files?',
                    confirmLabel: isSingleFile ? 'Remove file' : 'Remove files',
                    tone: 'danger'
                }
            )) return;
        }

        for (const fileId of idsToClose) await closeTab(fileId, true);
    }

    function isContextTabCloseDisabled(fileId: string): boolean {
        const tab = tabs.find((item) => item.fileId === fileId);
        return !tab || (tabs.length <= 1 && tab.type !== 'whiteboard');
    }

    function isContextTabRenameDisabled(fileId: string): boolean {
        return tabs.find((tab) => tab.fileId === fileId)?.type === 'whiteboard';
    }

    function renameTabFromContext() {
        const menu = tabContextMenu;
        if (!menu) return;
        const tab = tabs.find((item) => item.fileId === menu.fileId);
        closeTabContextMenu();
        if (!tab || tab.type === 'whiteboard') return;
        startRename(tab.fileId, tab.fileName);
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

        const fb = await initFirebase();
        if (fb) isFirebaseAvailable = true;

        // Check for tabs and game mode in URL params
        const urlParams = new URLSearchParams(window.location.search);

        // Check for game mode
        if (urlParams.get('gameMode') === '1') {
            isGameMode = true;
            const countdownMinutes = Number(urlParams.get('minutes'));
            if (urlParams.get('countdown') === '1' && Number.isFinite(countdownMinutes) && countdownMinutes > 0) {
                gameCountdownSeconds = Math.round(countdownMinutes * 60);
            }
            gameStartTime = Date.now();
            // Force fresh starter code, ignore saved
            suppressSave = true;
            code = data.problem.starterCode?.[language] ?? '';
            await tick();
            suppressSave = false;
        }

        const tabsParam = urlParams.get('tabs');
        if (tabsParam) {
            try {
                const requestedTabs = JSON.parse(decodeURIComponent(tabsParam)) as { name: string, lang: ProgrammingLanguage, content?: string }[];
                if (requestedTabs.length > 0) {
                    suppressSave = true;
                    for (const rt of requestedTabs) {
                        await addNewTab(rt.name, rt.content, rt.lang);
                    }
                    if (requestedTabs.length > 0) {
                        window.history.replaceState({}, '', window.location.pathname);
                        suppressSave = false;
                        return;
                    }
                }
            } catch (e) {
                console.error('Failed to parse tabs from URL', e);
            }
        }

        const forkData = consumeForkTransfer();
        
        if (forkData) {
            await addNewTab(
                forkData.fileName ? `Fork of ${forkData.fileName}` : 'Forked Solution',
                forkData.content,
                forkData.language || language,
                forkData.viewState ?? null
            );
        }
    });

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
            if (tabContextMenu && !(e.target as HTMLElement | null)?.closest('.tab-context-menu')) {
                closeTabContextMenu();
            }
        };
        const handleDocContextMenu = (e: MouseEvent) => {
            if (tabContextMenu && !(e.target as HTMLElement | null)?.closest('.tab, .tab-context-menu')) {
                closeTabContextMenu();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                showSettings = false;
                closeTabContextMenu();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                toggleProblemPaneVisibility();
            }
            if (e.defaultPrevented) return;
            if (!isDesktopMode) return;
            if (!e.metaKey && !e.ctrlKey) return;
            if (e.altKey) return;
            const key = e.key.toLowerCase();
            // Desktop-only shortcuts: Ctrl/Cmd+W closes the active tab and
            // Ctrl/Cmd+1-9 activates the nth tab (left to right). In the browser
            // these keys are reserved by the browser itself.
            if (key === 'w' && !e.shiftKey) {
                const active = tabs[activeTabId];
                if (active) {
                    e.preventDefault();
                    closeTab(active.fileId);
                }
                return;
            }
            if (/^[1-9]$/.test(key)) {
                const target = tabs[parseInt(key, 10) - 1];
                if (target) {
                    e.preventDefault();
                    activateTab(target.fileId);
                }
            }
        };
        const handleUnload = () => {
            // Flush even during a cloud-restore window: deferred storage
            // writes are only resumed while the page stays alive, so they
            // would be silently dropped when the app closes.
            saveCurrentViewState();
            flushProgressStorageWrites();
        };
        const handleCloudFlush = () => {
            if (!isCloudRestoreInProgress()) saveCurrentViewState();
        };
        const handleResize = () => closeTabContextMenu();
        document.addEventListener('click', handleDocClick);
        document.addEventListener('contextmenu', handleDocContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('pagehide', handleUnload);
        window.addEventListener(CLOUD_FLUSH_EVENT, handleCloudFlush);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('click', handleDocClick);
            document.removeEventListener('contextmenu', handleDocContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('pagehide', handleUnload);
            window.removeEventListener(CLOUD_FLUSH_EVENT, handleCloudFlush);
            window.removeEventListener('resize', handleResize);
        };
    });

    function saveCurrentViewState() {
        if (!editorComponent || activeTabId < 0 || activeTabId >= tabs.length) return;
        const state = editorComponent.getViewState();
        if (!state) return;
        
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existingFile = files.find(x => 
                x.fileId === tabs[activeTabId].fileId &&
                x.language === language
            );
            if (existingFile) {
                if (existingFile.viewState === state) return s;
                existingFile.viewState = state;
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
        currentViewState = state;
    }

    async function activateTab(fileId?: string) {
        if (!fileId) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        saveCurrentViewState();
        activeTabId = idx;
        debugBreakpoints = [];
        if (tabs[idx].type === 'whiteboard') return;
        await loadOrInitFile(language);
    }

    async function openWhiteboard() {
        const existing = tabs.find((t) => t.type === 'whiteboard' || t.fileId === WHITEBOARD_FILE_ID);
        if (existing) {
            if (tabs[activeTabId]?.fileId === existing.fileId) {
                closeTab(existing.fileId);
                return;
            }
            await activateTab(existing.fileId);
            return;
        }
        const nextId = WHITEBOARD_FILE_ID;
        tabs = [...tabs, { fileId: nextId, fileName: 'Whiteboard', type: 'whiteboard' }];
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = [
                ...files,
                {
                    fileId: nextId,
                    fileName: 'Whiteboard',
                    language: 'plaintext',
                    content: '',
                    viewState: null,
                    isActive: false,
                    order: tabs.length - 1,
                    type: 'whiteboard'
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        persistTabOrder();
        await tick();
    }

    // Runtime image name (like in ExecutionPanel)
    let imageStatus: 'unknown' | 'present' | 'absent' = 'unknown';
    let imageName: string = '';
    // Problem pane visibility memory and toggle
    let lastNonZeroLeftWidth = 50; // default width percentage
    $: if ($leftPaneWidthStore && $leftPaneWidthStore > 0) {
        lastNonZeroLeftWidth = $leftPaneWidthStore;
    }
    function toggleProblemPaneVisibility() {
        const current = $leftPaneWidthStore === null ? 50 : $leftPaneWidthStore;
        if (current > 5) {
            lastNonZeroLeftWidth = current || lastNonZeroLeftWidth || 50;
            $leftPaneWidthStore = 0;
        } else {
            const restore = Math.max(10, Math.min(70, lastNonZeroLeftWidth || 50));
            $leftPaneWidthStore = restore;
        }
    }

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
    async function handleResetClick() {
        const confirmed = await showConfirm('Your current code will be replaced with the starter code. This action cannot be undone.', {
            title: 'Reset this file?',
            confirmLabel: 'Reset code',
            tone: 'danger'
        });
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

    async function openReferenceSolution() {
        if ($userStore && $userStore[fileKey()]) {
            viewMode = 'solution';
            return;
        }
        const confirmed = await showConfirm('Try solving the problem yourself before opening the reference solution.', {
            title: 'View reference solution?',
            confirmLabel: 'View solution'
        });
        if (confirmed) viewMode = 'solution';
    }

    $: {
        const currentFontSize = $userSettingsStorage.editorFontSize;
        if (typeof fontSize === 'number' && currentFontSize !== fontSize) {
            userSettingsStorage.update((s) => ({ ...s, editorFontSize: fontSize }));
        }
    }

    $: {
        const currentTheme = $userSettingsStorage.theme;
        if (theme && currentTheme !== theme) {
            userSettingsStorage.update((s) => ({ ...s, theme }));
        }
    }

    $: {
        const currentVimMode = $userSettingsStorage.vimMode;
        if (vimMode && currentVimMode !== vimMode) {
            userSettingsStorage.update((s) => ({ ...s, vimMode }));
        }
    }

    function generateShortId(length: number = 4): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async function handleShare() {
        const fb = await initFirebase();
        if (!fb || !fb.db) return;

        const shareId = generateShortId(4);
        
        // Get current file content
        const currentTab = tabs[activeTabId];
        const files = getFiles();
        const currentFile = files.find(f => f.fileId === currentTab.fileId && f.language === language);
        const content = currentFile ? currentFile.content : (data.problem.starterCode?.[language] ?? '');
        const viewState = currentFile ? currentFile.viewState : (editorComponent?.getViewState() || null);
        
        // Save to Firestore
        try {
            const user = await ensureAuthenticated();
            await setDoc(doc(fb.db, 'shares', shareId), {
                content,
                language,
                viewState,
                fileName: currentTab.fileName,
                createdAt: new Date(),
                problemId: data.problem.id,
                problemTitle: data.problem.title,
                ownerId: user.uid
            });
            
            shareUrl = `${window.location.origin}/p/${shareId}`;
            qrCodeDataUrl = await QRCode.toDataURL(shareUrl);
            showShareModal = true;
        } catch (e) {
            console.error('Error sharing:', e);
            await showAlert('The share link could not be created. Check your Firebase settings and try again.', {
                title: 'Share failed',
                tone: 'danger'
            });
        }
    }
</script>

<svelte:head>
    <title>{data.problem.title} - Cojudge</title>
</svelte:head>

<div
    class="workspace"
    bind:this={workspaceElement}
    style="grid-template-columns: {Math.max(0, $leftPaneWidthStore === null ? 50 : $leftPaneWidthStore)}% auto 1fr;"
>
    <!-- Left Pane: Problem Statement -->
    <div class="problem-pane" class:hide={($leftPaneWidthStore === null ? 50 : $leftPaneWidthStore) < 5}>
        <div class="prose">
            <Tooltip text={'Back'} pos="bottom"> 
                {#if viewMode === 'solution'}
                    <button class="back-button" aria-label="Back" on:click={() => viewMode = 'statement'}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                {:else}
                    <a class="back-button" href="/" aria-label="Back">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                {/if}
            </Tooltip>
            <Tooltip text={isMac ? "Cmd + B" : "Ctrl + B"} pos="bottom">
                <button
                    class="back-button"
                    aria-label={($leftPaneWidthStore === null ? 50 : $leftPaneWidthStore) > 5 ? 'Hide problem pane' : 'Show problem pane'}
                    on:click={toggleProblemPaneVisibility}
                >
                    {#if ($leftPaneWidthStore === null ? 50 : $leftPaneWidthStore) > 5}
                        <!-- Eye icon (visible) -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    {:else}
                        <!-- Eye-off icon (hidden) -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    {/if}
                </button>
            </Tooltip>
            <div class="title-row">
                <h1>{data.problem.title}</h1>
                {#if !isGameMode && $userStore && $userStore[fileKey()]}
                    <div class="title-badges">
                        <span class="solved-pill" title="You've solved this problem" aria-label="Solved" role="status">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Solved
                        </span>
                        {#if bestRank}
                            <button
                                class="game-rank-badge"
                                class:rank-s={bestRank === 'S'}
                                class:rank-a={bestRank === 'A'}
                                class:rank-b={bestRank === 'B'}
                                class:rank-c={bestRank === 'C'}
                                on:click={() => (showGameHistory = true)}
                                title="View game history"
                                aria-label="Rank {bestRank}, view game history"
                            >
                                {bestRank}
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
            <span class="badge {getDifficultyClass(data.problem.difficulty)}">
                {data.problem.difficulty}
            </span>
            <a href={data.problem.link} target="_blank" rel="noopener noreferrer" class="external-link">↗</a>
            {#if viewMode === 'solution'}
                <!-- Solution content from problems/[slug]/solution.md -->
                <div class="markdown-body">
                    {@html renderMarkdown(data.problem.solution)}
                </div>
            {:else}
                <!-- Statement content is sourced from problems/[slug]/statement.md (attached on server as problem.statement) -->
                <!-- Render description (everything before constraints), then examples, then constraints -->
                <div class="markdown-body">
                    {@html renderMarkdown(description)}
                </div>
                {#each data.problem.examples as example}
                    <div class="example">
                        <pre class="example-input">{example.input}</pre>
                        <pre class="example-output">{example.output}</pre>
                        {#if example.explanation}
                            <div class="example-explanation">
                                <strong>Explanation:</strong>
                                <div class="markdown-body">
                                    {@html renderMarkdown(example.explanation)}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
                {#if constraints}
                    <div class="markdown-body constraints-section">
                        {@html renderMarkdown(constraints)}
                    </div>
                {/if}

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
                                <div class="hint-body markdown-body">
                                    {@html renderMarkdown(hint)}
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}

                {#if data.problem.solution}
                    <div class="hint-item">
                        <button
                            class="hint-header"
                            class:unsolved={!($userStore && $userStore[fileKey()])}
                            on:click={openReferenceSolution}
                        >
                            <span>Reference Solution</span>
                            <span class="chevron">▸</span>
                        </button>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    <button class="resizer" aria-label="Resize panes" on:mousedown={handleMouseDown} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isResizing = true; } }}></button>

    <!-- Right Pane: Editor and Console -->
    <div class="editor-pane">
        <div class="editor-header" style="display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-2);border-bottom:1px solid var(--color-border);">
            <div class="lang-dropdown-tabs-container">
                {#if activeTab?.type !== 'whiteboard'}
                <div style="display:flex;gap:var(--spacing-2);align-items:center;">
                    <label for="language-select" style="font-size:0.9rem;color:var(--color-text-secondary);">Language</label>
                    <select
                        id="language-select"
                        bind:value={language}
                        on:focus={() => (suppressSave = true)}
                        on:mousedown={() => (suppressSave = true)}
                        on:keydown={() => (suppressSave = true)}
                        on:change={() => {
                            saveCurrentViewState();
                            // Persist preference; actual loading will be triggered by reactive `$: if (language)`
                            userSettingsStorage.update((s) => ({ ...s, preferredLanguage: language }));
                        }}
                        on:blur={() => (suppressSave = false)}
                    >
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="typescript">TypeScript</option>
                        <option value="csharp">C#</option>
                        <option value="rust">Rust</option>
                        <option value="go">Go</option>
                    </select>
                </div>
                {/if}
                <div class="tabs-container">
                    <div class="tab-bar" role="tablist" aria-label="Editor tabs">
                        {#each tabs as t}
                            <div
                                class="tab {t.fileId === tabs[activeTabId].fileId ? 'active' : ''} {tabPointerDrag?.active && tabPointerDrag.fileId === t.fileId ? 'is-dragging' : ''}"
                                role="tab"
                                aria-selected={t.fileId === tabs[activeTabId].fileId}
                                tabindex={t.fileId === tabs[activeTabId].fileId ? 0 : -1}
                                data-file-id={t.fileId}
                                on:click={() => handleTabClick(t)}
                                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(t.fileId); } }}
                                on:pointerdown={(e) => handleTabPointerDown(e, t.fileId)}
                                on:contextmenu={(e) => openTabContextMenu(e, t.fileId)}
                                on:mousedown={(e) => {
                                    if (e.button === 2) return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
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
                                    {#if t.type === 'whiteboard'}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:2px;flex-shrink:0;">
                                            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                            <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                                        </svg>
                                    {/if}
                                    <span class="tab-title">{t.fileName}</span>
                                {/if}
                                {#if t.type !== 'whiteboard'}
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
                                {/if}
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
                        {#if tabDropIndicatorStyle}
                            <div class="tab-drop-indicator" style={tabDropIndicatorStyle} aria-hidden="true"></div>
                        {/if}
                        <button class="tab-add" aria-label="New tab" title="New tab" on:click={() => addNewTab()}>+</button>
                    </div>
                </div>
                {#if tabContextMenu}
                    {@const tabContextPosition = tabs.findIndex((tab) => tab.fileId === tabContextMenu?.fileId)}
                    <TabContextMenu
                        x={tabContextMenu.x}
                        y={tabContextMenu.y}
                        closeDisabled={isContextTabCloseDisabled(tabContextMenu.fileId)}
                        renameDisabled={isContextTabRenameDisabled(tabContextMenu.fileId)}
                        closeLeftDisabled={tabContextPosition <= 0}
                        closeRightDisabled={tabContextPosition < 0 || tabContextPosition >= tabs.length - 1}
                        closeOthersDisabled={tabs.length <= 1}
                        on:close={() => closeTabsFromContext('close')}
                        on:closeLeft={() => closeTabsFromContext('left')}
                        on:closeRight={() => closeTabsFromContext('right')}
                        on:closeOthers={() => closeTabsFromContext('others')}
                        on:rename={renameTabFromContext}
                    />
                {/if}
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-2);">
                <Tooltip text={"Whiteboard"} pos={"bottom"}>
                    <button
                        class="icon-button {activeTab?.type === 'whiteboard' ? 'active' : ''}"
                        on:click={openWhiteboard}
                        title="Whiteboard"
                        aria-label="Whiteboard"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                            <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                        </svg>
                    </button>
                </Tooltip>
                {#if activeTab?.type !== 'whiteboard'}
                {#if !isGameMode}
                    <Tooltip text={"Start Game"} pos={"bottom"}>
                        <button class="icon-button game-start-btn" on:click={() => showGameStartPopup = true} title="Start Game">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 4l13 8-13 8V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </Tooltip>
                {/if}
                {#if isFirebaseAvailable}
                    <Tooltip text={"Share Code"} pos={"bottom"}>
                        <button class="icon-button" on:click={handleShare} title="Share Code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="16 6 12 2 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </Tooltip>
                    {/if}
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
                {/if}
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
                            <label for="theme-select">Theme</label>
                            <select id="theme-select" bind:value={theme}>
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                            <label for="vim-mode-select">Key Bindings</label>
                            <select id="vim-mode-select" bind:value={vimMode}>
                                <option value="off">Standard</option>
                                <option value="on">Vim</option>
                            </select>
                        </div>
                    {/if}
                </div>
                <div style="font-size:0.85rem;color:var(--color-text-secondary);">{activeTab?.type === 'whiteboard' ? 'Whiteboard' : (imageName || language.toUpperCase())}</div>
            </div>
        </div>

        <div class="editor-container" class:whiteboard-active={activeTab?.type === 'whiteboard'}>
            {#if activeTab?.type === 'whiteboard'}
                <div class="whiteboard-host">
                    <Whiteboard embedded active={true} />
                </div>
            {:else if CodeEditor}
                <svelte:component 
                    this={CodeEditor} 
                    bind:this={editorComponent}
                    bind:value={code} 
                    {language} 
                    {fontSize} 
                    {theme} 
                    {vimMode} 
                    viewState={currentViewState}
                    bind:breakpoints={debugBreakpoints}
                    {activeDebugLine}
                    {debugJobId}
                />
            {:else}
                Loading...
            {/if}
        </div>
        <ExecutionPanel
            problem={data.problem}
            {code}
            {language}
            gameMode={isGameMode}
            gameStartTime={gameStartTime}
            gameCountdownSeconds={gameCountdownSeconds}
            {gameFinished}
            debugBreakpoints={debugBreakpoints}
            bind:activeDebugLine={activeDebugLine}
            bind:debugJobId={debugJobId}
            on:gameTimeExpired={() => {
                if (gameFinished || gameResultStats) return;
                gameExpired = true;
                gameFinished = true;
                gameResultStats = { runCount: 0, submitCount: 0, timeSpent: gameCountdownSeconds || 0 };
                showGameResult = true;
            }}
            on:gameSubmitSuccess={(e) => {
                if (gameFinished || gameExpired) return;
                const { runCount, submitCount, timeSpent } = e.detail;
                const result = computeGameResult(runCount, submitCount, timeSpent, code, language);
                gameResultsStore.update((prev) => ({
                    ...prev,
                    [problemId]: [...(prev[problemId] || []), result],
                }));
                gameResultStats = { runCount, submitCount, timeSpent };
                showGameResult = true;
            }}
        />
    </div>

    {#if showShareModal}
        <ShareModal 
            url={shareUrl} 
            {qrCodeDataUrl} 
            {code}
            on:close={() => showShareModal = false} 
        />
    {/if}

    {#if showGameStartPopup}
        <GameModePopup
            currentProblemId={problemId}
            on:close={() => showGameStartPopup = false}
        />
    {/if}

    {#if showGameResult && gameResultStats}
        <GameResultPopup
            runCount={gameResultStats.runCount}
            submitCount={gameResultStats.submitCount}
            timeSpent={gameResultStats.timeSpent}
            expired={gameExpired}
            on:close={() => { showGameResult = false; gameFinished = true; }}
        />
    {/if}

    {#if showGameHistory}
        <GameHistoryPopup
            problemTitle={data.problem.title}
            results={$gameResultsStore?.[problemId] || []}
            on:close={() => showGameHistory = false}
        />
    {/if}
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
    .title-row {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-2);
    }
    .title-row h1 {
        margin: 0 0 var(--spacing-3) 0;
        flex: 1 1 auto;
        min-width: 0;
    }
    .title-badges {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        margin-top: 0.4em;
    }
    
    .back-button {
        border: 0;
        cursor: pointer;
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
    .pane-toggle { margin-left: 4px; }
    
    /* Right Pane Layout */
    .editor-pane {
        padding: 0; /* No padding on the pane itself */
    }

    .editor-container {
        flex-grow: 1;
        min-height: 0;
        padding: var(--spacing-1); /* Padding around the editor */
        display: flex;
        flex-direction: column;
    }

    .editor-container.whiteboard-active {
        padding: 0;
        position: relative;
        overflow: hidden;
    }

    .whiteboard-host {
        position: absolute;
        inset: 0;
        min-height: 0;
    }

    .icon-button.active {
        color: var(--color-highlight);
        background: rgba(255,255,255,0.06);
    }

    /* --- Browser-like Tabs --- */
    .tab-bar {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        padding: 0 var(--spacing-1) var(--spacing-1) var(--spacing-1);
        overflow-x: auto;
        scrollbar-width: thin;
        flex: 1;
        min-width: 0;
        flex-wrap: nowrap;
        position: relative;
    }
    /* Compact the tab bar when shown inside the header */
    .editor-header .tab-bar {
        padding: 0;
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
        flex-shrink: 0;
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
        -webkit-user-select: none;
        cursor: grab;
        touch-action: none;
    }
    .tab.is-dragging {
        opacity: 0.45;
    }
    .tab-drop-indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        width: 2px;
        border-radius: 1px;
        background: var(--color-highlight);
        pointer-events: none;
        z-index: 5;
    }
    :global(body.tab-dragging) {
        cursor: grabbing !important;
        user-select: none !important;
    }
    :global(body.tab-dragging .tab) {
        cursor: grabbing;
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

    .solved-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: var(--spacing-1) var(--spacing-2);
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 999px;
        background-color: var(--color-easy);
        color: var(--color-primary-text);
        flex: 0 0 auto;
    }

    .game-rank-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        min-width: 26px;
        flex-shrink: 0;
        aspect-ratio: 1;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 800;
        color: #fff;
        border: 2px solid rgba(255, 255, 255, 0.18);
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;
        line-height: 1;
        padding: 0;
        box-sizing: border-box;
    }
    .game-rank-badge:hover {
        transform: scale(1.12);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }
    .game-rank-badge.rank-s {
        background: linear-gradient(135deg, #ffd700, #f59e0b);
        box-shadow: 0 1px 6px rgba(245, 158, 11, 0.35);
    }
    .game-rank-badge.rank-a {
        background: linear-gradient(135deg, #34d399, #059669);
        box-shadow: 0 1px 6px rgba(16, 185, 129, 0.35);
    }
    .game-rank-badge.rank-b {
        background: linear-gradient(135deg, #60a5fa, #2563eb);
        box-shadow: 0 1px 6px rgba(59, 130, 246, 0.35);
    }
    .game-rank-badge.rank-c {
        background: linear-gradient(135deg, #9ca3af, #4b5563);
        box-shadow: 0 1px 6px rgba(107, 114, 128, 0.35);
    }

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
        padding: var(--spacing-3);
        border-radius: var(--border-radius-md);
    }

    .example pre {
        background: var(--color-second-bg);
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

    .example-explanation {
        margin-top: var(--spacing-2);
        color: var(--color-text-secondary);
    }

    .example-explanation .markdown-body {
        display: inline;
    }

    .example-explanation .markdown-body :global(p) {
        display: inline;
        margin: 0;
    }

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

    .game-start-btn:hover {
        color: var(--color-text);
        background: rgba(255, 255, 255, 0.05);
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
    .hint-header.unsolved {
        opacity: 0.5;
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
        gap: var(--spacing-2);
        flex: 1;
        min-width: 0;
    }
    
    .tabs-container {
        display: flex;
        gap: var(--spacing-2);
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    .constraints-section {
        margin-bottom: var(--spacing-5);
    }
</style>
