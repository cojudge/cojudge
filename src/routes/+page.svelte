<script lang="ts">
    export let data;
    import { getDifficultyClass } from "$lib/utils/util.js";
    import SortIcon from "$lib/components/SortIcon.svelte";
    import userStore from "$lib/stores/userStore";
    let checkMap: Record<string, boolean> = {};

    // Keep a local copy of the store for easy access in the template
    const unsubscribe = userStore.subscribe((value) => {
        checkMap = value || {};
    });

    // When this component is destroyed, unsubscribe
    import { onDestroy } from "svelte";
    import { marked } from "marked";
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
        return marked.parse(md ?? "");
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
</script>

<svelte:head>
    <title>Home | Offline Code Judge for LeetCode-style problems - Cojudge</title>
</svelte:head>

<div class="container">
    <!-- Simple tab-style header using the course title from JSON -->
    <nav class="tabs" aria-label="Course">
        <span class="tab active" aria-current="page">{courseTitle}</span>
    </nav>
    <div class="intro">
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
                on:click={() => toggleGroup(key)}
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
                                        on:click={() =>
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
                                        on:click={() =>
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
                                                on:change={(e) => {
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
        padding: calc(var(--spacing-4) + 2px) var(--spacing-4) var(--spacing-4);
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
    /* Accent bar */
    .intro::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 3px;
        background: linear-gradient(
            90deg,
            var(--color-primary, #3b82f6),
            #a78bfa,
            #f472b6
        );
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        pointer-events: none;
    }
    .intro a {
        color: inherit;
        text-decoration-color: color-mix(in oklab, currentColor 35%, transparent);
        text-underline-offset: 3px;
    }
    .intro a:hover {
        text-decoration-color: currentColor;
    }
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
