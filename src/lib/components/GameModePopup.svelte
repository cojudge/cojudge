<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade, scale } from 'svelte/transition';

    export let problems: { id: string; title: string; difficulty: string; link?: string; category?: string }[] = [];
    export let solvedSet: Record<string, boolean> = {};
    export let currentProblemId: string | null = null;

    const dispatch = createEventDispatcher();

    let includeSolved = false;

    function startGame() {
        if (currentProblemId) {
            window.location.href = `/problems/${currentProblemId}?gameMode=1`;
            return;
        }
        let pool = problems;
        if (!includeSolved) {
            pool = problems.filter(p => !solvedSet[p.id]);
        }
        if (pool.length === 0) {
            alert('No problems available. Try enabling "Include solved problems".');
            return;
        }
        const randomIndex = Math.floor(Math.random() * pool.length);
        const chosen = pool[randomIndex];
        window.location.href = `/problems/${chosen.id}?gameMode=1`;
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            dispatch('close');
        }
    }
</script>

<div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={(e) => { if (e.key === 'Escape') dispatch('close'); }} role="dialog" aria-modal="true" tabindex="-1" transition:fade={{ duration: 200 }}>
    <div class="modal" transition:scale={{ start: 0.95, duration: 200 }}>
        <button class="close-btn" on:click={() => dispatch('close')} aria-label="Close">&times;</button>
        <h2>Game Mode</h2>
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
        {#if !currentProblemId}
            <label class="toggle-label">
                <input type="checkbox" bind:checked={includeSolved} />
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
