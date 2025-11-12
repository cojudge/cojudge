<script lang="ts">
    export let data;
    import { getDifficultyClass } from "$lib/utils/util.js";
    import SortIcon from "$lib/components/SortIcon.svelte";
    import userStore from "$lib/stores/userStore";
    import { browser } from '$app/environment';
    import codeStore from '$lib/stores/codeStore';
    import fileStore from '$lib/stores/fileStore';
    import userSettingsStorage from '$lib/stores/userSettingsStorage';
    let fileInputEl: HTMLInputElement | null = null;
    let checkMap: Record<string, boolean> = {};

    // Keep a local copy of the store for easy access in the template
    const unsubscribe = userStore.subscribe((value) => {
        checkMap = value || {};
    });

    // When this component is destroyed, unsubscribe
    import { onDestroy } from "svelte";
    import { marked } from "marked";
    import Tooltip from "$lib/components/Tooltip.svelte";
    onDestroy(() => unsubscribe());

    // Types for problems from the loader
    type Problem = {
        id: string;
        title: string;
        difficulty: string;
        link?: string;
        category?: string;
    };

    // Group problems by category
    let grouped: Record<string, Problem[]> = {};
    let groupStats: Record<string, { done: number; total: number }> = {};

    // Track which groups are open
    let openGroups = new Set<string>();

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

    // Course title, description and category order from server data
    const courseTitle: string =
        (data?.courseInfo as any)?.title ?? "Problem Set";
    const courseDescription: string =
        (data?.courseInfo as any)?.description ?? "";
    const categoryOrder: string[] =
        (data?.courseInfo as any)?.["category-order"] ?? [];
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
        const problems: Problem[] = (data?.problems ?? []) as Problem[];
        const map: Record<string, Problem[]> = {};
        for (const p of problems) {
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
        if (openGroups.has(key)) openGroups.delete(key);
        else openGroups.add(key);
        // reassign to trigger reactivity
        openGroups = new Set(openGroups);
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
        const problems: Problem[] = (data?.problems ?? []) as Problem[];
        totalProblems = problems.length;
        let done = 0;
        for (const p of problems) {
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

    function importLocalStorageObject(obj: Record<string, unknown>) {
        const KNOWN_KEYS = new Set(['solutions', 'user-checkboxes', 'files', 'user-settings']);
        if ('solutions' in obj && obj['solutions'] && typeof obj['solutions'] === 'object') {
            codeStore.set(obj['solutions'] as Record<string, string>);
        }
        if ('user-checkboxes' in obj) {
            userStore.set(sanitizeUserCheckboxes(obj['user-checkboxes']));
        }
        if ('files' in obj && obj['files'] && typeof obj['files'] === 'object') {
            fileStore.set(obj['files'] as Record<string, string>);
        }
        if ('user-settings' in obj && obj['user-settings'] && typeof obj['user-settings'] === 'object') {
            userSettingsStorage.set(obj['user-settings'] as any);
        }
        if (browser) {
            for (const [k, v] of Object.entries(obj)) {
                if (KNOWN_KEYS.has(k)) continue;
                try {
                    const toStore = typeof v === 'string' ? (v as string) : JSON.stringify(v);
                    localStorage.setItem(k, toStore);
                } catch {
                    /* ignore */
                }
            }
        }
    }

    async function onImportFileSelected(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const obj = JSON.parse(text);
            if (!obj || typeof obj !== 'object') throw new Error('Invalid JSON structure.');
            if (browser && !confirm('Importing will overwrite your current local data. Continue?')) return;
            importLocalStorageObject(obj as Record<string, unknown>);
            if (browser) alert('Import complete.');
        } catch (err: any) {
            if (browser) alert(`Failed to import: ${err?.message || String(err)}`);
        } finally {
            if (input) input.value = '';
        }
    }

    function triggerImport() {
        fileInputEl?.click();
    }
</script>

<svelte:head>
    <title>Home | Offline Code Judge for LeetCode-style problems - Cojudge</title>
</svelte:head>

<div class="container">
    <div class="backup-toolbar">
        <Tooltip text="Export all progress data (solved problems, settings, code, etc.) to a JSON file" pos={"bottom"}>
            <button class="btn" onclick={exportLocalStorage} disabled={!browser} title="Export all progress (settings, code, etc.) to a JSON file">Export progress</button>
        </Tooltip>
        <Tooltip text="Import progress data (solved problems, settings, code, etc.) from a JSON backup" pos={"bottom"}>
            <button class="btn" onclick={triggerImport} disabled={!browser} title="Import progress (settings, code, etc.) from a JSON backup">Import progress</button>
        </Tooltip>
        <input bind:this={fileInputEl} type="file" accept="application/json" class="hidden-file-input" onchange={onImportFileSelected} />
    </div>
    <!-- Simple tab-style header using the course title from JSON -->
    <nav class="tabs" aria-label="Course">
        <span class="tab active" aria-current="page">{courseTitle}</span>
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

    {#each Object.keys(grouped).toSorted((a, b) => {
        const ra = orderMap[a] ?? Number.POSITIVE_INFINITY;
        const rb = orderMap[b] ?? Number.POSITIVE_INFINITY;
        if (ra !== rb) return ra - rb;
        // fallback stable sort by pretty name
        return pretty(a).localeCompare(pretty(b));
    }) as key}
        <div class="group">
            <button
                class="group-header {openGroups.has(key) ? 'open' : ''}"
                onclick={() => toggleGroup(key)}
                aria-expanded={openGroups.has(key)}
            >
                <div class="group-left">
                    <span class="chevron"
                        >{openGroups.has(key) ? "▾" : "▸"}</span
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

            {#if openGroups.has(key)}
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
    .tabs {
        position: relative;
        display: flex;
        align-items: flex-end;
        gap: var(--spacing-1);
        border-bottom: 1px solid var(--color-border, #e5e7eb);
        margin-bottom: var(--spacing-4);
        padding-top: var(--spacing-2);
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
    .btn {
        appearance: none;
        border: 1px solid var(--color-text);
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
</style>
