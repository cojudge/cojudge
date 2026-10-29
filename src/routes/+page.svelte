<script lang="ts">
    import { ru } from '$lib/i18n/ru';
    export let data;
    import { onDestroy, onMount, tick } from "svelte";
    import { marked } from "marked";
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { navigating, page } from '$app/stores';
    import Tooltip from "$lib/components/Tooltip.svelte";
    import DemoBanner from "$lib/components/DemoBanner.svelte";
    import SortIcon from "$lib/components/SortIcon.svelte";
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    import userStore from "$lib/stores/userStore";
    import bookmarkStore, { toggleBookmarkId } from '$lib/stores/bookmarkStore';
    import { getDifficultyClass } from "$lib/utils/util.js";
    import GameModePopup from "$lib/components/GameModePopup.svelte";
    import GameHistoryPopup from "$lib/components/GameHistoryPopup.svelte";
    import gameResultsStore, { type GameResult } from '$lib/stores/gameResultsStore';
    import CloudSyncModal from "$lib/components/CloudSyncModal.svelte";
    import DockerSettingsModal from "$lib/components/DockerSettingsModal.svelte";
    import UpdatePromptModal from "$lib/components/UpdatePromptModal.svelte";
    import {
        APP_UPDATE_RELEASES_URL,
        APP_UPDATE_REPO_URL,
        createReleaseNotesPreview,
        fetchGithubReleaseNotesMetadata,
        formatAppUpdateInstallError,
        loadAppUpdatePreferenceFromStorage,
        normalizeUpdateErrorMessage,
        persistAppUpdatePreference,
        type AppUpdateInfo,
        type AppUpdateStatus
    } from '$lib/appUpdate';
    import {
        cloudSyncState,
        refreshCloudLocalState,
        restartCloudSync
    } from '$lib/cloudSync';
    import { activeDialog, showConfirm } from '$lib/dialogs';
    import { collectProgressData, writeProgressStorageItem, clearProgressStorage } from '$lib/progressBackup';

    import { applyProgressData } from '$lib/progressBackupClient';
    import {
        PASTED_IMAGES_KEY,
        getAllPastedImages,
        importPastedImages,
        extractPastedImages,
        clearPastedImages
    } from '$lib/utils/imageStore';
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
    let clearConfirmCard: HTMLElement | null = null;
    let firebaseModalCard: HTMLElement | null = null;
    let firebaseApiKeyInput: HTMLInputElement | null = null;
    let loadModalCard: HTMLElement | null = null;
    let loadCodeInputs: HTMLInputElement[] = [];
    let pendingImport: Record<string, unknown> | null = null;
    let showClearConfirm = false;
    let showManageProblems = false;
    let manageProblemsCard: HTMLElement | null = null;
    let manageProblemsError = '';
    let showCliSettings = false;
    let showDockerSettings = false;
    let dockerConnected = false;
    let dockerStatusChecking = false;
    let cliSettingsCard: HTMLElement | null = null;
    let cliBusy = false;
    let cliError = '';
    let cliPathCopied = false;
    let cliPathCopiedTimer: ReturnType<typeof setTimeout> | undefined;
    let cliStatus: {
        available: boolean;
        installed: boolean;
        path: string | null;
        aliasPaths: string[];
        needsNewTerminal: boolean;
        message: string | null;
    } = {
        available: false,
        installed: false,
        path: null,
        aliasPaths: [],
        needsNewTerminal: false,
        message: null
    };
    let revealingFolder = false;
    let pathCopied = false;
    let pathCopiedTimer: ReturnType<typeof setTimeout> | undefined;
    let resettingContentKey: string | null = null;
    let resettingAllContent = false;
    // Exam mode password modal ({ mode: 'enable' } asks for a new password,
    // { mode: 'disable' } asks for the existing one).
    let examModal: { mode: 'enable' | 'disable' } | null = null;
    let examPassword = '';
    let examPasswordConfirm = '';
    let examPasswordError = '';
    let examSubmitting = false;
    let examPasswordInput: HTMLInputElement | null = null;
    type ModifiedItem = { id: string; title: string };
    // Full modified inventory is fetched lazily when the dialog opens (see
    // openManageProblems) so course-tab navigations don't pay for comparing
    // every problem against its bundled copy.
    let modifiedProblems: ModifiedItem[] = [];
    let modifiedCourses: ModifiedItem[] = [];
    let modifiedInventoryLoading = false;
    $: modifiedItemCount = modifiedProblems.length + modifiedCourses.length;
    let importNotice: { message: string; error: boolean; filePath?: string } | null = null;
    let importNoticeTimer: ReturnType<typeof setTimeout> | undefined;
    let showFirebaseSettings = false;
    let showCloudSettings = false;
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
    // --- App updates (Tauri signed updater, same flow as openduck) ---
    let showUpdatePrompt = false;
    let availableAppUpdate: AppUpdateInfo | null = null;
    let appUpdateStatus: AppUpdateStatus = 'idle';
    let appUpdateError: string | null = null;
    let appUpdateProgress: { downloadedBytes: number; totalBytes: number | null } | null = null;
    let skippedAppUpdateVersion: string | null = null;
    let autoCheckAppUpdatesEnabled = true;
    let suppressAutoUpdatePromptUntilNextCheck = false;
    let pendingAutomaticUpdatePromptVersion: string | null = null;
    let updateObject: {
        version: string;
        currentVersion: string;
        date?: string | null;
        body?: string | null;
        rawJson: { target?: unknown };
        downloadAndInstall: (
            onEvent?: (event: { event: string; data: { chunkLength?: number; contentLength?: number | null } }) => void
        ) => Promise<void>;
    } | null = null;
    $: updateAvailable = appUpdateStatus === 'available' && !!availableAppUpdate;
    $: updateMenuLabel = appUpdateStatus === 'checking'
        ? "Проверка обновлений..."
        : appUpdateStatus === 'installing'
            ? "Установка обновления..."
            : appUpdateStatus === 'installed'
                ? "Перезагрузить для применения обновления"
                : appUpdateStatus === 'available' && availableAppUpdate
                    ? `Update to v${availableAppUpdate.version}`
                    : "Проверить обновления";
    $: if (browser) {
        document.body.style.overflow = showGamePopup || pendingImport || showFirebaseSettings || showLoadCode || showClearConfirm || showManageProblems || showCliSettings || showDockerSettings || showUpdatePrompt ? 'hidden' : '';
    }

    $: contentDir = (data?.contentDir ?? '~/cojudge') as string;
    let gameResultData: Record<string, GameResult[]> = {};
    let historyProblem: { id: string; title: string } | null = null;

    let searchQuery = "";
    let searchCollapsedGroups = new Set<string>();

    $: if (!searchQuery.trim()) {
        searchCollapsedGroups.clear();
        searchCollapsedGroups = new Set();
    }

    let showBookmarks = false;
    $: allProblemsList = ((data?.allProblems ?? selectedCourseProblems ?? []) as Problem[]);
    $: bookmarkedProblems = allProblemsList.filter((p) => $bookmarkStore?.[p.id]);
    $: bookmarkCount = bookmarkedProblems.length;
    // Leave the Bookmarks view once the last bookmark is removed.
    $: if (showBookmarks && bookmarkCount === 0) showBookmarks = false;
    $: baseProblems = showBookmarks ? bookmarkedProblems : selectedCourseProblems;

    function toggleBookmark(problemId: string) {
        bookmarkStore.update((prev) => toggleBookmarkId(prev, problemId));
    }

    let filteredProblems: Problem[] = [];
    // Statement bodies are not in the page payload (see +page.server.ts);
    // they are fetched per course on the first search keystroke so statement
    // search keeps working without bloating every course-tab navigation.
    let statementIndexByCourse: Record<string, Record<string, string>> = {};
    let statementIndexPending: Record<string, boolean> = {};
    async function ensureStatementIndex(courseId: string | null) {
        if (!browser || !courseId || statementIndexByCourse[courseId] || statementIndexPending[courseId]) return;
        statementIndexPending[courseId] = true;
        try {
            const response = await fetch(`/api/course-statements?course=${encodeURIComponent(courseId)}`);
            const result = await response.json().catch(() => ({}));
            if (response.ok && result?.statements && typeof result.statements === 'object') {
                statementIndexByCourse = {
                    ...statementIndexByCourse,
                    [courseId]: result.statements as Record<string, string>
                };
            }
        } catch {
            // Search still matches titles and slugs without the index.
        } finally {
            statementIndexPending[courseId] = false;
        }
    }
    $: if (browser && searchQuery.trim() && selectedCourseId) void ensureStatementIndex(selectedCourseId);
    $: {
        if (!searchQuery.trim()) {
            filteredProblems = baseProblems;
        } else {
            const query = searchQuery.toLowerCase().trim();
            const statementIndex = statementIndexByCourse[selectedCourseId ?? ''] ?? {};
            filteredProblems = baseProblems.filter((p) => {
                const titleMatch = (p.title || "").toLowerCase().includes(query);
                const slugMatch = (p.id || "").toLowerCase().includes(query);
                const statementMatch = ((p.statement || statementIndex[p.id] || "").toLowerCase().includes(query));
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
        void refreshDockerStatus();
        void refreshCloudLocalState();
        await tick();
        const items = dropdownItems();
        (event.key === 'ArrowDown' ? items[0] : items[items.length - 1])?.focus();
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
        if (showDropdown) void refreshCloudLocalState();
        if (showDropdown) void refreshDockerStatus();
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
        if (isDesktopMode) void refreshCliStatus();
        void initializeAppUpdatePreference();

        // Restore last selected course from localStorage if no course param in URL
        const url = new URL(window.location.href);
        if (!url.searchParams.has('course')) {
            const saved = localStorage.getItem(COURSE_STORAGE_KEY);
            if (saved && courses.some(c => c.id === saved)) {
                goto(`/?course=${encodeURIComponent(saved)}`, { replaceState: true });
            }
        }

        // Automatic update detection on startup (desktop only), same as openduck.
        if (isDesktopMode) {
            const timer = setTimeout(() => {
                void triggerAutomaticAppUpdateCheck();
            }, 2500);
            const cleanup = () => {
                window.removeEventListener("click", handleClickOutside);
                clearTimeout(timer);
            };
            return cleanup;
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    });

    // Types for problems from the loader
    type ContentSource = 'custom' | 'modified' | 'bundled';
    type Problem = {
        id: string;
        title: string;
        difficulty: string;
        link?: string;
        category?: string;
        statement?: string;
        source?: ContentSource;
        courseNumber?: number;
    };

    type CourseSummary = {
        id: string;
        title: string;
        source?: ContentSource;
    };

    function sourceLabel(source?: ContentSource): string {
        return source === 'custom' ? "Своя" : source === 'modified' ? "Изменено" : '';
    }

    function sourceTitle(source?: ContentSource): string {
        return source === 'custom'
            ? "Пользовательский контент — существует только в вашей папке Cojudge"
            : source === 'modified'
                ? "Модифицированный — отредактированный в папке Cojudge, отличается от пакетной копии"
                : '';
    }

    // Group problems by category
    let grouped: Record<string, Problem[]> = {};
    let groupStats: Record<string, { done: number; total: number }> = {};

    // Track which groups are open
    const OPEN_GROUPS_KEY = 'open-groups';
    let openGroups = new Set<string>(
        browser ? JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY) || '[]') : []
    );
    $: if (browser) writeProgressStorageItem(localStorage, OPEN_GROUPS_KEY, JSON.stringify([...openGroups]));

    // Per-group sort state (persisted to localStorage only, not cloud-synced)
    type SortKey = "title" | "difficulty" | "status";
    type SortDir = "asc" | "desc";
    const GROUP_SORT_KEY = 'group-sort';
    function loadGroupSort(): Record<string, { key: SortKey; dir: SortDir }> {
        if (!browser) return {};
        try {
            const raw = localStorage.getItem(GROUP_SORT_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw) as Record<string, { key: unknown; dir: unknown }>;
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
            const validKeys: SortKey[] = ["title", "difficulty", "status"];
            const cleaned: Record<string, { key: SortKey; dir: SortDir }> = {};
            for (const [group, conf] of Object.entries(parsed)) {
                if (!conf || typeof conf !== 'object') continue;
                if (!validKeys.includes(conf.key as SortKey)) continue;
                if (conf.dir !== 'asc' && conf.dir !== 'desc') continue;
                cleaned[group] = { key: conf.key as SortKey, dir: conf.dir as SortDir };
            }
            return cleaned;
        } catch {
            return {};
        }
    }
    let groupSort: Record<string, { key: SortKey; dir: SortDir }> = loadGroupSort();
    $: if (browser) writeProgressStorageItem(localStorage, GROUP_SORT_KEY, JSON.stringify(groupSort));

    // Nicely format category labels (e.g., "two-pointers" -> "Two Pointers").
    // Keep digit-digit ranges intact (e.g., "1-100" stays "1-100").
    const pretty = (s?: string) => {
        const raw = s && s.trim().length > 0 ? s : "uncategorized";
        const label = raw.replace(/[-_]+/g, (m, offset: number, full: string) => {
            const before = full[offset - 1] ?? "";
            const after = full[offset + (m as string).length] ?? "";
            return /\d/.test(before) && /\d/.test(after) ? m : " ";
        });
        return ru(label.replace(/\b\w/g, (c) => c.toUpperCase()));
    };

    // Display title: courses may override the leading number via
    // courseinfo.json "problem-numbers" (e.g. LeetCode IDs in LeetCode 1000).
    const displayTitle = (p?: { title?: string | null; courseNumber?: number | null } | null) => {
        const title = p?.title || "";
        if (p?.courseNumber != null) {
            return title.replace(/^\d+\.\s*/, `${p.courseNumber}. `);
        }
        return title;
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
        showBookmarks = false;
        if (browser) localStorage.setItem(COURSE_STORAGE_KEY, courseId);
    }

    // Pending course-tab navigation (SvelteKit client nav waits for
    // __data.json, which can take seconds on slow connections). Shows a
    // spinner in the clicked tab + a status line instead of a dead UI.
    $: navRouteId = $navigating?.to?.route?.id ?? null;
    $: isCourseNavigating = !!$navigating && navRouteId === '/';
    $: pendingCourseId = isCourseNavigating
        ? ($navigating?.to?.url?.searchParams?.get('course') ?? null)
        : null;
    $: isTabPending = (courseId: string) => isCourseNavigating && pendingCourseId === courseId;

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
    $: hasCustomContent =
        courses.some((c) => c.source === 'custom') ||
        selectedCourseProblems.some((p) => p.source === 'custom');
    $: hasModifiedContent =
        courses.some((c) => c.source === 'modified') ||
        selectedCourseProblems.some((p) => p.source === 'modified');
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
                // Prefer course-specific numbers (e.g. LeetCode IDs) when both sides have them
                if (a?.courseNumber != null && b?.courseNumber != null) return a.courseNumber - b.courseNumber;
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
                        displayTitle(a).localeCompare(
                            displayTitle(b),
                            undefined,
                            { sensitivity: "base" },
                        ),
                );
        }
        // status (solved vs unsolved; asc = unsolved first, desc = solved first)
        if (conf.key === "status") {
            return arr.slice().toSorted((a, b) => {
                const sa = checkMap[a.id] ? 1 : 0;
                const sb = checkMap[b.id] ? 1 : 0;
                const cmp = sa - sb;
                if (cmp !== 0) return dirMul * cmp;
                // tie-breaker by title
                return dirMul * displayTitle(a).localeCompare(displayTitle(b));
            });
        }
        // difficulty
        return arr.slice().toSorted((a, b) => {
            const da = difficultyRank[(a.difficulty || "").toLowerCase()] ?? 99;
            const db = difficultyRank[(b.difficulty || "").toLowerCase()] ?? 99;
            const cmp = da - db;
            if (cmp !== 0) return dirMul * cmp;
            // tie-breaker by title
            return dirMul * displayTitle(a).localeCompare(displayTitle(b));
        });
    }

    let totalProblems = 0;
    let solvedCount = 0;
    $: (function computeOverall() {
        const source = (typeof baseProblems !== 'undefined' ? baseProblems : selectedCourseProblems) as Problem[];
        totalProblems = source.length;
        let done = 0;
        for (const p of source) {
            if (checkMap[p.id]) done++;
        }
        solvedCount = done;
    })();

    function downloadProgressBackup(data: Record<string, unknown>) {
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

    async function exportLocalStorage() {
        if (!browser) return;
        const data = collectProgressData(localStorage);
        // Pasted images live in IndexedDB, outside localStorage; carry them in
        // the backup so a restore keeps markdown images working.
        const pastedImages = await getAllPastedImages();
        if (Object.keys(pastedImages).length > 0) data[PASTED_IMAGES_KEY] = pastedImages;

        if (isDesktopMode) {
            try {
                const response = await fetch('/api/export', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data })
                });
                const result = await response.json().catch(() => ({}));
                if (!response.ok || !result.success) {
                    throw new Error(result?.error || `Export failed (HTTP ${response.status})`);
                }
                showImportNotice(`Exported to ${result.filePath}`, false, result.filePath);
            } catch (error: any) {
                // Server-side export can still fail (e.g. body limits on very
                // large backups): fall back to a plain in-app download that
                // never touches the server.
                try {
                    downloadProgressBackup(data);
                    showImportNotice(
                        'Server export failed; backup downloaded in the app instead. ' +
                            'If the playground hangs, open the Recovery page from this menu.',
                        false
                    );
                } catch {
                    showImportNotice(error?.message || 'Failed to export progress', true);
                }
            }
            return;
        }

        downloadProgressBackup(data);
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

    async function confirmImport() {
        if (!pendingImport) return;
        try {
            const pastedImages = extractPastedImages(pendingImport);
            if (pastedImages) {
                // Images are stored in IndexedDB, not localStorage; write them
                // there and keep the key out of the localStorage payload.
                await importPastedImages(pastedImages);
                delete pendingImport[PASTED_IMAGES_KEY];
            }
            applyProgressData(pendingImport);
            firebaseConfigured = isFirebaseConfigured();
            firebaseSettingsSaved = hasSavedFirebaseSettings();
            showImportNotice("Импорт завершен.", false);
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

    function cloudMenuStatus() {
        if ($cloudSyncState.authStatus === 'unavailable') return "Выкл.";
        if ($cloudSyncState.authStatus !== 'signed-in') return "Войти";
        if ($cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading') return "Синхронизация";
        if ($cloudSyncState.resolution === 'local-changes') return '* Unsynced';
        if ($cloudSyncState.resolution) return '* Review';
        if ($cloudSyncState.syncStatus === 'offline') return "Оффлайн";
        if ($cloudSyncState.syncStatus === 'error') return "Ошибка";
        if ($cloudSyncState.remoteStatus === 'unknown') return "Проверка";
        return "синхронизированный";
    }

    function openCloudSettings() {
        showDropdown = false;
        showCloudSettings = true;
    }

    function closeCloudSettings() {
        showCloudSettings = false;
        void tick().then(() => dropdownToggleButton?.focus());
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
            appId: firebaseForm.appId.trim(),
            googleDesktopClientId: firebaseForm.googleDesktopClientId.trim(),
            googleDesktopClientSecret: firebaseForm.googleDesktopClientSecret.trim()
        };
        if (!isFirebaseConfigured(settings)) {
            firebaseSettingsError = "Заполните все необходимые поля Firebase.";
            return;
        }

        try {
            saveFirebaseSettings(settings);
            firebaseConfigured = true;
            firebaseSettingsSaved = true;
            showImportNotice("Сохранены настройки Firebase.", false);
            void restartCloudSync();
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
            showImportNotice("Удалены сохраненные настройки Firebase", false);
            void restartCloudSync();
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

    function showImportNotice(message: string, error: boolean, filePath?: string) {
        importNotice = { message, error, filePath };
        if (importNoticeTimer) clearTimeout(importNoticeTimer);
        importNoticeTimer = setTimeout(() => {
            importNotice = null;
            importNoticeTimer = undefined;
        }, filePath ? 6000 : 4000);
    }

    async function revealFile(filePath: string | undefined) {
        if (!filePath) return;
        try {
            await fetch('/api/reveal-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filePath })
            });
        } catch (error) {
            console.error('Failed to reveal file:', error);
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
        if ($activeDialog) return;
        // Cmd+S or Ctrl+S — open cloud sync, even outside modals.
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            openCloudSettings();
            return;
        }
        // Note: Docker settings modal handles its own Escape/Tab via DockerSettingsModal.
        if (showDockerSettings) return;
        if (showUpdatePrompt && event.key === 'Escape') {
            // The install keeps running in the background; the dialog must
            // stay dismissible so it can never trap the user on this screen.
            event.preventDefault();
            remindAboutAppUpdateLater();
            return;
        }
        const activeModal = pendingImport
            ? importModalCard
            : showClearConfirm
                ? clearConfirmCard
                : showFirebaseSettings
                    ? firebaseModalCard
                    : showLoadCode
                        ? loadModalCard
                        : showManageProblems
                            ? manageProblemsCard
                            : showCliSettings
                                ? cliSettingsCard
                                : null;
        if (!activeModal) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            if (pendingImport) cancelImport();
            else if (showClearConfirm) void closeClearProgress();
            else if (showFirebaseSettings) void closeFirebaseSettings();
            else if (showManageProblems) void closeManageProblems();
            else if (showCliSettings) void closeCliSettings();
            else void closeLoadCode();
            return;
        }
        if (event.key === 'Tab') trapModalFocus(event, activeModal);
    }

    function triggerImport() {
        fileInputEl?.click();
    }

    function openClearProgress() {
        showDropdown = false;
        showClearConfirm = true;
    }

    async function openManageProblems() {
        if ($page.data.isDemoSite) return;
        showDropdown = false;
        manageProblemsError = '';
        pathCopied = false;
        if (pathCopiedTimer) clearTimeout(pathCopiedTimer);
        showManageProblems = true;
        modifiedInventoryLoading = true;
        try {
            const response = await fetch('/api/content/modified');
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result?.error || 'Could not load modified content');
            modifiedProblems = Array.isArray(result.modifiedProblems) ? result.modifiedProblems : [];
            modifiedCourses = Array.isArray(result.modifiedCourses) ? result.modifiedCourses : [];
        } catch (err: any) {
            manageProblemsError = err?.message
                ? `Could not load modified content: ${err.message}`
                : "Невозможно загрузить измененный контент";
        } finally {
            modifiedInventoryLoading = false;
        }
    }

    async function closeManageProblems() {
        showManageProblems = false;
        pathCopied = false;
        if (pathCopiedTimer) clearTimeout(pathCopiedTimer);
        await tick();
        dropdownToggleButton?.focus();
    }

    function invokeDesktop<T>(command: string, args?: Record<string, unknown>): Promise<T> {
        const tauriInternals = (window as Window & {
            __TAURI_INTERNALS__?: { invoke: (name: string, args?: Record<string, unknown>) => Promise<T> };
        }).__TAURI_INTERNALS__;
        if (!tauriInternals?.invoke) {
            return Promise.reject(new Error('Desktop bridge unavailable.'));
        }
        return tauriInternals.invoke(command, args);
    }

    // --- App updates (mirrors openduck: auto-check + manual check + install) ---
    function initializeAppUpdatePreference() {
        const stored = loadAppUpdatePreferenceFromStorage();
        skippedAppUpdateVersion = stored.skippedVersion;
        autoCheckAppUpdatesEnabled = stored.autoCheckEnabled;
    }

    function closeUpdatePrompt() {
        showUpdatePrompt = false;
        pendingAutomaticUpdatePromptVersion = null;
    }

    function queueAutomaticUpdatePrompt(version: string) {
        pendingAutomaticUpdatePromptVersion = version;
        // Show immediately unless a modal is already open; otherwise defer
        // until the next manual check (avoids interrupting the user).
        if (!pendingImport && !showClearConfirm && !showManageProblems && !showCliSettings && !showDockerSettings) {
            showUpdatePrompt = true;
            pendingAutomaticUpdatePromptVersion = null;
        }
    }

    function skipAvailableAppUpdateVersion() {
        const version = availableAppUpdate?.version?.trim();
        if (version) {
            skippedAppUpdateVersion = version;
            persistAppUpdatePreference({ skippedVersion: version, autoCheckEnabled: autoCheckAppUpdatesEnabled });
        }
        suppressAutoUpdatePromptUntilNextCheck = false;
        closeUpdatePrompt();
    }

    function remindAboutAppUpdateLater() {
        suppressAutoUpdatePromptUntilNextCheck = true;
        closeUpdatePrompt();
    }

    async function triggerAutomaticAppUpdateCheck() {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return;
        if (!autoCheckAppUpdatesEnabled) return;
        if (appUpdateStatus === 'checking' || appUpdateStatus === 'installing' || appUpdateStatus === 'installed') return;
        const suppressPrompt = suppressAutoUpdatePromptUntilNextCheck;
        suppressAutoUpdatePromptUntilNextCheck = false;
        await checkForAppUpdates({ source: 'automatic', suppressAutoPrompt: suppressPrompt });
    }

    async function resolveAppUpdateReleaseNotes(update: {
        body?: string | null;
    }): Promise<{ notesPreview: string | null; releaseNotesUrl: string }> {
        const fallback = createReleaseNotesPreview(update.body ?? null);
        try {
            return await fetchGithubReleaseNotesMetadata();
        } catch (err) {
            console.warn('Failed to fetch GitHub release notes preview:', err);
            return { notesPreview: fallback, releaseNotesUrl: APP_UPDATE_RELEASES_URL };
        }
    }

    async function checkForAppUpdates(
        options: { source?: 'manual' | 'automatic'; suppressAutoPrompt?: boolean } = {}
    ) {
        const source = options.source ?? 'manual';
        const suppressAutoPrompt = options.suppressAutoPrompt ?? false;
        if (!isDesktopMode) {
            window.open(APP_UPDATE_REPO_URL, '_blank', 'noopener');
            return;
        }
        if (appUpdateStatus === 'checking' || appUpdateStatus === 'installing') return;

        const previousAvailable = availableAppUpdate;
        const previousStatus = appUpdateStatus;
        const previousError = appUpdateError;
        const previousUpdateObject = updateObject;

        appUpdateStatus = 'checking';
        appUpdateError = null;
        appUpdateProgress = null;
        availableAppUpdate = null;
        updateObject = null;

        try {
            const { check } = await import('@tauri-apps/plugin-updater');
            const update = await check();
            if (update) {
                const rawTarget = (update as unknown as { rawJson?: { target?: unknown } }).rawJson?.target;
                const releaseNotes = await resolveAppUpdateReleaseNotes({
                    body: (update as unknown as { body?: string | null }).body ?? null
                });
                availableAppUpdate = {
                    version: update.version,
                    currentVersion: update.currentVersion || '',
                    notes: releaseNotes.notesPreview,
                    publishedAt: (update as unknown as { date?: string | null }).date ?? null,
                    target: typeof rawTarget === 'string' ? rawTarget : '',
                    releaseNotesUrl: releaseNotes.releaseNotesUrl
                };
                updateObject = update as unknown as typeof updateObject;
                appUpdateStatus = 'available';
                if (source === 'manual') {
                    showUpdatePrompt = true;
                } else if (!suppressAutoPrompt && update.version !== skippedAppUpdateVersion) {
                    queueAutomaticUpdatePrompt(update.version);
                } else {
                    closeUpdatePrompt();
                }
            } else {
                appUpdateStatus = 'up_to_date';
                closeUpdatePrompt();
                if (source === 'manual') {
                    showImportNotice("Судья уже в курсе.", false);
                }
            }
        } catch (err) {
            console.error('Failed to check for app updates:', err);
            if (source === 'automatic') {
                availableAppUpdate = previousAvailable;
                appUpdateStatus = previousStatus;
                appUpdateError = previousError;
                updateObject = previousUpdateObject;
                return;
            }
            availableAppUpdate = null;
            updateObject = null;
            appUpdateStatus = 'error';
            appUpdateError = normalizeUpdateErrorMessage(err);
            showUpdatePrompt = false;
            showImportNotice(`Update check failed: ${appUpdateError}`, true);
        }
    }

    async function installAppUpdate() {
        if (appUpdateStatus === 'installing' || appUpdateStatus === 'installed') return;
        // The modal can outlive the in-memory updater handle, and the old
        // guard also rejected the 'error' state — both made Install/Retry
        // silently do nothing. Re-check instead of returning quietly.
        if (!updateObject) {
            appUpdateError = null;
            await checkForAppUpdates({ source: 'manual' });
            if (!updateObject || appUpdateStatus !== 'available') return;
        }
        if (appUpdateStatus !== 'available' && appUpdateStatus !== 'error') return;
        appUpdateStatus = 'installing';
        appUpdateError = null;
        appUpdateProgress = { downloadedBytes: 0, totalBytes: null };
        // Keep the dialog visible so progress is seen; it stays dismissible
        // and the install continues in the background if hidden.
        showUpdatePrompt = true;
        try {
            await updateObject.downloadAndInstall((event) => {
                const name = (event as { event?: string })?.event;
                const data = (event as { data?: { chunkLength?: unknown; contentLength?: unknown } })?.data ?? {};
                if (name === 'Started') {
                    const total = typeof data.contentLength === 'number' ? data.contentLength : null;
                    console.log(`Downloading update (${total ?? '?'} bytes)`);
                    appUpdateProgress = { downloadedBytes: 0, totalBytes: total };
                } else if (name === 'Progress') {
                    const chunk = typeof data.chunkLength === 'number' ? data.chunkLength : 0;
                    const prev = appUpdateProgress ?? { downloadedBytes: 0, totalBytes: null };
                    appUpdateProgress = {
                        downloadedBytes: prev.downloadedBytes + chunk,
                        totalBytes: prev.totalBytes
                    };
                }
            });
            appUpdateProgress = null;
            appUpdateStatus = 'installed';
        } catch (err) {
            console.error('Failed to install app update:', err);
            appUpdateProgress = null;
            appUpdateStatus = 'error';
            appUpdateError = formatAppUpdateInstallError(err);
        }
    }

    async function restartToApplyUpdate() {
        try {
            const { relaunch } = await import('@tauri-apps/plugin-process');
            await relaunch();
        } catch (err) {
            console.error('Failed to restart after installing update:', err);
            appUpdateError = normalizeUpdateErrorMessage(err);
        }
    }

    async function openUpdateFromMenu() {
        showDropdown = false;
        if (!isDesktopMode) {
            window.open(APP_UPDATE_REPO_URL, '_blank', 'noopener');
            return;
        }
        // If we already know about an update (including one that is
        // installing, installed, or failed), just show it again so progress
        // and errors stay visible instead of starting a conflicting check.
        if (
            availableAppUpdate &&
            (appUpdateStatus === 'available' ||
                appUpdateStatus === 'installing' ||
                appUpdateStatus === 'installed' ||
                appUpdateStatus === 'error')
        ) {
            showUpdatePrompt = true;
            return;
        }
        await checkForAppUpdates({ source: 'manual' });
    }

    function openDockerSettings() {
        if (!isDesktopMode || $page.data.isDemoSite) return;
        showDropdown = false;
        showDockerSettings = true;
    }

    async function refreshDockerStatus() {
        if (!isDesktopMode || $page.data.isDemoSite || dockerStatusChecking) return;
        dockerStatusChecking = true;
        try {
            const settings = await invokeDesktop<{ selected: string }>('docker_settings');
            await invokeDesktop('test_docker_connection', { selected: settings.selected });
            dockerConnected = true;
        } catch {
            dockerConnected = false;
        } finally {
            dockerStatusChecking = false;
        }
    }

    async function closeDockerSettings() {
        showDockerSettings = false;
        await tick();
        dropdownToggleButton?.focus();
    }

    function handleDockerSaved() {
        showImportNotice("Настройки Docker сохранены. Брось и открой Cojudge, чтобы применить.", false);
    }

    async function refreshCliStatus() {
        if (!isDesktopMode) return;
        try {
            cliStatus = await invokeDesktop('cli_status');
            cliError = '';
        } catch (error) {
            cliStatus = {
                available: false,
                installed: false,
                path: null,
                aliasPaths: [],
                needsNewTerminal: false,
                message: null
            };
            cliError = error instanceof Error ? error.message : String(error);
        }
    }

    async function openCliSettings() {
        if (!isDesktopMode) return;
        showDropdown = false;
        cliError = '';
        cliPathCopied = false;
        if (cliPathCopiedTimer) clearTimeout(cliPathCopiedTimer);
        showCliSettings = true;
        await refreshCliStatus();
    }

    async function closeCliSettings() {
        showCliSettings = false;
        cliBusy = false;
        cliPathCopied = false;
        if (cliPathCopiedTimer) clearTimeout(cliPathCopiedTimer);
        await tick();
        dropdownToggleButton?.focus();
    }

    async function copyCliPath() {
        const cliPath = cliStatus.path;
        if (!cliPath) return;
        cliError = '';
        try {
            await navigator.clipboard.writeText(cliPath);
            cliPathCopied = true;
            if (cliPathCopiedTimer) clearTimeout(cliPathCopiedTimer);
            cliPathCopiedTimer = setTimeout(() => {
                cliPathCopied = false;
            }, 1500);
        } catch {
            cliError = `Could not copy. Path: ${cliPath}`;
        }
    }

    async function installCli() {
        cliBusy = true;
        cliError = '';
        try {
            cliStatus = await invokeDesktop('cli_install');
        } catch (error) {
            cliError = error instanceof Error ? error.message : String(error);
        } finally {
            cliBusy = false;
        }
    }

    async function uninstallCli() {
        cliBusy = true;
        cliError = '';
        try {
            cliStatus = await invokeDesktop('cli_uninstall');
        } catch (error) {
            cliError = error instanceof Error ? error.message : String(error);
        } finally {
            cliBusy = false;
        }
    }

    async function removeCliAlias() {
        cliBusy = true;
        cliError = '';
        try {
            cliStatus = await invokeDesktop('cli_remove_shell_alias');
        } catch (error) {
            cliError = error instanceof Error ? error.message : String(error);
        } finally {
            cliBusy = false;
        }
    }

    async function copyContentDir() {
        manageProblemsError = '';
        try {
            await navigator.clipboard.writeText(contentDir);
            pathCopied = true;
            if (pathCopiedTimer) clearTimeout(pathCopiedTimer);
            pathCopiedTimer = setTimeout(() => {
                pathCopied = false;
            }, 1500);
        } catch {
            manageProblemsError = `Could not copy. Path: ${contentDir}`;
        }
    }

    async function revealContentFolder() {
        manageProblemsError = '';
        revealingFolder = true;
        try {
            const response = await fetch('/api/reveal-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: contentDir })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result?.error || 'Could not open the folder');
            }
        } catch (err: any) {
            manageProblemsError = err?.message
                ? `Could not open the folder automatically. Please open it manually: ${contentDir}`
                : `Please open this folder manually: ${contentDir}`;
        } finally {
            revealingFolder = false;
        }
    }

    async function resetContentToBundled(type: 'problem' | 'course', id: string) {
        manageProblemsError = '';
        resettingContentKey = `${type}:${id}`;
        try {
            const response = await fetch('/api/content/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result?.error || 'Could not reset content');
            }
            window.location.reload();
        } catch (err: any) {
            manageProblemsError = err?.message
                ? `Could not reset ${id}: ${err.message}`
                : `Could not reset ${id}`;
        } finally {
            resettingContentKey = null;
        }
    }

    async function resetAllModifiedToBundled() {
        manageProblemsError = '';
        resettingAllContent = true;
        try {
            const response = await fetch('/api/content/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result?.error || 'Could not reset content');
            }
            window.location.reload();
        } catch (err: any) {
            manageProblemsError = err?.message
                ? `Could not reset all: ${err.message}`
                : "Не удалось сбросить все";
        } finally {
            resettingAllContent = false;
        }
    }

    function openExamModal() {
        examModal = { mode: $page.data.isExamMode ? 'disable' : 'enable' };
        examPassword = '';
        examPasswordConfirm = '';
        examPasswordError = '';
        showDropdown = false;
        tick().then(() => examPasswordInput?.focus());
    }

    async function submitExamModal() {
        if (!examModal || examSubmitting) return;
        const password = examPassword;
        if (password.length < 4) {
            examPasswordError = "Пароль должен быть как минимум 4 символами.";
            return;
        }
        if (examModal.mode === 'enable' && password !== examPasswordConfirm) {
            examPasswordError = "Пароли не совпадают.";
            return;
        }
        examPasswordError = '';
        examSubmitting = true;
        try {
            const response = await fetch('/api/exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ on: examModal.mode === 'enable', password })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result?.error || 'Could not switch exam mode');
            }
            window.location.reload();
        } catch (err: any) {
            examPasswordError = err?.message || 'Could not switch exam mode';
        } finally {
            examSubmitting = false;
        }
    }

    async function closeClearProgress() {
        showClearConfirm = false;
        await tick();
        dropdownToggleButton?.focus();
    }

    async function confirmClearProgress() {
        try {
            clearProgressStorage(localStorage);
            await clearPastedImages();
            void closeClearProgress();
            window.location.reload();
        } catch (err: any) {
            void closeClearProgress();
            showImportNotice(`Failed to clear progress: ${err?.message || String(err)}`, true);
        }
    }

    async function handleSolvedCheckboxClick(event: MouseEvent, problemId: string) {
        const isSolved = checkMap[problemId] === true;
        if (isSolved) {
            event.preventDefault();
            const confirmed = await showConfirm(
                "Вы хотите обозначить эту проблему как нерешенную? Вам нужно будет снова представить правильное решение, чтобы обозначить ее как решенную.",
                {
                    title: "Марк не раскрыт?",
                    confirmLabel: "Марк нераскрытый",
                    cancelLabel: "Отмена",
                    tone: 'danger'
                }
            );
            if (confirmed) {
                userStore.update((prev) => {
                    const next = { ...prev };
                    delete next[problemId];
                    return next;
                });
            }
        } else {
            // Prevent manually marking as solved; only a successful submit can mark solved
            event.preventDefault();
        }
    }
</script>

<svelte:head>
    <title>Cojudge — локальный тренажёр задач по программированию</title>
</svelte:head>

<svelte:window onkeydown={handleModalKeydown} />

{#if $page.data.isDemoSite}
    <DemoBanner />
{/if}
{#if $page.data.isExamMode}
    <div class="exam-banner" role="note">Экзаменный режим включен — подсказки и справочные решения скрыты.</div>
{/if}
{#if $page.data.examTampered}
    <div class="exam-tamper" role="alert">Предупреждение: блокировка экзамена была удалена без пароля. Подсказки или решения могли быть восстановлены — проверьте перед мероприятием.</div>
{/if}

<div class="container">
    <div class="backup-toolbar">
        <Tooltip text={"Песочница"} pos={"bottom"}>
            <a href="playground" class="btn playground-btn" aria-label="Песочница">
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
                onclick={toggleDropdown}
                onkeydown={handleDropdownTriggerKeydown}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Открыть меню"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                {#if $cloudSyncState.authStatus === 'signed-in' && ($cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading')}
                    <span class="dropdown-cloud-loading" title="Синхронизация с Cojudge Cloud" aria-hidden="true"></span>
                {:else if $cloudSyncState.authStatus === 'signed-in' && $cloudSyncState.resolution}
                    <span class="dropdown-cloud-dirty" title="Местные или конфликтующие облачные изменения требуют внимания." aria-hidden="true">*</span>
                {/if}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {#if showDropdown}
                <div bind:this={dropdownMenu} class="dropdown-menu" role="menu" tabindex="-1" onkeydown={handleDropdownKeydown}>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={openCloudSettings}
                        title="Войти и синхронизировать прогресс с Cojudge Cloud"
                    >
                        <span class="dropdown-item-content">
                            Облачная синхронизация
                        </span>
                        <span
                            class:configured={$cloudSyncState.authStatus === 'signed-in' && !$cloudSyncState.resolution && $cloudSyncState.syncStatus !== 'syncing' && $cloudSyncState.remoteStatus !== 'loading'}
                            class:pending={Boolean($cloudSyncState.resolution) && $cloudSyncState.syncStatus !== 'syncing' && $cloudSyncState.remoteStatus !== 'loading'}
                            class:syncing={$cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading'}
                            class="firebase-menu-status"
                            title={$cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading'
                                ? "Синхронизация с Cojudge Cloud"
                                : $cloudSyncState.resolution === 'local-changes'
                                    ? "Местные изменения не были перенесены в Cojudge Cloud"
                                    : undefined}
                        >
                            {cloudMenuStatus()}
                        </span>
                    </button>
                    <div class="dropdown-separator" role="separator"></div>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { exportLocalStorage(); showDropdown = false; }}
                        disabled={!browser}
                        title="Экспортировать весь прогресс (настройки, код и т.д.) в файл JSON"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Экспорт прогресса
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { triggerImport(); showDropdown = false; }}
                        disabled={!browser}
                        title="Прогресс импорта (настройки, код и т. Д.) из резервной копии JSON"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Импорт прогресса
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={openClearProgress}
                        disabled={!browser}
                        title="Удалить все прогресс, решения, файлы и настройки, хранящиеся локально."
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Очистить прогресс
                        </span>
                    </button>
                    {#if !$page.data.isDemoSite}
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { goto('/recovery'); showDropdown = false; }}
                        title="Инспектор безопасного режима хранения: измерение и ремонт локальных данных без открытия игровой площадки"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                            восстановление
                        </span>
                    </button>
                    {/if}
                    <div class="dropdown-separator" role="separator"></div>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { goto('/whiteboard'); showDropdown = false; }}
                        title="Откройте доску"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                            </svg>
                            Доска
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => { showGamePopup = true; showDropdown = false; }}
                        title="Режим игры Random problem"
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="6" y1="12" x2="10" y2="12"></line>
                                <line x1="8" y1="10" x2="8" y2="14"></line>
                                <line x1="15" y1="13" x2="15.01" y2="13"></line>
                                <line x1="18" y1="11" x2="18.01" y2="11"></line>
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            </svg>
                            Играть
                        </span>
                    </button>
                    {#if !$page.data.isDemoSite}
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openManageProblems}
                            title="Просмотр, редактирование и добавление проблем и курсов в папку Cojudge"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    <line x1="12" y1="11" x2="12" y2="17"></line>
                                    <line x1="9" y1="14" x2="15" y2="14"></line>
                                </svg>
                                Управление задачами
                            </span>
                        </button>
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openExamModal}
                            title={$page.data.isExamMode ? "Выключите режим экзамена (требуется пароль экзамена)" : "Стриптиз-подсказки и решения и спрячьте их в UI"}
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Режим экзамена
                            </span>
                            <span class:configured={$page.data.isExamMode} class="firebase-menu-status">
                                {$page.data.isExamMode ? "Вкл." : "Выкл."}
                            </span>
                        </button>
                    {/if}
                    {#if isDesktopMode}
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openCliSettings}
                            title="Установите cojudge CLI на свой PATH"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="4 17 10 11 4 5"></polyline>
                                    <line x1="12" y1="19" x2="20" y2="19"></line>
                                </svg>
                                CLI
                            </span>
                            <span class:configured={cliStatus.installed} class="firebase-menu-status">
                                {cliStatus.installed ? "Вкл." : "Выкл."}
                            </span>
                        </button>
                        <div class="dropdown-separator" role="separator"></div>
                        {#if !$page.data.isDemoSite}
                            <button class="dropdown-item" role="menuitem" onclick={openDockerSettings}>
                                <span class="dropdown-item-content">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                                        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                                        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                                        <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                                    </svg>
                                    Настройки Docker
                                </span>
                                <span class="firebase-menu-status" class:configured={dockerConnected && !dockerStatusChecking} title="Статус подключения сохраненного времени выполнения Docker" aria-label={dockerStatusChecking ? "Проверка подключения Docker" : dockerConnected ? "Docker подключён" : "Docker недоступен"}>
                                    {dockerStatusChecking ? '…' : dockerConnected ? "Вкл." : "Выкл."}
                                </span>
                            </button>
                        {/if}
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openFirebaseSettings}
                            title="Настройка обмена Firebase для настольного режима"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2 4.5 20.3a.5.5 0 0 0 .7.6L12 17l6.8 3.9a.5.5 0 0 0 .7-.6L12 2Z"></path>
                                    <path d="m8.5 11.2 7 0"></path>
                                </svg>
                                Параметры Firebase
                            </span>
                            <span class:configured={firebaseConfigured} class="firebase-menu-status">
                                {firebaseConfigured ? "Вкл." : "Выкл."}
                            </span>
                        </button>
                        {#if firebaseConfigured}
                            <button
                                class="dropdown-item"
                                role="menuitem"
                                onclick={openLoadCode}
                                title="Откройте совместно используемое решение с помощью кода из четырех символов в сконфигурированной пожарной базе"
                            >
                                <span class="dropdown-item-content">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>
                                        <path d="m10 8 4 4-4 4"></path>
                                    </svg>
                                    Загрузить файл
                                </span>
                            </button>
                        {/if}
                        <div class="dropdown-separator" role="separator"></div>
                        <button
                            class="dropdown-item"
                            role="menuitem"
                            onclick={openNewWindow}
                            title="Открыть новое окно"
                        >
                            <span class="dropdown-item-content">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                    <line x1="12" y1="9" x2="12" y2="15"></line>
                                    <line x1="9" y1="12" x2="15" y2="12"></line>
                                </svg>
                                Новое окно
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
                        title="Переключить тему"
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
                                Световая тема{:else}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                                Темная тема{/if}
                        </span>
                    </button>
                    <button
                        class="dropdown-item"
                        role="menuitem"
                        onclick={() => void openUpdateFromMenu()}
                        title={isDesktopMode ? "Check GitHub выпустил новую сборку Cojudge" : "Открытое жюри на GitHub"}
                    >
                        <span class="dropdown-item-content">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            {updateMenuLabel}
                        </span>
                        {#if updateAvailable}
                            <span class="firebase-menu-status configured" title="Новая сборка Cojudge уже доступна">
                                Новый
                            </span>
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
        <input bind:this={fileInputEl} type="file" accept="application/json" class="hidden-file-input" onchange={onImportFileSelected} />
    </div>
    {#if pendingImport}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Отменить импорт" tabindex="-1" onclick={cancelImport}></button>
            <div bind:this={importModalCard} class="home-modal-card" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
                <h2 id="import-dialog-title">Импортировать локальные данные?</h2>
                <p>Соответствие локальным решениям, файлам, настройкам и прогрессу будет перезаписано этой резервной копией.</p>
                <div class="home-modal-actions">
                    <button class="btn" type="button" onclick={cancelImport}>Отмена</button>
                    <button bind:this={importConfirmButton} class="btn modal-primary-btn" type="button" onclick={confirmImport}>Импортировать данные</button>
                </div>
            </div>
        </div>
    {/if}
    {#if showClearConfirm}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Отменить процесс очистки" tabindex="-1" onclick={closeClearProgress}></button>
            <div bind:this={clearConfirmCard} class="home-modal-card clear-progress-card" role="dialog" aria-modal="true" aria-labelledby="clear-progress-title">
                <h2 id="clear-progress-title">Очистить весь прогресс?</h2>
                <p>Это навсегда удаляет весь локальный прогресс: решения, сохраненный код, файлы, настройки, тестовые случаи, историю игр и вставленные изображения. Все локальное хранилище исчезнет, и это не может быть отменено.</p>
                <div class="home-modal-actions">
                    <button class="btn" type="button" onclick={closeClearProgress}>Отмена</button>
                    <button class="btn clear-progress-danger-btn" type="button" onclick={confirmClearProgress}>Очистить прогресс</button>
                </div>
            </div>
        </div>
    {/if}
    {#if showManageProblems && !$page.data.isDemoSite}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Близкое управление проблемами" tabindex="-1" onclick={() => void closeManageProblems()}></button>
            <div bind:this={manageProblemsCard} class="home-modal-card manage-problems-card" role="dialog" aria-modal="true" aria-labelledby="manage-problems-title">
                <span class="modal-eyebrow">Локальный контент</span>
                <h2 id="manage-problems-title">Управление задачами</h2>
                {#if $page.data.isExamMode}
                    <p class="modal-error" role="note">Включен режим экзамена - скрыты подсказки и справочные решения. Сброс и открытие папки контента отключены. Выключите режим экзамена в меню, чтобы восстановить все.</p>
                {/if}
                <p class="manage-intro">Задачи и подборки хранятся в папке Cojudge. Файлы можно редактировать напрямую — изменения появятся после обновления страницы.</p>

                <div class="manage-path-row">
                    <code class="manage-path-text">{contentDir}</code>
                    <button
                        class="manage-path-copy"
                        type="button"
                        onclick={copyContentDir}
                        title={pathCopied ? "Скопировано" : "Путь копирования"}
                        aria-label={pathCopied ? "Путь копировался" : "Путь копирования"}
                    >
                        {#if pathCopied}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        {:else}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        {/if}
                    </button>
                </div>

                <div class="manage-sections">
                    <div class="manage-section">
                        <h3>Задачи</h3>
                        <code class="manage-section-path">problems/&lt;slug&gt;/</code>
                        <p>statement.md · metadata.json · official-tests.json · Marker.java · solution.md (необязательно)</p>
                    </div>
                    <div class="manage-section">
                        <h3>Курсы</h3>
                        <code class="manage-section-path">courses/&lt;id&gt;/courseinfo.json</code>
                        <p>Заказ категории и список проблем для каждой вкладки курса.</p>
                    </div>
                </div>

                <p class="manage-note">Чтобы добавить задачу, скопируйте её папку, измените файлы и добавьте идентификатор в <code>courseinfo.json</code>. Неизменённые задачи обновляются вместе с Cojudge; ваши правки сохраняются.</p>

                {#if modifiedInventoryLoading}
                    <div class="manage-section manage-modified" aria-live="polite">
                        <h3>Модифицированный — отличается от пакетного</h3>
                        <p>Проверка вашей папки Cojudge для редактирования ...</p>
                    </div>
                {:else if modifiedItemCount > 0}
                    <div class="manage-section manage-modified">
                        <h3>Модифицированный — отличается от пакетного (){modifiedItemCount})</h3>
                        <p>Если вы не редактировали их, они являются устаревшими копиями из более старой версии — сбросьте их, чтобы получить последние исправления.</p>
                        <ul class="manage-modified-list">
                            {#each modifiedProblems as item}
                                <li>
                                    <span class="manage-modified-id" title={item.title}>{item.id}</span>
                                    <span class="manage-modified-kind">проблема</span>
                                    <button
                                        class="btn manage-reset-btn"
                                        type="button"
                                        disabled={resettingContentKey !== null || resettingAllContent || $page.data.isExamMode}
                                        onclick={() => void resetContentToBundled('problem', item.id)}
                                    >{resettingContentKey === `problem:${item.id}` ? "Перезагрузка..." : "Сбросить"}</button>
                                </li>
                            {/each}
                            {#each modifiedCourses as item}
                                <li>
                                    <span class="manage-modified-id" title={item.title}>{item.id}</span>
                                    <span class="manage-modified-kind">курс</span>
                                    <button
                                        class="btn manage-reset-btn"
                                        type="button"
                                        disabled={resettingContentKey !== null || resettingAllContent || $page.data.isExamMode}
                                        onclick={() => void resetContentToBundled('course', item.id)}
                                    >{resettingContentKey === `course:${item.id}` ? "Перезагрузка..." : "Сбросить"}</button>
                                </li>
                            {/each}
                        </ul>
                        {#if modifiedItemCount > 1}
                            <button
                                class="btn"
                                type="button"
                                disabled={resettingContentKey !== null || resettingAllContent || $page.data.isExamMode}
                                onclick={() => void resetAllModifiedToBundled()}
                            >{resettingAllContent ? "Перезагрузка..." : `Сбросить все ()${modifiedItemCount})`}</button>
                        {/if}
                    </div>
                {/if}

                {#if manageProblemsError}
                    <p class="modal-error" role="alert">{manageProblemsError}</p>
                {/if}
                <div class="home-modal-actions">
                    <button class="btn" type="button" onclick={revealContentFolder} disabled={revealingFolder || $page.data.isExamMode}>{revealingFolder ? "Открытие..." : "Открытая папка"}</button>
                    <span class="modal-action-spacer"></span>
                    <button class="btn modal-primary-btn" type="button" onclick={() => void closeManageProblems()}>Готово</button>
                </div>
            </div>
        </div>
    {/if}
    {#if examModal}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Отмена" tabindex="-1" onclick={() => (examModal = null)}></button>
            <div class="home-modal-card" role="dialog" aria-modal="true" aria-labelledby="exam-modal-title">
                <span class="modal-eyebrow">{examModal.mode === 'enable' ? "Замкнутые ответы" : "Разблокировать ответы"}</span>
                <h2 id="exam-modal-title">{examModal.mode === 'enable' ? "Включить режим экзамена" : "Выключить режим экзамена"}</h2>
                {#if examModal.mode === 'enable'}
                    <p class="manage-intro">Подсказки и справочные решения будут удалены из вашей папки Cojudge и скрыты в пользовательском интерфейсе. Перезагрузка отключена при включении режима экзамена. Они восстанавливаются автоматически при выключении режима экзамена. Выберите пароль — выключение режима экзамена позже требует этого.</p>
                    <label class="exam-label" for="exam-password-new">Экзамен пароля (мин 4 символов)</label>
                    <input
                        id="exam-password-new"
                        class="exam-input"
                        type="password"
                        autocomplete="new-password"
                        bind:this={examPasswordInput}
                        bind:value={examPassword}
                        onkeydown={(e) => { if (e.key === 'Enter') void submitExamModal(); }}
                    />
                    <label class="exam-label" for="exam-password-confirm">Подтвердить пароль</label>
                    <input
                        id="exam-password-confirm"
                        class="exam-input"
                        type="password"
                        autocomplete="new-password"
                        bind:value={examPasswordConfirm}
                        onkeydown={(e) => { if (e.key === 'Enter') void submitExamModal(); }}
                    />
                {:else}
                    <p class="manage-intro">Введите пароль экзамена, чтобы выключить режим экзамена. Ваши оригинальные подсказки и решения будут восстановлены автоматически.</p>
                    <label class="exam-label" for="exam-password">Экзамен пароля</label>
                    <input
                        id="exam-password"
                        class="exam-input"
                        type="password"
                        autocomplete="current-password"
                        bind:this={examPasswordInput}
                        bind:value={examPassword}
                        onkeydown={(e) => { if (e.key === 'Enter') void submitExamModal(); }}
                    />
                {/if}
                {#if examPasswordError}
                    <p class="modal-error" role="alert">{examPasswordError}</p>
                {/if}
                <div class="home-modal-actions">
                    <button class="btn" type="button" onclick={() => (examModal = null)} disabled={examSubmitting}>Отмена</button>
                    <button class="btn modal-primary-btn" type="button" onclick={() => void submitExamModal()} disabled={examSubmitting}>{examSubmitting ? "Работать..." : examModal.mode === 'enable' ? "Включить режим экзамена" : "Выключить режим экзамена"}</button>
                </div>
            </div>
        </div>
    {/if}
    {#if showDockerSettings && isDesktopMode && !$page.data.isDemoSite}
        <DockerSettingsModal open={showDockerSettings} onClose={closeDockerSettings} onSaved={handleDockerSaved} />
    {/if}
    {#if showCliSettings && isDesktopMode}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Закрыть настройки CLI" tabindex="-1" onclick={() => void closeCliSettings()}></button>
            <div bind:this={cliSettingsCard} class="home-modal-card manage-problems-card" role="dialog" aria-modal="true" aria-labelledby="cli-settings-title">
                <div class="modal-heading-row">
                    <div>
                        <span class="modal-eyebrow">Командная строка</span>
                        <h2 id="cli-settings-title">Судья КЛИ</h2>
                    </div>
                    <span class:configured={cliStatus.installed} class="firebase-status-pill">
                        <span></span>{cliStatus.installed ? "установленный" : "Не установлен"}
                    </span>
                </div>
                <p class="manage-intro">Добавить <code>cojudge</code> PATH с помощью этого приложения Node.js.</p>

                {#if cliStatus.path}
                    <div class="manage-path-row">
                        <code class="manage-path-text">{cliStatus.path}</code>
                        <button
                            class="manage-path-copy"
                            type="button"
                            onclick={copyCliPath}
                            title={cliPathCopied ? "Скопировано" : "Путь копирования"}
                            aria-label={cliPathCopied ? "Путь копировался" : "Путь копирования"}
                        >
                            {#if cliPathCopied}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            {:else}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            {/if}
                        </button>
                    </div>
                {/if}

                <div class="manage-sections">
                    <div class="manage-section">
                        <h3>использование</h3>
                        <ul class="cli-usage">
                            <li><code>cojudge list</code> Перечисление проблем</li>
                            <li><code>cojudge init two-sum --lang python</code> Стартовый файл</li>
                            <li><code>cojudge run two-sum Solution.py</code> Тесты образцов</li>
                            <li><code>cojudge submit two-sum Solution.py</code> Официальные испытания</li>
                            <li><code>cojudge version</code> Установленный номер выпуска</li>
                            <li><code>cojudge update</code> Check GitHub выпустил новое приложение</li>
                        </ul>
                    </div>
                    {#if cliStatus.aliasPaths?.length}
                        <div class="manage-section">
                            <h3>Имя Shell</h3>
                            <p>A <code>cojudge</code> псевдоним из <code>./install.sh</code> был найден в {cliStatus.aliasPaths.join(', ')}Он перекрывает CLI рабочего стола в терминалах.</p>
                            <button class="btn" type="button" onclick={removeCliAlias} disabled={cliBusy}>{cliBusy ? "Удаление..." : "Удалить псевдоним"}</button>
                        </div>
                    {/if}
                </div>

                <p class="manage-note">Откройте новый терминал после установки. Проблемы живут в <code>{contentDir}</code>Докер необходим для запуска и подачи.</p>

                {#if cliStatus.message && !cliError}
                    <p class="cli-status-note">{cliStatus.message}</p>
                {/if}
                {#if cliError}
                    <p class="modal-error" role="alert">{cliError}</p>
                {/if}
                <div class="home-modal-actions">
                    {#if cliStatus.installed}
                        <button class="btn remove-settings-btn" type="button" onclick={uninstallCli} disabled={cliBusy}>{cliBusy ? "Удаление..." : "Удалить"}</button>
                    {/if}
                    <span class="modal-action-spacer"></span>
                    <button class="btn" type="button" onclick={() => void closeCliSettings()}>Закрыть</button>
                    {#if !cliStatus.installed}
                        <button class="btn modal-primary-btn" type="button" onclick={installCli} disabled={cliBusy || !cliStatus.available}>{cliBusy ? "Установка..." : "устанавливать"}</button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    <CloudSyncModal open={showCloudSettings} onClose={closeCloudSettings} />
    {#if showUpdatePrompt && availableAppUpdate}
        <UpdatePromptModal
            {availableAppUpdate}
            {appUpdateStatus}
            {appUpdateError}
            downloadProgress={appUpdateProgress}
            onInstall={appUpdateStatus === 'installed' ? restartToApplyUpdate : installAppUpdate}
            onSkipVersion={skipAvailableAppUpdateVersion}
            onRemindLater={remindAboutAppUpdateLater}
            onClose={remindAboutAppUpdateLater}
        />
    {/if}
    {#if showFirebaseSettings}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Закрыть Firebase" tabindex="-1" onclick={closeFirebaseSettings}></button>
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
                        <span class="modal-eyebrow">Подключение к рабочему столу</span>
                        <h2 id="firebase-settings-title">Параметры Firebase</h2>
                    </div>
                    <span class:configured={firebaseConfigured} class="firebase-status-pill">
                        <span></span>{firebaseConfigured ? "сконфигурированный" : "Не сконфигурированный"}
                    </span>
                </div>
                <p>Подключите это настольное приложение к проекту Firebase, используемому для общих решений и Cojudge Cloud.</p>
                <div class="firebase-fields">
                    <label>
                        <span>API key <code>VITE_FIREBASE_API_KEY</code></span>
                        <input bind:this={firebaseApiKeyInput} bind:value={firebaseForm.apiKey} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label>
                        <span>домен Auth <code>VITE_FIREBASE_AUTH_DOMAIN</code></span>
                        <input bind:value={firebaseForm.authDomain} required autocomplete="off" spellcheck="false" placeholder="project.firebaseapp.com" />
                    </label>
                    <label>
                        <span>Проект ID <code>VITE_FIREBASE_PROJECT_ID</code></span>
                        <input bind:value={firebaseForm.projectId} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label>
                        <span>Идентификатор отправителя сообщений <code>VITE_FIREBASE_MESSAGING_SENDER_ID</code></span>
                        <input bind:value={firebaseForm.messagingSenderId} required autocomplete="off" spellcheck="false" inputmode="numeric" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>Идентификатор <code>VITE_FIREBASE_APP_ID</code></span>
                        <input bind:value={firebaseForm.appId} required autocomplete="off" spellcheck="false" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>Ведро для хранения <small>необязательный</small> <code>VITE_FIREBASE_STORAGE_BUCKET</code></span>
                        <input bind:value={firebaseForm.storageBucket} autocomplete="off" spellcheck="false" placeholder="Project.firebasestorage.app" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>Google Desktop Client ID <small>Требуется для входа в облако</small> <code>VITE_GOOGLE_DESKTOP_CLIENT_ID</code></span>
                        <input bind:value={firebaseForm.googleDesktopClientId} autocomplete="off" spellcheck="false" placeholder="000000000000-example.apps.googleusercontent.com" />
                    </label>
                    <label class="firebase-field-wide">
                        <span>Секретный клиент Google Desktop <small>Для локальных/таможенных сборок</small> <code>VITE_GOOGLE_DESKTOP_CLIENT_SECRET</code></span>
                        <input type="password" bind:value={firebaseForm.googleDesktopClientSecret} autocomplete="off" spellcheck="false" placeholder="GOCSPX..." />
                    </label>
                </div>
                <p class="firebase-settings-note">Учетные данные Desktop OAuth не могут быть конфиденциальными в установленном приложении; PKCE защищает каждый обмен входами.</p>
                {#if firebaseSettingsError}
                    <p class="modal-error" role="alert">{firebaseSettingsError}</p>
                {/if}
                    <div class="home-modal-actions settings-actions">
                        {#if firebaseSettingsSaved}
                            <button class="btn remove-settings-btn" type="button" onclick={removeFirebaseSettings}>Удалить сохраненный</button>
                        {/if}
                        <span class="modal-action-spacer"></span>
                        <button class="btn" type="button" onclick={closeFirebaseSettings}>Отмена</button>
                        <button class="btn modal-primary-btn" type="submit">Сохранить настройки</button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
    {#if showLoadCode}
        <div class="home-modal-shell">
            <button class="home-modal-backdrop" aria-label="Закрытый общий загрузчик кода" tabindex="-1" onclick={closeLoadCode}></button>
            <div bind:this={loadModalCard} class="home-modal-card load-code-card" role="dialog" aria-modal="true" aria-labelledby="load-code-title">
                <span class="modal-eyebrow">Совместное решение</span>
                <h2 id="load-code-title">Введите код</h2>
                <p>Введите или вставьте код из четырех символов из ссылки Cojudge share.</p>
                <div class="load-code-inputs" aria-label="Четырехсимвольный код Share" onpaste={handleLoadCodePaste}>
                    {#each loadCodeCharacters as character, index}
                        <input
                            bind:this={loadCodeInputs[index]}
                            value={character}
                            aria-label={`Кодовые характеристики ${index + 1}`}
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
                <p class="load-code-hint">Коды чувствительны к регистру и открываются автоматически.</p>
                <div class="home-modal-actions load-code-actions">
                    <button class="btn" type="button" onclick={closeLoadCode}>Отмена</button>
                </div>
            </div>
        </div>
    {/if}
    {#if importNotice}
        <div class:error={importNotice.error} class="import-toast" role={importNotice.error ? 'alert' : 'status'}>
            <span>{importNotice.message}</span>
            {#if importNotice.filePath}
                <button class="reveal-btn" onclick={() => revealFile(importNotice?.filePath)}>
                    Показать в папке
                </button>
            {/if}
        </div>
    {/if}
    <nav class="tabs" aria-label="Курс">
        {#each courses as course}
            <a
                class="tab"
                class:active={!showBookmarks && course.id === selectedCourseId}
                class:pending={isTabPending(course.id)}
                href={`/?course=${encodeURIComponent(course.id)}`}
                aria-current={!showBookmarks && course.id === selectedCourseId ? "page" : undefined}
                aria-disabled={isTabPending(course.id) ? 'true' : undefined}
                onclick={() => selectCourse(course.id)}
            >{#if isTabPending(course.id)}<span class="tab-spinner" aria-hidden="true"></span>{/if}{course.title}{#if course.source && course.source !== 'bundled'}<span
                    class="source-badge {course.source}"
                    title={sourceTitle(course.source)}
                >{sourceLabel(course.source)}</span>{/if}</a>
        {/each}
        {#if bookmarkCount > 0}
            <button
                type="button"
                class="tab"
                class:active={showBookmarks}
                aria-current={showBookmarks ? "page" : undefined}
                aria-pressed={showBookmarks}
                title={showBookmarks ? "Показать закладки проблем" : `Показать закладки проблем ()${bookmarkCount})`}
                onclick={() => { showBookmarks = true; }}
            >Закладки ({bookmarkCount})</button>
        {/if}
    </nav>
    {#if hasCustomContent || hasModifiedContent}
        <div class="source-legend" aria-label="Легенда для пользовательских ярлыков контента">
            {#if hasCustomContent}
                <span class="source-badge custom">Своя</span> Создан в вашей папке Cojudge{/if}
            {#if hasCustomContent && hasModifiedContent}
                <span class="source-legend-sep" aria-hidden="true">·</span>
            {/if}
            {#if hasModifiedContent}
                <span class="source-badge modified">Изменено</span> Отредактировано в вашей папке Cojudge{/if}
        </div>
    {/if}
    <div class="intro" class:stale={isCourseNavigating} aria-busy={isCourseNavigating || undefined}>
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
        {#if showBookmarks}
            <p>Проблемы, которые вы закладывали позже. Переключите значок закладки рядом с любой проблемой, чтобы добавить или удалить его здесь.</p>
        {:else}
            {@html renderMarkdown(courseDescription)}
        {/if}
    </div>

    <div class="search-container" class:stale={isCourseNavigating}>
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
            type="text"
            class="search-input"
            placeholder="Поиск задач…"
            bind:value={searchQuery}
            aria-label="Поиск задач"
        />
        {#if searchQuery}
            <button
                class="search-clear"
                onclick={() => searchQuery = ""}
                aria-label="Очистить поиск"
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
            problems={baseProblems}
            poolLabel={showBookmarks ? 'your bookmarks' : null}
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
        <div class="group" class:stale={isCourseNavigating}>
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
                                <th>
                                    <button
                                        class="th-button"
                                        onclick={() =>
                                            toggleSort(key, "status")}
                                        aria-label="Сортировать по статусу"
                                    >
                                        Статус
                                        <span
                                            class="sort-icon"
                                            aria-hidden="true"
                                        >
                                            <SortIcon
                                                active={groupSort[key]?.key ===
                                                    "status"}
                                                dir={groupSort[key]?.dir}
                                            />
                                        </span>
                                    </button>
                                </th>
                                <th>
                                    <button
                                        class="th-button"
                                        onclick={() =>
                                            toggleSort(key, "title")}
                                        aria-label="Сортировать по названию"
                                    >
                                        Название
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
                                        aria-label="Сортировать по сложности"
                                    >
                                        Сложность
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
                            {#key JSON.stringify([groupSort, solvedCount])}
                                {#each getSortedGroup(grouped[key] || [], key) as problem}
                                    <tr>
                                        <td class="status-cell">
                                            <input
                                                type="checkbox"
                                                checked={checkMap[
                                                    problem.id
                                                ] === true}
                                                disabled={checkMap[problem.id] !== true}
                                                title={checkMap[problem.id] === true ? "Марк как нераскрытый" : "Предоставить правильное решение для маркировки как решено"}
                                                aria-label={checkMap[problem.id] === true ? `Марк ${problem.title} как нераскрытый` : `${problem.title} нераскрытый`}
                                                onclick={(e) => handleSolvedCheckboxClick(e, problem.id)}
                                            />
                                        </td>
                                        <td>
                                            <a href="/problems/{problem.id}">
                                                {displayTitle(problem)}
                                            </a>
                                            {#if problem.link}
                                                <Tooltip text="Источник задачи" pos="top">
                                                    <a
                                                        href={problem.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="external-link"
                                                        aria-label={`Открыть ${problem.title} в LeetCode`}>↗</a
                                                    >
                                                </Tooltip>
                                            {/if}
                                            <Tooltip text={$bookmarkStore?.[problem.id] ? "Убрать из закладок" : "В закладки"} pos="top">
                                                <button
                                                    type="button"
                                                    class="bookmark-btn"
                                                    class:bookmarked={$bookmarkStore?.[problem.id]}
                                                    aria-pressed={$bookmarkStore?.[problem.id] ? 'true' : 'false'}
                                                    aria-label={$bookmarkStore?.[problem.id] ? `Удалить ${problem.title} из закладок` : `В закладки ${problem.title}`}
                                                    onclick={() => toggleBookmark(problem.id)}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill={$bookmarkStore?.[problem.id] ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                    </svg>
                                                </button>
                                            </Tooltip>
                                            {#if problem.source && problem.source !== 'bundled'}
                                                <span
                                                    class="source-badge {problem.source}"
                                                    title={sourceTitle(problem.source)}
                                                >{sourceLabel(problem.source)}</span>
                                            {/if}
                                            {#if bestRanks[problem.id]}
                                                <button
                                                    class="game-rank-badge"
                                                    class:rank-s={bestRanks[problem.id] === 'S'}
                                                    class:rank-a={bestRanks[problem.id] === 'A'}
                                                    class:rank-b={bestRanks[problem.id] === 'B'}
                                                    class:rank-c={bestRanks[problem.id] === 'C'}
                                                    onclick={(e) => { e.stopPropagation(); historyProblem = { id: problem.id, title: problem.title }; }}
                                                    title="Просмотр истории игр"
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
                                                {ru(problem.difficulty)}
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
    .dropdown-cloud-dirty {
        color: var(--color-medium);
        font-size: 0.9rem;
        font-weight: 800;
        line-height: 1;
    }
    .dropdown-cloud-loading {
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 50%;
        border: 1.5px solid var(--color-text-secondary);
        border-top-color: var(--color-highlight, var(--color-text));
        animation: dropdown-cloud-spin 0.7s linear infinite;
        flex-shrink: 0;
    }
    @keyframes dropdown-cloud-spin {
        to {
            transform: rotate(360deg);
        }
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
        width: min(240px, calc(100vw - 1.5rem));
        min-width: 220px;
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
        min-width: 0;
        white-space: nowrap;
    }
    .firebase-menu-status {
        flex: 0 0 auto;
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
    .firebase-menu-status.pending {
        background: color-mix(in srgb, var(--color-medium) 18%, transparent);
        color: var(--color-medium);
    }
    .firebase-menu-status.syncing {
        background: color-mix(in srgb, var(--color-highlight, var(--color-text)) 14%, transparent);
        color: var(--color-text);
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
        margin-top: 0.35rem;
        color: var(--color-highlight);
        font-size: 0.7rem;
        font-weight: 750;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .manage-problems-card {
        width: min(520px, 100%);
    }
    .manage-problems-card h2 {
        margin: 0.15rem 0 0.5rem;
    }
    .manage-intro {
        margin: 0 0 0.85rem !important;
        font-size: 0.92rem;
        line-height: 1.5;
    }
    .manage-path-row {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        margin: 0 0 1rem;
        padding: 0.45rem 0.45rem 0.45rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.55rem;
        background: var(--color-surface);
    }
    .manage-path-text {
        flex: 1 1 auto;
        min-width: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.8rem;
        line-height: 1.4;
        color: var(--color-text);
        word-break: break-all;
    }
    .manage-path-copy {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 0.4rem;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    }
    .manage-path-copy:hover {
        background: var(--color-surface-hover, rgba(0, 0, 0, 0.05));
        color: var(--color-text);
        border-color: var(--color-border);
    }
    .manage-path-copy:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 1px;
    }
    .manage-sections {
        display: grid;
        gap: 0.55rem;
        margin: 0 0 0.9rem;
    }
    .manage-section {
        padding: 0.65rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.55rem;
        background: var(--color-surface);
    }
    .manage-section h3 {
        margin: 0 0 0.3rem;
        font-size: 0.72rem;
        font-weight: 750;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
    }
    .manage-section-path {
        display: block;
        margin: 0 0 0.25rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.82rem;
        color: var(--color-text);
        word-break: break-all;
    }
    .manage-section p {
        margin: 0 !important;
        font-size: 0.82rem;
        line-height: 1.45;
        color: var(--color-text-secondary);
    }
    .manage-section .btn {
        margin-top: 0.55rem;
    }
    .manage-modified p {
        margin-bottom: 0.55rem !important;
    }
    .manage-modified-list {
        list-style: none;
        display: grid;
        gap: 0.35rem;
        max-height: 12rem;
        overflow-y: auto;
        margin: 0 0 0.1rem;
        padding: 0;
    }
    .manage-modified-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
    }
    .manage-modified-id {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.82rem;
        color: var(--color-text);
    }
    .manage-modified-kind {
        flex: 0 0 auto;
        font-size: 0.72rem;
        color: var(--color-text-secondary);
    }
    .manage-modified-list .manage-reset-btn {
        flex: 0 0 auto;
        margin-top: 0;
        padding: 0.3rem 0.7rem;
        font-size: 0.8rem;
    }
    .manage-note {
        margin: 0 0 0.65rem !important;
        font-size: 0.85rem;
        line-height: 1.5;
    }
    .manage-note code,
    .manage-intro code,
    .manage-cli code {
        font-size: 0.9em;
        padding: 0.05em 0.3em;
        border-radius: 0.25rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
    }
    .manage-cli {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        margin: 0 !important;
        font-size: 0.82rem;
        color: var(--color-text-secondary);
    }
    .manage-cli span {
        font-weight: 700;
        color: var(--color-text);
        margin-right: 0.15rem;
    }
    .cli-usage {
        margin: 0.15rem 0 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.4rem;
        font-size: 0.82rem;
        line-height: 1.45;
        color: var(--color-text-secondary);
    }
    .cli-usage code {
        display: inline-block;
        margin-right: 0.35rem;
        font-size: 0.78rem;
        padding: 0.05em 0.3em;
        border-radius: 0.25rem;
        background: var(--color-second-bg);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        word-break: break-all;
    }
    .cli-status-note {
        margin: 0 0 0.35rem !important;
        color: var(--color-text) !important;
        font-size: 0.85rem;
    }
    .manage-problems-card .home-modal-actions {
        margin-top: 1.15rem;
    }
    .firebase-settings-card {
        width: min(720px, 100%);
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
    .cloud-file-reload {
        padding: 0.25rem 0.6rem;
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
    .cloud-file-change-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .cloud-file-change-name {
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
    .exam-banner {
        background: var(--color-hard);
        color: #fff;
        text-align: center;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
    }
    .exam-tamper {
        background: #b45309;
        color: #fff;
        text-align: center;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
    }
    .exam-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0.75rem 0 0.25rem;
    }
    .exam-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.5rem 0.75rem;
        font-size: 0.95rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-bg);
        color: var(--color-text);
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
    .clear-progress-danger-btn {
        border-color: var(--color-hard);
        background: var(--color-hard);
        color: #fff;
        font-weight: 650;
    }
    .clear-progress-danger-btn:hover {
        filter: brightness(1.1);
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }
    .import-toast .reveal-btn {
        background: none;
        border: none;
        color: var(--color-highlight);
        font-weight: 500;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        border-radius: 4px;
        white-space: nowrap;
        text-decoration: underline;
    }
    .import-toast .reveal-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        text-decoration: none;
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
        font: inherit;
        cursor: pointer;
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
    .tab.pending {
        cursor: wait;
        opacity: 0.75;
    }
    /* Spinner for pending course-tab navigations (__data.json can take
       seconds on slow connections) and the status line below the tabs. */
    .tab-spinner {
        width: 0.8rem;
        height: 0.8rem;
        flex: 0 0 auto;
        border-radius: 50%;
        border: 2px solid color-mix(in srgb, currentColor 30%, transparent);
        border-top-color: currentColor;
        animation: tab-spin 0.7s linear infinite;
    }
    @keyframes tab-spin {
        to {
            transform: rotate(360deg);
        }
    }
    /* Dim stale course content while the next course loads (not blocked). */
    .stale {
        opacity: 0.55;
        transition: opacity 0.15s ease;
    }

    /* Labels for user content from ~/cojudge (custom = user-created, modified = user-edited) */
    .source-badge {
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.45rem;
        padding: 0.08rem 0.45rem;
        border-radius: 999px;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        line-height: 1.5;
        white-space: nowrap;
    }
    .tab .source-badge {
        margin-left: 0;
    }
    .source-badge.custom {
        background: rgba(99, 102, 241, 0.14);
        color: #6366f1;
        border: 1px solid rgba(99, 102, 241, 0.45);
    }
    .source-badge.modified {
        background: rgba(245, 158, 11, 0.14);
        color: #b45309;
        border: 1px solid rgba(245, 158, 11, 0.5);
    }
    .source-legend {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin: 0.5rem 0 0;
        font-size: 0.78rem;
        color: var(--color-text-secondary);
    }
    .source-legend .source-badge {
        margin-left: 0;
    }
    .source-legend-sep {
        opacity: 0.6;
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

    .status-cell input[type="checkbox"] {
        cursor: pointer;
    }

    .status-cell input[type="checkbox"]:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .external-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        width: 22px;
        height: 22px;
        margin-left: 4px;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        opacity: 0.55;
        text-decoration: none;
        font-size: 0.8em;
        transition: opacity 0.12s ease, background-color 0.12s ease, color 0.12s ease;
    }
    .external-link:hover {
        opacity: 1;
        background: var(--color-surface-hover);
        color: var(--color-text);
    }
    .external-link:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 1px;
        opacity: 1;
    }

    .bookmark-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        width: 22px;
        height: 22px;
        margin-left: 4px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 6px;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        opacity: 0.55;
        transition: opacity 0.12s ease, background-color 0.12s ease, color 0.12s ease;
    }
    .bookmark-btn:hover {
        opacity: 1;
        background: var(--color-surface-hover);
        color: var(--color-text);
    }
    .bookmark-btn.bookmarked {
        opacity: 1;
        color: var(--color-highlight);
    }
    .bookmark-btn:focus-visible {
        outline: 2px solid var(--color-highlight);
        outline-offset: 1px;
        opacity: 1;
    }
    .problem-table td :global(.tooltip-container) {
        vertical-align: middle;
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
        min-width: 22px;
        flex-shrink: 0;
        aspect-ratio: 1;
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
        box-sizing: border-box;
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
