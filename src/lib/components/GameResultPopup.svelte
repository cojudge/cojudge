<script lang="ts">
    import { fade, scale } from 'svelte/transition';

    export let runCount: number;
    export let submitCount: number;
    export let timeSpent: number; // in seconds

    function clamp(val: number, min: number, max: number) {
        return Math.max(min, Math.min(max, val));
    }

    $: runScore = clamp(100 - runCount * 10, 0, 100);
    $: submitScore = clamp(100 - (submitCount - 1) * 30, 0, 100);
    $: timeScore = clamp(100 - (timeSpent / 60) * 5, 0, 100);
    $: totalScore = Math.round(runScore * 0.2 + submitScore * 0.5 + timeScore * 0.3);

    $: rank = totalScore >= 85 ? 'S' : totalScore >= 65 ? 'A' : totalScore >= 45 ? 'B' : 'C';

    $: minutes = Math.floor(timeSpent / 60);
    $: seconds = timeSpent % 60;
    $: formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    function goHome() {
        window.location.href = '/';
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            goHome();
        }
    }
</script>

<div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={(e) => { if (e.key === 'Escape') goHome(); }} role="dialog" aria-modal="true" tabindex="-1" transition:fade={{ duration: 200 }}>
    <div class="modal" transition:scale={{ start: 0.95, duration: 200 }}>
        <button class="close-btn" on:click={goHome} aria-label="Close">&times;</button>
        <h2>Game Over</h2>

        <div class="rank-circle" class:rank-s={rank === 'S'} class:rank-a={rank === 'A'} class:rank-b={rank === 'B'} class:rank-c={rank === 'C'}>
            {rank}
        </div>

        <table class="stats">
            <tbody>
                <tr>
                    <td>Run Code</td>
                    <td class="val">{runCount} time{runCount !== 1 ? 's' : ''}</td>
                    <td class="score">({runScore} pts)</td>
                </tr>
                <tr>
                    <td>Submit Code</td>
                    <td class="val">{submitCount} time{submitCount !== 1 ? 's' : ''}</td>
                    <td class="score">({submitScore} pts)</td>
                </tr>
                <tr>
                    <td>Time Spent</td>
                    <td class="val">{formattedTime}</td>
                    <td class="score">({timeScore.toFixed(1)} pts)</td>
                </tr>
            </tbody>
        </table>

        <div class="total">
            Total Score: <strong>{totalScore}</strong> &rarr; Rank <strong class="rank-label" class:rank-s={rank === 'S'} class:rank-a={rank === 'A'} class:rank-b={rank === 'B'} class:rank-c={rank === 'C'}>{rank}</strong>
        </div>

        <button class="home-btn" on:click={goHome}>Back to Home</button>
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
        max-width: 420px;
        width: 90%;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
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
    .rank-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        margin: 0 auto 1.25rem;
        font-size: 2.5rem;
        font-weight: 800;
        color: #fff;
    }
    .rank-s {
        background: linear-gradient(135deg, #ffd700, #f59e0b);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .rank-a {
        background: linear-gradient(135deg, #34d399, #059669);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    .rank-b {
        background: linear-gradient(135deg, #60a5fa, #2563eb);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    .rank-c {
        background: linear-gradient(135deg, #9ca3af, #4b5563);
        box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    .stats {
        width: 100%;
        margin-bottom: 1rem;
        border-collapse: collapse;
        text-align: left;
        color: var(--color-text);
    }
    .stats td {
        padding: 0.4rem 0.25rem;
        font-size: 0.9rem;
    }
    .stats td:first-child {
        font-weight: 600;
        width: 40%;
        color: var(--color-text);
    }
    .stats .val {
        font-variant-numeric: tabular-nums;
        width: 30%;
        color: var(--color-text);
    }
    .stats .score {
        color: var(--color-text-secondary);
        font-size: 0.8rem;
        text-align: right;
        width: 30%;
    }
    .total {
        font-size: 1.1rem;
        margin-bottom: 1.25rem;
        color: var(--color-text);
    }
    .rank-label {
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px 10px;
        border-radius: 6px;
        color: #fff !important;
        margin-left: 6px;
        font-size: 1rem;
    }
    .home-btn {
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
    .home-btn:hover {
        transform: translateY(-2px);
    }
    .home-btn:active {
        transform: translateY(-1px);
    }
</style>
