<script lang="ts">
    export let data;
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import SortIcon from "$lib/components/SortIcon.svelte";
    import codeStore from '$lib/stores/codeStore';
    import fileStore from '$lib/stores/fileStore';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import userStore from "$lib/stores/userStore";
    import { getDifficultyClass } from "$lib/utils/util.js";
    import GameModePopup from "$lib/components/GameModePopup.svelte";
    import GameHistoryPopup from "$lib/components/GameHistoryPopup.svelte";
    import gameResultsStore, { type GameResult } from '$lib/stores/gameResultsStore';
    import {
        clearFirebaseSettings,
        emptyFirebaseSettings,
        getFirebaseSettings,
        hasSavedFirebaseSettings,
        isFirebaseConfigured,
        isDesktopRuntime,
        saveFirebaseSettings,
        type FirebaseSettings
    } from '$lib/firebaseSettings';
    let fileInputEl: HTMLInputElement | null = null;
    let dropdownToggleButton: HTMLButtonElement | null = null;
    let importConfirmButton: HTMLButtonElement | null = null;
    let importModalCard: HTMLElement | null = null;
    let firebaseModalCard: HTMLElement | null = null;
    let firebaseApiKeyInput: HTMLInputElement | null = null;
    let loadModalCard: HTMLElement | null = null;
    let loadCodeInputs: HTMLInputElement[] = [];
    let pendingImport: Record<string, unknown> | null = null;
    let importNotice: { message: string; error: boolean } | null = null;
    let importNoticeTimer: ReturnType<typeof setTimeout> | undefined;
    let showFirebaseSettings = false;
    let showLoadCode = false;
    let firebaseForm: FirebaseSettings = emptyFirebaseSettings();
    let firebaseSettingsError = '';
    let firebaseSettingsSaved = browser && hasSavedFirebaseSettings();
    let firebaseConfigured = browser && isFirebaseConfigured();
    let loadCodeCharacters = ['', '', '', ''];
    let loadCodeNavigating = false;
    let checkMap: Record<string, boolean> = {};
    let showGamePopup = false;
    let isDesktopMode = browser && isDesktopRuntime();
    $: if (browser) {
        document.body.style.overflow = showGamePopup || pendingImport || showFirebaseSettings || showLoadCode ? 'hidden' : '';
    }
    let gameResultData: Record<string, GameResult[]> = {};
    let historyProblem: { id: string; title: string } | null = null;

    let searchQuery = "";
    let searchCollapsedGroups = new Set<string>();

    $: if (!searchQuery.trim()) {
        searchCollapsedGroups.clear();
        searchCollapsedGroups = new Set();
    }

    let filteredProblems: Problem[] = [];
    $: {
        if (!searchQuery.trim()) {
            filteredProblems = selectedCourseProblems;
        } else {
            const query = searchQuery.toLowerCase().trim();
            filteredProblems = selectedCourseProblems.filter((p) => {
                const titleMatch = (p.title || "").toLowerCase().includes(query);
                const slugMatch = (p.id || "").toLowerCase().includes(query);
                const statementMatch = (p.statement || "").toLowerCase().includes(query);
                return titleMatch || slugMatch || statementMatch;
            });
        }
    }

    let isGroupOpenMap: Record<string, boolean> = {};
    $: {
        const map: Record<string, boolean> = {};
        const keys = Object.keys(grouped);
        for (const key of keys) {
            if (searchQuery.trim()) {
                map[key] = !searchCollapsedGroups.has(key);
            } else {
                map[key] = openGroups.has(key);
            }
        }
        isGroupOpenMap = map;
    }

    const unsubResults = gameResultsStore.subscribe((v) => {
        gameResultData = v || {};
    });
    onDestroy(() => unsubResults());

    $: bestRanks = (() => {
        const map: Record<string, string> = {};
        const rankOrder: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
        for (const [slug, arr] of Object.entries(gameResultData)) {
            let best = '';
            let bestVal = 0;
            for (const r of arr) {
                const v = rankOrder[r.rank] ?? 0;
                if (v > bestVal) { bestVal = v; best = r.rank; }
            }
            if (best) map[slug] = best;
        }
        return map;
    })();

    // Keep a local copy of the store for easy access in the template
    const unsubscribe = userStore.subscribe((value) => {
        checkMap = value || {};
    });
// When this component is destroyed, unsubscribe
    import Tooltip from "$lib/components/Tooltip.svelte";
    import { marked } from "marked";
    import { onDestroy, onMount, tick } from "svelte";
    onDestroy(() => unsubscribe());
    onDestroy(() => {
        if (importNoticeTimer) clearTimeout(importNoticeTimer);
        if (browser) document.body.style.overflow = '';
    });

    let showDropdown = false;
    let dropdownRef: HTMLDivElement | null = null;
    let dropdownMenu: HTMLDivElement | null = null;

    function handleClickOutside(event: MouseEvent) {
        if (showDropdown && dropdownRef && !dropdownRef.contains(event.target as Node)) {
            showDropdown = false;
        }
    }

    function dropdownItems(): HTMLElement[] {
        return dropdownMenu
            ? Array.from(dropdownMenu.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'))
            : [];
    }

    async function handleDropdownTriggerKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        showDropdown = true;
        await tick();
        const items = dropdownItems();
        (event.key === 'ArrowDown' ? items[0] : items[items.length - 1])?.focus();
    }

    function handleDropdownKeydown(event: KeyboardEvent) {
        const items = dropdownItems();
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.key === 'Escape') {
            event.preventDefault();
            showDropdown = false;
            dropdownToggleButton?.focus();
        } else if (event.key === 'ArrowDown' && items.length) {
            event.preventDefault();
            items[(index + 1 + items.length) % items.length].focus();
        } else if (event.key === 'ArrowUp' && items.length) {
            event.preventDefault();
            items[(index - 1 + items.length) % items.length].focus();
        } else if (event.key === 'Home' && items.length) {
            event.preventDefault();
            items[0].focus();
        } else if (event.key === 'End' && items.length) {
            event.preventDefault();
            items[items.length - 1].focus();
        } else if (event.key === 'Tab') {
            setTimeout(() => {
                if (dropdownMenu && !dropdownMenu.contains(document.activeElement)) showDropdown = false;
            });
        }
    }

    onMount(() => {
        window.addEventListener("click", handleClickOutside);

        // Restore last selected course from localStorage if no course param in URL
        const url = new URL(window.location.href);
        if (!url.searchParams.has('course')) {
            const saved = localStorage.getItem(COURSE_STORAGE_KEY);
            if (saved && courses.some(c => c.id === saved)) {
                goto(`/?course=${encodeURIComponent(saved)}`, { replaceState: true });
            }
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    });

    // Types for problems from the loader
    type Problem = {
        id: string;
        title: string;
        difficulty: string;
        link?: string;
        category?: string;
        statement?: string;
    };

    type CourseSummary = {
        id: string;
        title: string;
    };

    // Group problems by category
    let grouped: Record<string, Problem[]> = {};
    let groupStats: Record<string, { done: number; total: number }> = {};

    // Track which groups are open
    const OPEN_GROUPS_KEY = 'open-groups';
    let openGroups = new Set<string>(
        browser ? JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY) || '[]') : []
    );
    $: if (browser) localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify([...openGroups]));

    // Per-group sort state
    type SortKey = "title" | "difficulty";
    type SortDir = "asc" | "desc";
    let groupSort: Record<string, { key: SortKey; dir: SortDir }> = {};

    // Nicely format category labels (e.g., "two-pointers" -> "Two Pointers")
    const pretty = (s?: string) => {
        const label = (s && s.trim().length > 0 ? s : "uncategorized").replace(
            /[-_]+/g,
            " ",
        );
        return label.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Render markdown safely from trusted source (local JSON)
    marked.use({ gfm: true });
    function renderMarkdown(md: string = ""): string {
        const rendered = marked.parse(md ?? "");
        // marked.parse can return Promise<string> in some configs; ensure sync string
        if (typeof rendered === 'string') return rendered;
        console.warn('Unexpected async markdown parse - returning empty string');
        return '';
    }

    const COURSE_STORAGE_KEY = 'selected-course';

    // Persist course selection to localStorage
    function selectCourse(courseId: string) {
        if (browser) localStorage.setItem(COURSE_STORAGE_KEY, courseId);
    }

    // Selected course data from the server loader
    let courses: CourseSummary[] = [];
    let selectedCourseId: string | null = null;
    let selectedCourseProblems: Problem[] = [];
    let courseDescription = "";
    let categoryOrder: string[] = [];
    $: courses = (data?.courses ?? []) as CourseSummary[];
    $: selectedCourseId = data?.selectedCourseId ?? null;
    $: selectedCourseProblems = (data?.problems ?? []) as Problem[];
    $: courseDescription = data?.selectedCourseInfo?.description ?? "";
    $: categoryOrder = data?.selectedCourseInfo?.["category-order"] ?? [];
    // Map for fast lookup of category rank
    let orderMap: Record<string, number> = {};
    $: (function buildOrderMap() {
        const m: Record<string, number> = {};
        categoryOrder.forEach((c, i) => {
            if (c) m[c] = i;
        });
        orderMap = m;
    })();

    // Build groups reactively when data/checkMap changes
    $: (function buildGroups() {
        const map: Record<string, Problem[]> = {};
        for (const p of filteredProblems) {
            const key =
                p.category && p.category.trim() ? p.category : "uncategorized";
            if (!map[key]) map[key] = [];
            map[key].push(p);
        }

        grouped = map;

        // stats per group
        const stats: Record<string, { done: number; total: number }> = {};
        for (const [key, arr] of Object.entries(map)) {
            const total = arr.length;
            const done = arr.reduce(
                (acc, p) => acc + (checkMap[p.id] ? 1 : 0),
                0,
            );
            stats[key] = { done, total };
        }
        groupStats = stats;
    })();

    function toggleGroup(key: string) {
        if (searchQuery.trim()) {
            if (searchCollapsedGroups.has(key)) searchCollapsedGroups.delete(key);
            else searchCollapsedGroups.add(key);
            searchCollapsedGroups = new Set(searchCollapsedGroups);
        } else {
            if (openGroups.has(key)) openGroups.delete(key);
            else openGroups.add(key);
            openGroups = new Set(openGroups);
        }
    }

    // Sorting helpers
    const difficultyRank: Record<string, number> = {
        easy: 0,
        medium: 1,
        hard: 2,
    };

    function toggleSort(key: string, column: SortKey) {
        const current = groupSort[key];
        if (!current || current.key !== column) {
            groupSort = { ...groupSort, [key]: { key: column, dir: "asc" } };
            return;
        }
        const nextDir: SortDir = current.dir === "asc" ? "desc" : "asc";
        groupSort = { ...groupSort, [key]: { key: column, dir: nextDir } };
    }

    function getSortedGroup(arr: Problem[], key: string): Problem[] {
        const conf = groupSort[key];
        if (!conf) {
            // default: keep insertion order (already grouped) but fall back to numeric prefix if present
            return arr.slice().toSorted((a, b) => {
                // Try numeric prefix like "63. Title"
                const na = Number.parseInt(a?.title?.split(".")?.[0] ?? "NaN");
                const nb = Number.parseInt(b?.title?.split(".")?.[0] ?? "NaN");
                if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
                return (a?.title || "").localeCompare(b?.title || "");
            });
        }

        const dirMul = conf.dir === "asc" ? 1 : -1;
        if (conf.key === "title") {
            return arr
                .slice()
                .toSorted(
                    (a, b) =>
                        dirMul *
                        (a.title || "").localeCompare(
                            b.title || "",
                            undefined,
                            { sensitivity: "base" },
                        ),
                );
        }
        // difficulty
        return arr.slice().toSorted((a, b) => {
            const da = difficultyRank[(a.difficulty || "").toLowerCase()] ?? 99;
            const db = difficultyRank[(b.difficulty || "").toLowerCase()] ?? 99;
            const cmp = da - db;
            if (cmp !== 0) return dirMul * cmp;
            // tie-breaker by title
            return dirMul * (a.title || "").localeCompare(b.title || "");
        });
    }

    let totalProblems = 0;
    let solvedCount = 0;
    $: (function computeOverall() {
        totalProblems = selectedCourseProblems.length;
        let done = 0;
        for (const p of selectedCourseProblems) {
            if (checkMap[p.id]) done++;
        }
        solvedCount = done;
    })();

    // ==== Export / Import Helpers (moved from layout) ====
    function parseMaybe(str: string | null) {
        if (str == null) return null;
        try {
            return JSON.parse(str);
        } catch {
            return str;
        }
    }

    function exportLocalStorage() {
        if (!browser) return;
        const data: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            data[key] = parseMaybe(localStorage.getItem(key));
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `cojudge-localStorage-backup-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
        }, 0);
    }

    function sanitizeUserCheckboxes(input: unknown): Record<string, boolean> {
        const out: Record<string, boolean> = {};
        if (!input || typeof input !== 'object') return out;
        for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
            out[k] = v === true || v === 'true';
        }
        return out;
    }

    import { saveStatus } from '$lib/stores/saveStatus';
    function importLocalStorageObject(obj: Record<string, unknown>) {
        const previousStorage = new Map<string, string | null>();
        const previousStores = {
            solutions: $codeStore,
            checkboxes: $userStore,
            files: $fileStore,
            settings: $userSettingsStorage,
            gameResults: $gameResultsStore
        };
        if (browser) {
            for (const key of Object.keys(obj)) previousStorage.set(key, localStorage.getItem(key));
        }

        saveStatus.set('saving');
        const KNOWN_KEYS = new Set(['solutions', 'user-checkboxes', 'files', 'user-settings', 'game-results']);
        const requireObject = (key: string) => {
            const value = obj[key];
            if (!value || typeof value !== 'object' || Array.isArray(value)) {
                throw new Error(`${key} must contain an object.`);
            }
            return value as Record<string, unknown>;
        };

        try {
            if ('solutions' in obj) {
                codeStore.set(requireObject('solutions') as Record<string, string>);
            }
            if ('user-checkboxes' in obj) {
                userStore.set(sanitizeUserCheckboxes(requireObject('user-checkboxes')));
            }
            if ('files' in obj) {
                fileStore.set(requireObject('files') as Record<string, string>);
            }
            if ('user-settings' in obj) {
                userSettingsStorage.set(requireObject('user-settings') as any);
            }
            if ('game-results' in obj) {
                gameResultsStore.set(requireObject('game-results') as Record<string, any[]>);
            }
            if (browser) {
                for (const [k, v] of Object.entries(obj)) {
                    if (KNOWN_KEYS.has(k)) continue;
                    const toStore = typeof v === 'string' ? v : JSON.stringify(v);
                    if (toStore === undefined) throw new Error(`${k} cannot be stored.`);
                    localStorage.setItem(k, toStore);
                }
            }
        } catch (error) {
            if (browser) {
                try {
                    for (const key of previousStorage.keys()) localStorage.removeItem(key);
                    for (const [key, value] of previousStorage) {
                        if (value !== null) localStorage.setItem(key, value);
                    }
                    codeStore.set(previousStores.solutions);
                    userStore.set(previousStores.checkboxes);
                    fileStore.set(previousStores.files);
                    userSettingsStorage.set(previousStores.settings);
                    gameResultsStore.set(previousStores.gameResults);
                } catch (rollbackError) {
                    console.error('Failed to restore local data after an import error:', rollbackError);
                }
            }
            throw error;
        }
        
        setTimeout(() => {
            saveStatus.set('saved');
        }, 500);
    }

    async function onImportFileSelected(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const obj = JSON.parse(text);
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
                throw new Error('Invalid JSON structure.');
            }
            pendingImport = obj as Record<string, unknown>;
            await tick();
            importConfirmButton?.focus();
        } catch (err: any) {
            showImportNotice(`Failed to import: ${err?.message || String(err)}`, true);
        } finally {
            input.value = '';
        }
    }

    function confirmImport() {
        if (!pendingImport) return;
        try {
            importLocalStorageObject(pendingImport);
            firebaseConfigured = isFirebaseConfigured();
            firebaseSettingsSaved = hasSavedFirebaseSettings();
            showImportNotice('Import complete.', false);
        } catch (err: any) {
            showImportNotice(`Failed to import: ${err?.message || String(err)}`, true);
        } finally {
            void closeImportDialog();
        }
    }

    function cancelImport() {
        void closeImportDialog();
    }

    async function closeImportDialog() {
        pendingImport = null;
        await tick();
        dropdownToggleButton?.focus();
    }

    async function openNewWindow() {
        showDropdown = false;
        if (!isDesktopMode) return;
        const tauriInternals = (window as Window & {
            __TAURI_INTERNALS__?: { invoke: (command: string, args?: Record<string, unknown>) => Promise<unknown> };
        }).__TAURI_INTERNALS__;
        try {
            await tauriInternals?.invoke('new_window');
        } catch (error) {
            console.error('Failed to open a new window:', error);
        }
    }

    async function openFirebaseSettings() {
        firebaseForm = getFirebaseSettings();
        firebaseSettingsSaved = hasSavedFirebaseSettings();
        firebaseSettingsError = '';
        showDropdown = false;
        showFirebaseSettings = true;
        await tick();
        firebaseApiKeyInput?.focus();
    }

    async function closeFirebaseSettings() {
        showFirebaseSettings = false;
        firebaseSettingsError = '';
        await tick();
        dropdownToggleButton?.focus();
    }

    function submitFirebaseSettings(event: SubmitEvent) {
        event.preventDefault();
        const settings: FirebaseSettings = {
            apiKey: firebaseForm.apiKey.trim(),
            authDomain: firebaseForm.authDomain.trim(),
            projectId: firebaseForm.projectId.trim(),
            storageBucket: firebaseForm.storageBucket.trim(),
            messagingSenderId: firebaseForm.messagingSenderId.trim(),
            appId: firebaseForm.appId.trim()
        };
        if (!isFirebaseConfigured(settings)) {
            firebaseSettingsError = 'Complete all required Firebase fields.';
            return;
        }

        try {
            saveFirebaseSettings(settings);
            firebaseConfigured = true;
            firebaseSettingsSaved = true;
            showImportNotice('Firebase settings saved.', false);
            void closeFirebaseSettings();
        } catch (err: any) {
            firebaseSettingsError = err?.message || String(err);
        }
    }

    function removeFirebaseSettings() {
        try {
            clearFirebaseSettings();
            firebaseForm = getFirebaseSettings();
            firebaseConfigured = isFirebaseConfigured();
            firebaseSettingsSaved = false;
            firebaseSettingsError = '';
            showImportNotice('Saved Firebase settings removed.', false);
        } catch (err: any) {
            firebaseSettingsError = err?.message || String(err);
        }
    }

    async function openLoadCode() {
        loadCodeCharacters = ['', '', '', ''];
        loadCodeNavigating = false;
        showDropdown = false;
        showLoadCode = true;
        await tick();
        loadCodeInputs[0]?.focus();
    }

    async function closeLoadCode() {
        showLoadCode = false;
        await tick();
        dropdownToggleButton?.focus();
    }

    function updateLoadCode(index: number, event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const character = input.value.replace(/[^A-Za-z0-9]/g, '').slice(-1);
        loadCodeCharacters[index] = character;
        loadCodeCharacters = [...loadCodeCharacters];
        input.value = character;
        if (character && index < loadCodeInputs.length - 1) {
            loadCodeInputs[index + 1]?.focus();
        }
        navigateToSharedCodeIfComplete();
    }

    function handleLoadCodeKeydown(index: number, event: KeyboardEvent) {
        if (event.key === 'Backspace' && !loadCodeCharacters[index] && index > 0) {
            loadCodeCharacters[index - 1] = '';
            loadCodeCharacters = [...loadCodeCharacters];
            loadCodeInputs[index - 1]?.focus();
        } else if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            loadCodeInputs[index - 1]?.focus();
        } else if (event.key === 'ArrowRight' && index < loadCodeInputs.length - 1) {
            event.preventDefault();
            loadCodeInputs[index + 1]?.focus();
        }
    }

    async function handleLoadCodePaste(event: ClipboardEvent) {
        const characters = event.clipboardData?.getData('text').replace(/[^A-Za-z0-9]/g, '').slice(0, 4);
        if (!characters) return;
        event.preventDefault();
        loadCodeCharacters = Array.from({ length: 4 }, (_, index) => characters[index] ?? '');
        if (characters.length === 4) {
            navigateToSharedCodeIfComplete();
            return;
        }
        await tick();
        loadCodeInputs[Math.min(characters.length, 4) - 1]?.focus();
    }

    function navigateToSharedCodeIfComplete() {
        const code = loadCodeCharacters.join('');
        if (loadCodeNavigating || !/^[A-Za-z0-9]{4}$/.test(code)) return;
        loadCodeNavigating = true;
        showLoadCode = false;
        void goto(`/p/${encodeURIComponent(code)}`);
    }

    function showImportNotice(message: string, error: boolean) {
        importNotice = { message, error };
        if (importNoticeTimer) clearTimeout(importNoticeTimer);
        importNoticeTimer = setTimeout(() => {
            importNotice = null;
            importNoticeTimer = undefined;
        }, 4000);
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
        const activeModal = pendingImport
            ? importModalCard
            : showFirebaseSettings
                ? firebaseModalCard
                : showLoadCode
                    ? loadModalCard
                    : null;
        if (!activeModal) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            if (pendingImport) cancelImport();
            else if (showFirebaseSettings) void closeFirebaseSettings();
            else void closeLoadCode();
            return;
        }
        if (event.key === 'Tab') trapModalFocus(event, activeModal);
    }

    function triggerImport() {
        fileInputEl?.click();
    }
</script>

<svelte:head>
    <title>Home | Offline Code Judge for LeetCode-style problems - Cojudge</title>
</svelte:head>

<svelte:window onkeydown={handleModalKeydown} />

<div class="container">
    <div class="backup-toolbar">
        <Tooltip text={"Playground"} pos={"bottom"}>
            <a href="playground" class="btn playground-btn" aria-label="Playground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; flex-shrink: 0;">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            </a>
        </Tooltip>
        <div class="dropdown-container" bind:this={dropdownRef}>
            <button
                bind:this={dropdownToggleButton}
                class="btn dropdown-trigger"
                onclick={() => showDropdown = !showDropdown}
                onkeydown={handleDropdownTriggerKeydown}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Toggle menu"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {#if showDropdown}
                <div bind:this={dropdownMenu} class="dropdown-menu" role="menu" tabindex="-1" onkeydown={handleDropdownKeydown}>
                    {#if isDesktopMode && firebaseConfigured}
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openLoadCode}
                            title="Open a shared solution by its four-character code"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>
                                    <path d="m10 8 4 4-4 4"></path>
                                </svg>
                                Load
                            </span>
                        </button>
                        <div class="dropdown-separator" role="separator"></div>
                    {/if}
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { exportLocalStorage(); showDropdown = false; }}
                        disabled={!browser}
                        title="Export all progress (settings, code, etc.) to a JSON file"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export progress
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { triggerImport(); showDropdown = false; }}
                        disabled={!browser}
                        title="Import progress (settings, code, etc.) from a JSON backup"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Import progress
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { goto('/whiteboard'); showDropdown = false; }}
                        title="Open the whiteboard"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                            </svg>
                            Whiteboard
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { showGamePopup = true; showDropdown = false; }}
                        title="Random problem game mode"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="6" y1="12" x2="10" y2="12"></line>
                                <line x1="8" y1="10" x2="8" y2="14"></line>
                                <line x1="15" y1="13" x2="15.01" y2="13"></line>
                                <line x1="18" y1="11" x2="18.01" y2="11"></line>
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            </svg>
                            Game
                            <span class="span-badge">NEW</span>
                        </span>
                    </button>
                    {#if isDesktopMode}
                        <div class="dropdown-separator" role="separator"></div>
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openFirebaseSettings}
                            title="Configure Firebase sharing for desktop mode"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2 4.5 20.3a.5.5 0 0 0 .7.6L12 17l6.8 3.9a.5.5 0 0 0 .7-.6L12 2Z"></path>
                                    <path d="m8.5 11.2 7 0"></path>
                                </svg>
                                Firebase settings
                            </span>
                            <span class:configured={firebaseConfigured} class="firebase-menu-status">
                                {firebaseConfigured ? 'On' : 'Off'}
                            </span>
                        </button>
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openNewWindow}
                            title="Open a new window"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                    <line x1="12" y1="9" x2="12" y2="15"></line>
                                    <line x1="9" y1="12" x2="15" y2="12"></line>
                                </svg>
                                New Window
                            </span>
                        </button>
                    {/if}
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => {
                            userSettingsStorage.update(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
                            showDropdown = false;
                        }}
                        title="Toggle theme"
                    >
                        <span class="dropdown-item-content">
                            {#if browser && $userSettingsStorage.theme === 'dark'}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                                Light theme
                            {:else}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                                Dark theme
                            {/if}
                        </span>
                    </button>
                </div>
            {/if}
        </div>
        <input bind:this={fileInputEl} type="file" accept="application/json" class="hidden-file-input" onchange={onImportFileSelected} />
    </div>
    {#if pendingImport}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Cancel import" tabindex="-1" onclick={cancelImport}></button>
            <div bind:this={importModalCard} class="home-modal-card" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
                <h2 id="import-dialog-title">Import local data?</h2>
                <p>Matching local solutions, files, settings, and progress will be overwritten by this backup.</p>
                <div class="home-modal-actions">
                    <button class="btn" type="button" onclick={cancelImport}>Cancel</button>
                    <button bind:this={importConfirmButton} class="btn modal-primary-btn" type="button" onclick={confirmImport}>Import data</button>
                </div>
            </div>
        </div>
    {/if}
    {#if showFirebaseSettings}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Close Firebase settings" tabindex="-1" onclick={closeFirebaseSettings}></button>
            <div
                bind:this={firebaseModalCard}
                class="home-modal-card firebase-settings-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="firebase-settings-title"
            >
                <form onsubmit={submitFirebaseSettings}>
                <div class="modal-heading-row">
                    <div>
                        <span class="modal-eyebrow">Desktop connection</span>
                        <h2 id="firebase-settings-title">Firebase settings</h2>
                    </div>
                    <span class:configured={firebaseConfigured} class="firebase-status-pill">
                        <span></span>{firebaseConfigured ? 'Configured' : 'Not configured'}
                    </span>
                </div>
                <p>Connect this desktop app to the Firebase project used for shared solutions.</p>
                <div class="firebase-fields">
                    <label>
                        <span>API key <code>VITE_FIREBASE_API_KEY</code></span>
                        <input bind:this={firebaseApiKeyInput} bind:value={firebaseForm.apiKey} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label>
                        <span>Auth domain <code>VITE_FIREBASE_AUTH_DOMAIN</code></span>
                        <input bind:value={firebaseForm.authDomain} required autocomplete="off" spellcheck="false" placeholder="project.firebaseapp.com" />
                    </label>
                    <label>
                        <span>Project ID <code>VITE_FIREBASE_PROJECT_ID</code></span>
                        <input bind:value={firebaseForm.projectId} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label>
                        <span>Messaging sender ID <code>VITE_FIREBASE_MESSAGING_SENDER_ID</code></span>
                        <input bind:value={firebaseForm.messagingSenderId} required autocomplete="off" spellcheck="false" inputmode="numeric" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>App ID <code>VITE_FIREBASE_APP_ID</code></span>
                        <input bind:value={firebaseForm.appId} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>Storage bucket <small>optional</small> <code>VITE_FIREBASE_STORAGE_BUCKET</code></span>
                        <input bind:value={firebaseForm.storageBucket} autocomplete="off" spellcheck="false" placeholder="project.firebasestorage.app" />
                    </label>
                </div>
                <p class="firebase-settings-note">Stored only on this device. Firebase API keys identify a project but do not grant database access by themselves.</p>
                {#if firebaseSettingsError}
                    <p class="modal-error" role="alert">{firebaseSettingsError}</p>
                {/if}
                    <div class="home-modal-actions settings-actions">
                        {#if firebaseSettingsSaved}
                            <button class="btn remove-settings-btn" type="button" onclick={removeFirebaseSettings}>Remove saved</button>
                        {/if}
                        <span class="modal-action-spacer"></span>
                        <button class="btn" type="button" onclick={closeFirebaseSettings}>Cancel</button>
                        <button class="btn modal-primary-btn" type="submit">Save settings</button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
    {#if showLoadCode}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Close shared code loader" tabindex="-1" onclick={closeLoadCode}></button>
            <div bind:this={loadModalCard} class="home-modal-card load-code-card" role="dialog" aria-modal="true" aria-labelledby="load-code-title">
                <span class="modal-eyebrow">Shared solution</span>
                <h2 id="load-code-title">Enter code</h2>
                <p>Type or paste the four-character code from a Cojudge share link.</p>
                <div class="load-code-inputs" aria-label="Four-character share code" onpaste={handleLoadCodePaste}>
                    {#each loadCodeCharacters as character, index}
                        <input
                            bind:this={loadCodeInputs[index]}
                            value={character}
                            aria-label={`Code character ${index + 1}`}
                            maxlength="1"
                            autocomplete="off"
                            autocapitalize="none"
                            spellcheck="false"
                            inputmode="text"
                            oninput={(event) => updateLoadCode(index, event)}
                            onkeydown={(event) => handleLoadCodeKeydown(index, event)}
                        />
                    {/each}
                </div>
                <p class="load-code-hint">Codes are case-sensitive and open automatically.</p>
                <div class="home-modal-actions load-code-actions">
                    <button class="btn" type="button" onclick={closeLoadCode}>Cancel</button>
                </div>
            </div>
        </div>
    {/if}
    {#if importNotice}
        <div class:error={importNotice.error} class="import-toast" role={importNotice.error ? 'alert' : 'status'}>
            {importNotice.message}
        </div>
    {/if}
    <nav class="tabs" aria-label="Course">
        {#each courses as course}
            <a
                class="tab"
                class:active={course.id === selectedCourseId}
                href={`/?course=${encodeURIComponent(course.id)}`}
                aria-current={course.id === selectedCourseId ? "page" : undefined}
                onclick={() => selectCourse(course.id)}
            >{course.title}</a>
        {/each}
    </nav>
    <div class="intro">
        <!-- Overall progress at top of intro -->
        <div class="overall">
            <div class="overall-count" aria-live="polite">
                {solvedCount} / {totalProblems}
            </div>
            <div
                class="intro-progressbar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={totalProblems}
                aria-valuenow={solvedCount}
            >
                <div
                    class="intro-progressbar-fill"
                    style={`width: ${(totalProblems ? (solvedCount / totalProblems) * 100 : 0).toFixed(0)}%;`}
                ></div>
            </div>
        </div>
        {@html renderMarkdown(courseDescription)}
    </div>

    <div class="search-container">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
            type="text"
            class="search-input"
            placeholder="Search problems..."
            bind:value={searchQuery}
            aria-label="Search problems"
        />
        {#if searchQuery}
            <button
                class="search-clear"
                onclick={() => searchQuery = ""}
                aria-label="Clear search"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        {/if}
    </div>

    {#if showGamePopup}
        <GameModePopup
            problems={selectedCourseProblems}
            solvedSet={checkMap}
            on:close={() => showGamePopup = false}
        />
    {/if}

    {#if historyProblem}
        <GameHistoryPopup
            problemTitle={historyProblem.title}
            results={gameResultData[historyProblem.id] || []}
            on:close={() => historyProblem = null}
        />
    {/if}

    {#each Object.keys(grouped).toSorted((a, b) => {
        const ra = orderMap[a] ?? Number.POSITIVE_INFINITY;
        const rb = orderMap[b] ?? Number.POSITIVE_INFINITY;
        if (ra !== rb) return ra - rb;
        // fallback stable sort by pretty name
        return pretty(a).localeCompare(pretty(b));
    }) as key}
        <div class="group">
            <button
                class="group-header {isGroupOpenMap[key] ? 'open' : ''}"
                onclick={() => toggleGroup(key)}
                aria-expanded={isGroupOpenMap[key]}
            >
                <div class="group-left">
                    <span class="chevron"
                        >{isGroupOpenMap[key] ? "▾" : "▸"}</span
                    >
                    <span class="group-title">{pretty(key)}</span>
                </div>
                <div class="group-right">
                    <span class="group-count"
                        >({groupStats[key]?.done || 0} / {groupStats[key]
                            ?.total || 0})</span
                    >
                    <div class="progress" aria-hidden="true">
                        {#if groupStats[key]}
                            <div
                                class="progress-fill"
                                style={`width: ${(groupStats[key].total ? (groupStats[key].done / groupStats[key].total) * 100 : 0).toFixed(0)}%;`}
                            ></div>
                        {/if}
                    </div>
                </div>
            </button>

            {#if isGroupOpenMap[key]}
                <div class="table-container">
                    <table class="problem-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>
                                    <button
                                        class="th-button"
                                        onclick={() =>
                                            toggleSort(key, "title")}
                                        aria-label="Sort by title"
                                    >
                                        Title
                                        <span
                                            class="sort-icon"
                                            aria-hidden="true"
                                        >
                                            <SortIcon
                                                active={groupSort[key]?.key ===
                                                    "title"}
                                                dir={groupSort[key]?.dir}
                                            />
                                        </span>
                                    </button>
                                </th>
                                <th>
                                    <button
                                        class="th-button"
                                        onclick={() =>
                                            toggleSort(key, "difficulty")}
                                        aria-label="Sort by difficulty"
                                    >
                                        Difficulty
                                        <span
                                            class="sort-icon"
                                            aria-hidden="true"
                                        >
                                            <SortIcon
                                                active={groupSort[key]?.key ===
                                                    "difficulty"}
                                                dir={groupSort[key]?.dir}
                                            />
                                        </span>
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {#key groupSort}
                                {#each getSortedGroup(grouped[key] || [], key) as problem}
                                    <tr>
                                        <td class="status-cell">
                                            <input
                                                type="checkbox"
                                                checked={checkMap[
                                                    problem.id
                                                ] === true}
                                                disabled
                                                onchange={(e) => {
                                                    userStore.update(
                                                        (prev) => ({
                                                            ...prev,
                                                            [problem.id]: (
                                                                e.target as HTMLInputElement
                                                            ).checked,
                                                        }),
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <a href="/problems/{problem.id}">
                                                {problem.title}
                                            </a>
                                            {#if problem.link}
                                                <a
                                                    href={problem.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="external-link">↗</a
                                                >
                                            {/if}
                                            {#if bestRanks[problem.id]}
                                                <button
                                                    class="game-rank-badge"
                                                    class:rank-s={bestRanks[problem.id] === 'S'}
                                                    class:rank-a={bestRanks[problem.id] === 'A'}
                                                    class:rank-b={bestRanks[problem.id] === 'B'}
                                                    class:rank-c={bestRanks[problem.id] === 'C'}
                                                    onclick={(e) => { e.stopPropagation(); historyProblem = { id: problem.id, title: problem.title }; }}
                                                    title="View game history"
                                                >
                                                    {bestRanks[problem.id]}
                                                </button>
                                            {/if}
                                        </td>
                                        <td>
                                            <span
                                                class="badge {getDifficultyClass(
                                                    problem.difficulty,
                                                )}"
                                            >
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                {/each}
                            {/key}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .container {
        max-width: 1024px;
        margin: 0 auto;
        padding: var(--spacing-5) var(--spacing-4);
    }

    /* Tabs header - browser-like tab bar */
    nav.tabs {
        overflow-x: unset;
    }
    .tabs {
        position: relative;
        display: flex;
        align-items: flex-end;
        gap: var(--spacing-1);
        border-bottom: 1px solid var(--color-border, #e5e7eb);
        margin-bottom: var(--spacing-4);
        padding-top: var(--spacing-2);
        overflow-x: auto;
    }
    /* Intro card */
    .intro {
        position: relative;
        margin: var(--spacing-3) 0 var(--spacing-4);
        padding: var(--spacing-4);
        background: var(--color-surface);
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--border-radius-lg);
        box-shadow:
            0 6px 20px rgba(0, 0, 0, 0.05),
            0 1px 3px rgba(0, 0, 0, 0.06);
        color: var(--color-text);
        line-height: 1.65;
        animation: intro-fade 0.35s ease-out both;
    }

    .overall {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-3);
    }
    .overall-count {
        font-weight: 700;
        font-size: 1rem;
        color: var(--color-text);
        min-width: 72px;
        text-align: center;
    }
    .intro-progressbar {
        position: relative;
        flex: 1 1 auto;
        height: 10px;
        background-color: var(--color-surface, #1118270d);
        border-radius: 999px;
        overflow: hidden;
    }
    .intro-progressbar-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0%;
        background-color: var(--color-primary, #3b82f6);
        border-radius: 999px;
        transition: width 0.25s ease;
    }
    /* Removed unused .intro link styles (no anchor tags inside intro after relocation) */
    @keyframes intro-fade {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .backup-toolbar {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: var(--spacing-2);
    }
    .dropdown-container {
        position: relative;
        display: inline-block;
    }
    .dropdown-trigger {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem 0.5rem;
    }
    .playground-btn.btn {
        font-size: 0.5rem;
    }
    .playground-btn {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        padding: 0.35rem 0.5rem;
    }
    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-1) 0;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        z-index: 50;
        min-width: 170px;
        display: flex;
        flex-direction: column;
    }
    .dropdown-item {
        background: transparent;
        border: none;
        padding: 0.55rem 1rem;
        text-align: left;
        font-size: 0.9rem;
        color: var(--color-text);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
        transition: background-color 0.15s ease;
    }
    .dropdown-item:hover:not(:disabled) {
        background-color: var(--color-surface-hover);
    }
    .dropdown-item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .dropdown-separator {
        height: 1px;
        background-color: var(--color-border);
        margin: var(--spacing-1) 0;
    }
    .dropdown-item-content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    .firebase-menu-status {
        padding: 0.1rem 0.4rem;
        border-radius: 999px;
        background: var(--color-second-bg);
        color: var(--color-text-secondary);
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .firebase-menu-status.configured {
        background: color-mix(in srgb, var(--color-easy) 16%, transparent);
        color: var(--color-easy);
    }
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
    .hidden-file-input { display: none; }
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
    .modal-primary-btn {
        border-color: var(--color-highlight);
        background: var(--color-highlight);
        color: #fff;
        font-weight: 650;
    }
    .modal-primary-btn:hover {
        filter: brightness(1.05);
    }
    .modal-heading-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }
    .modal-heading-row h2 {
        margin-bottom: 0;
    }
    .modal-eyebrow {
        display: block;
        margin-bottom: 0.35rem;
        color: var(--color-highlight);
        font-size: 0.7rem;
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .firebase-settings-card {
        width: min(720px, 100%);
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
    .firebase-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem 1rem;
        margin-top: 1.25rem;
    }
    .firebase-fields label {
        display: grid;
        gap: 0.4rem;
        min-width: 0;
        color: var(--color-text);
        font-size: 0.82rem;
        font-weight: 650;
    }
    .firebase-fields label > span {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .firebase-fields code {
        overflow: hidden;
        color: var(--color-text-secondary);
        font-size: 0.62rem;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .firebase-fields small {
        color: var(--color-text-secondary);
        font-size: 0.7rem;
        font-weight: 500;
    }
    .firebase-fields input {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 0.65rem 0.7rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        outline: none;
        background: var(--color-surface);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: 0.8rem;
    }
    .firebase-fields input:focus {
        border-color: var(--color-highlight);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-highlight) 18%, transparent);
    }
    .firebase-field-wide {
        grid-column: 1 / -1;
    }
    .home-modal-card .firebase-settings-note {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: var(--color-second-bg);
        font-size: 0.76rem;
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
    .modal-action-spacer {
        flex: 1;
    }
    .remove-settings-btn {
        color: var(--color-hard);
    }
    .load-code-card {
        width: min(560px, 100%);
        padding: 2.25rem;
        text-align: center;
    }
    .load-code-card h2 {
        margin-bottom: 0.5rem;
        font-size: clamp(1.7rem, 5vw, 2.25rem);
    }
    .load-code-inputs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: clamp(0.55rem, 2vw, 1rem);
        width: min(410px, 100%);
        margin: 2rem auto 0;
    }
    .load-code-inputs input {
        width: 100%;
        aspect-ratio: 0.9;
        min-width: 0;
        box-sizing: border-box;
        border: 2px solid var(--color-border);
        border-radius: 0.75rem;
        outline: none;
        background: var(--color-surface);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: clamp(1.55rem, 7vw, 2.25rem);
        font-weight: 750;
        text-align: center;
        caret-color: var(--color-highlight);
        transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .load-code-inputs input:focus {
        border-color: var(--color-highlight);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-highlight) 18%, transparent);
        transform: translateY(-2px);
    }
    .home-modal-card .load-code-hint {
        margin-top: 0.75rem;
        font-size: 0.76rem;
    }
    .load-code-actions {
        justify-content: center;
        margin-top: 1.75rem;
    }
    .import-toast {
        position: fixed;
        right: 1.25rem;
        bottom: 1.25rem;
        z-index: 1001;
        max-width: min(420px, calc(100vw - 2.5rem));
        padding: 0.75rem 1rem;
        border: 1px solid var(--color-border);
        border-left: 4px solid var(--color-easy);
        border-radius: 0.625rem;
        background: var(--color-surface);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.22);
    }
    .import-toast.error {
        border-left-color: var(--color-hard);
    }
    .tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 1rem;
        border: 1px solid transparent;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        border-bottom: none; /* make it look attached to the bar */
        margin-bottom: -1px; /* sit on top of the bar's bottom border */
        background: transparent;
        color: var(--color-text-secondary);
        flex: 0 0 auto;
        text-decoration: none;
        user-select: none;
        transition:
            background-color 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease;
    }
    .tab:hover {
        background: var(--color-surface-hover);
        color: var(--color-text);
    }
    .tab.active {
        background: var(--color-surface);
        color: var(--color-text);
        border-color: var(--color-border, #e5e7eb);
        box-shadow:
            0 -1px 0 0 rgba(0, 0, 0, 0.02) inset,
            0 1px 2px rgba(0, 0, 0, 0.06);
        font-weight: 600;
    }
    /* Mask the bar's bottom border beneath the active tab */
    .tab.active::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 2px;
        background: var(--color-surface);
        pointer-events: none;
    }

    /* Group header (accordion) */
    .group {
        margin-bottom: var(--spacing-3);
    }
    .group-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-3) var(--spacing-3);
        border: 1px solid var(--color-border, #e5e7eb);
        background-color: var(--color-surface);
        color: inherit;
        border-radius: var(--border-radius-lg);
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
    }
    .group-header.open {
        background-color: var(--color-surface-hover);
    }
    .group-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }
    .chevron {
        font-size: 1rem;
        opacity: 0.7;
    }
    .group-title {
        font-weight: 600;
        font-size: 1.05rem;
    }

    .group-right {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        min-width: 160px;
    }
    .group-count {
        color: var(--color-text-secondary);
        font-size: 0.9rem;
    }
    .progress {
        position: relative;
        width: 140px;
        height: 8px;
        background-color: var(--color-surface, #1118270d);
        border-radius: 999px;
        overflow: hidden;
    }
    .progress-fill {
        height: 100%;
        background-color: var(--color-primary, #3b82f6);
        border-radius: 999px;
    }

    .table-container {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-2);
        margin-top: var(--spacing-2);
    }

    .problem-table {
        width: 100%;
        border-collapse: separate; /* Important for border-radius on rows */
        border-spacing: 0 var(--spacing-2); /* Vertical gap between rows */
        text-align: left;
    }

    .problem-table th {
        padding: var(--spacing-2) var(--spacing-3);
        font-weight: 500;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
    }
    .th-button {
        all: unset;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }
    .th-button:hover {
        color: var(--color-text);
    }
    .sort-indicator {
        font-size: 0.85em;
        opacity: 0.8;
    }
    .sort-icon {
        display: inline-flex;
        margin-left: 0.25rem;
        color: currentColor;
    }

    /* Make table rows look like individual items */
    .problem-table td {
        background-color: transparent;
        padding: var(--spacing-3);
        vertical-align: middle;
        transition: background-color 0.2s ease-in-out;
    }

    .problem-table tbody tr:hover td {
        background-color: var(--color-surface-hover);
    }

    /* Apply border-radius to the first and last cell of each row */
    .problem-table tbody tr td:first-child {
        border-top-left-radius: var(--border-radius-sm);
        border-bottom-left-radius: var(--border-radius-sm);
    }
    .problem-table tbody tr td:last-child {
        border-top-right-radius: var(--border-radius-sm);
        border-bottom-right-radius: var(--border-radius-sm);
    }

    .status-cell {
        width: 1%;
        white-space: nowrap;
    }

    .external-link {
        color: var(--color-text-secondary);
        font-size: 0.8em;
        margin-left: var(--spacing-1);
    }

    /* Badge styles */
    .badge {
        display: inline-block;
        padding: var(--spacing-1) var(--spacing-2);
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 999px; /* Pill shape */
        color: var(--color-primary-text);
    }

    .difficulty-easy {
        background-color: var(--color-easy);
    }
    .difficulty-medium {
        background-color: var(--color-medium);
    }
    .difficulty-hard {
        background-color: var(--color-hard);
        color: #fff;
    }

    .span-badge {
        font-size: 0.6rem;
        background-color: var(--color-primary, #3b82f6);
        color: #fff;
        padding: 2px 5px;
        border-radius: 4px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .game-rank-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        font-size: 0.7rem;
        font-weight: 800;
        color: #fff;
        border: none;
        cursor: pointer;
        margin-left: 6px;
        vertical-align: middle;
        transition: transform 0.15s, box-shadow 0.15s;
        line-height: 1;
        padding: 0;
    }
    .game-rank-badge:hover {
        transform: scale(1.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .game-rank-badge.rank-s {
        background: linear-gradient(135deg, #ffd700, #f59e0b);
    }
    .game-rank-badge.rank-a {
        background: linear-gradient(135deg, #34d399, #059669);
    }
    .game-rank-badge.rank-b {
        background: linear-gradient(135deg, #60a5fa, #2563eb);
    }
    .game-rank-badge.rank-c {
        background: linear-gradient(135deg, #9ca3af, #4b5563);
    }

    .search-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 100%;
        margin-bottom: var(--spacing-4);
    }
    .search-input {
        width: 100%;
        padding: 0.55rem 2.25rem 0.55rem 2.5rem;
        font-size: 0.95rem;
        font-family: var(--font-sans);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        background: var(--color-surface);
        color: var(--color-text);
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .search-input:focus {
        border-color: var(--color-primary, #42c882);
        box-shadow: 0 0 0 2px rgba(66, 200, 130, 0.15);
    }
    .search-icon {
        position: absolute;
        left: 0.85rem;
        color: var(--color-text-secondary);
        pointer-events: none;
        opacity: 0.7;
    }
    .search-clear {
        position: absolute;
        right: 0.65rem;
        background: transparent;
        border: none;
        padding: 0.15rem;
        cursor: pointer;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        border-radius: 50%;
        opacity: 0.7;
        transition: opacity 0.15s ease, background-color 0.15s ease;
    }
    .search-clear:hover {
        background-color: var(--color-surface-hover);
        color: var(--color-text);
        opacity: 1;
    }
    @media (max-width: 640px) {
        .home-modal-shell {
            align-items: end;
            padding: 0.75rem;
        }
        .home-modal-card {
            max-height: calc(100vh - 1.5rem);
            max-height: calc(100dvh - 1.5rem);
            padding: 1.25rem;
            border-radius: 1rem;
        }
        .firebase-fields {
            grid-template-columns: 1fr;
        }
        .firebase-field-wide {
            grid-column: auto;
        }
        .firebase-fields label > span {
            display: grid;
            gap: 0.15rem;
        }
        .modal-heading-row {
            display: grid;
        }
        .firebase-status-pill {
            width: fit-content;
        }
        .settings-actions .remove-settings-btn {
            width: 100%;
        }
        .modal-action-spacer {
            display: none;
        }
        .load-code-card {
            padding: 1.75rem 1.25rem;
        }
        .load-code-inputs {
            margin-top: 1.5rem;
        }
    }
</style>
