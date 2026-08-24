<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { showAlert } from '$lib/dialogs';
    import { fade, scale } from 'svelte/transition';

    export let problems: { id: string; title: string; difficulty: string; link?: string; category?: string }[] = [];
    export let solvedSet: Record<string, boolean> = {};
    export let currentProblemId: string | null = null;

    const dispatch = createEventDispatcher();

    const INCLUDE_SOLVED_STORAGE_KEY = 'cojudge-game-include-solved';
    let includeSolved = false;
    const COUNTDOWN_STORAGE_KEY = 'cojudge-game-countdown-settings';
    let countdownEnabled = false;
    let countdownMinutes = 15;

    if (typeof window !== 'undefined') {
        try {
            includeSolved = localStorage.getItem(INCLUDE_SOLVED_STORAGE_KEY) === 'true';
            const saved = JSON.parse(localStorage.getItem(COUNTDOWN_STORAGE_KEY) || 'null');
            if (saved && typeof saved === 'object') {
                countdownEnabled = saved.enabled === true;
                if (Number.isFinite(saved.minutes)) countdownMinutes = Math.max(1, Math.min(60, Math.round(saved.minutes)));
            }
        } catch { /* use defaults */ }
    }

    function persistIncludeSolved() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(INCLUDE_SOLVED_STORAGE_KEY, String(includeSolved));
        }
    }

    function persistCountdownSettings() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify({ enabled: countdownEnabled, minutes: countdownMinutes }));
        }
    }

    function gameUrl(problemId: string) {
        persistCountdownSettings();
        const params = new URLSearchParams({ gameMode: '1' });
        if (countdownEnabled) {
            params.set('countdown', '1');
            params.set('minutes', String(countdownMinutes));
        }
        return `/problems/${problemId}?${params.toString()}`;
    }

    async function startGame() {
        if (currentProblemId) {
            window.location.href = gameUrl(currentProblemId);
            return;
        }
        let pool = problems;
        if (!includeSolved) {
            pool = problems.filter(p => !solvedSet[p.id]);
        }
        if (pool.length === 0) {
            await showAlert('Try enabling "Include solved problems" to expand the available pool.', {
                title: 'No problems available'
            });
            return;
        }
        const randomIndex = Math.floor(Math.random() * pool.length);
        const chosen = pool[randomIndex];
        window.location.href = gameUrl(chosen.id);
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            dispatch('close');
        }
    }
</script>

<div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={(e) => { if (e.key === 'Escape') dispatch('close'); }} role="dialog" aria-modal="true" aria-labelledby="game-mode-title" tabindex="-1" transition:fade={{ duration: 200 }}>
    <div class="modal" transition:scale={{ start: 0.95, duration: 200 }}>
        <button class="close-btn" on:click={() => dispatch('close')} aria-label="Close">&times;</button>
        <h2 id="game-mode-title">Game Mode</h2>
        <div class="rules">
            <p>{currentProblemId ? 'Play this problem in game mode.' : 'A random problem will be selected for you to solve under time pressure.'}</p>
            <ul>
                <li>A timer starts as soon as the problem loads.</li>
                <li>Your previous solution (if any) will be hidden — you start fresh.</li>
                <li>Your rank is based on three factors:</li>
            </ul>
            <table class="scoring-table">
                <tbody>
                    <tr>
                        <td><strong>Run Code</strong></td>
                        <td>Fewer runs = better (moderate weight)</td>
                    </tr>
                    <tr>
                        <td><strong>Submit Code</strong></td>
                        <td>Fewer submits = better (highest penalty)</td>
                    </tr>
                    <tr>
                        <td><strong>Time Spent</strong></td>
                        <td>Shorter time = better</td>
                    </tr>
                </tbody>
            </table>
            <p class="rank-info">Final rank: <strong>S</strong> (best) → <strong>A</strong> → <strong>B</strong> → <strong>C</strong></p>
        </div>
        <label class="toggle-label">
            <input type="checkbox" bind:checked={countdownEnabled} on:change={persistCountdownSettings} />
            Enable Time Limit
        </label>
        {#if countdownEnabled}
            <div class="countdown-control">
                <button type="button" aria-label="Decrease countdown" on:click={() => { countdownMinutes = Math.max(1, countdownMinutes - 1); persistCountdownSettings(); }}>-</button>
                <strong>{countdownMinutes} mins</strong>
                <button type="button" aria-label="Increase countdown" on:click={() => { countdownMinutes = Math.min(60, countdownMinutes + 1); persistCountdownSettings(); }}>+</button>
            </div>
        {/if}
        {#if !currentProblemId}
            <label class="toggle-label">
                <input type="checkbox" bind:checked={includeSolved} on:change={persistIncludeSolved} />
                Include already solved problems
            </label>
        {/if}
        <button class="start-btn" on:click={startGame}>Start</button>
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
        max-width: 480px;
        width: 90%;
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
        font-size: 1.35rem;
        color: var(--color-text);
    }
    .rules {
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--color-text-secondary);
        margin-bottom: 1.25rem;
    }
    .rules p {
        margin: 0 0 0.5rem;
    }
    .rules ul {
        margin: 0 0 0.75rem;
        padding-left: 1.25rem;
    }
    .rules li {
        margin-bottom: 0.25rem;
    }
    .scoring-table {
        width: 100%;
        margin-bottom: 0.75rem;
        border-collapse: collapse;
        color: var(--color-text);
    }
    .scoring-table td {
        padding: 0.25rem 0.5rem;
    }
    .scoring-table td:first-child {
        width: 35%;
        font-weight: 600;
        color: var(--color-text);
    }
    .rank-info {
        font-size: 0.9rem;
        text-align: center;
        margin-top: 0.5rem;
        color: var(--color-text);
    }
    .countdown-control {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: -0.5rem 0 1.25rem 1.65rem;
        color: var(--color-text);
    }
    .countdown-control button {
        width: 30px;
        height: 30px;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        background: var(--color-surface);
        color: var(--color-text);
        font-size: 1.2rem;
        cursor: pointer;
    }
    .countdown-control strong {
        min-width: 65px;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }
    .toggle-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        margin-bottom: 1.25rem;
        cursor: pointer;
        color: var(--color-text);
    }
    .toggle-label input {
        width: 16px;
        height: 16px;
    }
    .start-btn {
        display: block;
        width: 100%;
        padding: 0.75rem;
        background: var(--color-primary);
        color: var(--color-primary-text);
        border: none;
        border-radius: var(--border-radius-sm, 8px);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
    .start-btn:hover {
        transform: translateY(-2px);
    }
    .start-btn:active {
        transform: translateY(-1px);
    }
</style>
