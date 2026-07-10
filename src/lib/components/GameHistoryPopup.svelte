<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import type { GameResult } from '$lib/stores/gameResultsStore';

    export let problemTitle: string;
    export let results: GameResult[];

    let expandedIndex: number | null = null;

    $: sorted = [...results].sort((a, b) => b.timestamp - a.timestamp);

    function toggleCode(i: number) {
        expandedIndex = expandedIndex === i ? null : i;
    }

    function formatDate(ts: number) {
        const d = new Date(ts);
        return d.toLocaleString();
    }

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function close() {
        dispatch('close');
    }

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) close();
    }
</script>

<div
    class="modal-backdrop"
    on:click={handleBackdropClick}
    on:keydown={(e) => { if (e.key === 'Escape') close(); }}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
>
    <div class="modal" transition:scale={{ start: 0.95, duration: 200 }}>
        <button class="close-btn" on:click={close} aria-label="Close">&times;</button>
        <h2>Game History: {problemTitle}</h2>

        {#if sorted.length === 0}
            <p class="empty">No game results yet.</p>
        {:else}
            <div class="results-list">
                {#each sorted as result, i}
                    <div class="result-card">
                        <button
                            class="result-header"
                            on:click={() => toggleCode(i)}
                            aria-expanded={expandedIndex === i}
                        >
                            <div class="result-left">
                                <span
                                    class="rank-badge"
                                    class:rank-s={result.rank === 'S'}
                                    class:rank-a={result.rank === 'A'}
                                    class:rank-b={result.rank === 'B'}
                                    class:rank-c={result.rank === 'C'}
                                >
                                    {result.rank}
                                </span>
                                <span class="result-score">{result.totalScore} pts</span>
                            </div>
                            <div class="result-right">
                                <span class="result-date">{formatDate(result.timestamp)}</span>
                                <span class="chevron">{expandedIndex === i ? '▾' : '▸'}</span>
                            </div>
                        </button>
                        {#if expandedIndex === i}
                            <div class="result-detail">
                                <table class="detail-stats">
                                    <tbody>
                                        <tr>
                                            <td>Run Code</td>
                                            <td>{result.runCount} time{result.runCount !== 1 ? 's' : ''}</td>
                                            <td>({result.runScore} pts)</td>
                                        </tr>
                                        <tr>
                                            <td>Submit Code</td>
                                            <td>{result.submitCount} time{result.submitCount !== 1 ? 's' : ''}</td>
                                            <td>({result.submitScore} pts)</td>
                                        </tr>
                                        <tr>
                                            <td>Time Spent</td>
                                            <td>{formatTime(result.timeSpent)}</td>
                                            <td>({result.timeScore.toFixed(1)} pts)</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="code-section">
                                    <div class="code-header">
                                        <span class="code-lang">{result.language.toUpperCase()}</span>
                                        <button
                                            class="copy-btn"
                                            on:click={() => {
                                                navigator.clipboard.writeText(result.code);
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <pre class="code-block"><code>{result.code}</code></pre>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: grid;
        place-items: center;
        z-index: 1000;
    }
    .modal {
        background: var(--color-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md, 12px);
        padding: 2rem;
        max-width: 560px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .close-btn {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text-secondary);
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: 6px;
    }
    .close-btn:hover {
        background: var(--color-surface-hover);
    }
    h2 {
        margin: 0 0 1rem;
        font-size: 1.15rem;
        color: var(--color-text);
        padding-right: 2rem;
    }
    .empty {
        color: var(--color-text-secondary);
        text-align: center;
        padding: 2rem 0;
    }
    .results-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .result-card {
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm, 8px);
        overflow: hidden;
    }
    .result-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.75rem 1rem;
        background: var(--color-surface);
        border: none;
        cursor: pointer;
        color: var(--color-text);
        font-size: 0.9rem;
        text-align: left;
        transition: background 0.12s;
    }
    .result-header:hover {
        background: var(--color-surface-hover);
    }
    .result-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .result-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .rank-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: 0.85rem;
        font-weight: 800;
        color: #fff;
        flex-shrink: 0;
    }
    .rank-badge.rank-s {
        background: linear-gradient(135deg, #ffd700, #f59e0b);
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    }
    .rank-badge.rank-a {
        background: linear-gradient(135deg, #34d399, #059669);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }
    .rank-badge.rank-b {
        background: linear-gradient(135deg, #60a5fa, #2563eb);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    }
    .rank-badge.rank-c {
        background: linear-gradient(135deg, #9ca3af, #4b5563);
        box-shadow: 0 2px 8px rgba(107, 114, 128, 0.4);
    }
    .result-score {
        font-weight: 700;
        font-size: 0.9rem;
    }
    .result-date {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
    }
    .chevron {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
    }
    .result-detail {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
    }
    .detail-stats {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
    }
    .detail-stats td {
        padding: 0.25rem 0.5rem;
    }
    .detail-stats td:first-child {
        font-weight: 600;
        color: var(--color-text);
        width: 30%;
    }
    .detail-stats td:nth-child(2) {
        font-variant-numeric: tabular-nums;
        color: var(--color-text);
        width: 30%;
    }
    .detail-stats td:last-child {
        color: var(--color-text-secondary);
        text-align: right;
    }
    .code-section {
        margin-top: 0.5rem;
    }
    .code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.35rem;
    }
    .code-lang {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .copy-btn {
        font-size: 0.75rem;
        padding: 2px 8px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
    }
    .copy-btn:hover {
        background: var(--color-surface-hover);
        color: var(--color-text);
    }
    .code-block {
        background: var(--color-second-bg, #1e1e2e);
        color: var(--color-text);
        padding: 0.75rem;
        border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
        font-size: 0.8rem;
        overflow-x: auto;
        max-height: 300px;
        overflow-y: auto;
        white-space: pre;
        margin: 0;
    }
</style>
