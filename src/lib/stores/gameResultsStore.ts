import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ProgrammingLanguage } from '$lib/utils/util';

export type GameResult = {
    runCount: number;
    submitCount: number;
    timeSpent: number;
    runScore: number;
    submitScore: number;
    timeScore: number;
    totalScore: number;
    rank: string;
    code: string;
    language: ProgrammingLanguage;
    timestamp: number;
};

export type GameResults = Record<string, GameResult[]>;

const STORAGE_KEY = 'game-results';

function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}

export function computeGameResult(
    runCount: number,
    submitCount: number,
    timeSpent: number,
    code: string,
    language: ProgrammingLanguage,
): GameResult {
    const runScore = clamp(100 - runCount * 10, 0, 100);
    const submitScore = clamp(100 - (submitCount - 1) * 30, 0, 100);
    const timeScore = clamp(100 - (timeSpent / 60) * 5, 0, 100);
    const totalScore = Math.round(runScore * 0.2 + submitScore * 0.5 + timeScore * 0.3);
    const rank = totalScore >= 85 ? 'S' : totalScore >= 65 ? 'A' : totalScore >= 45 ? 'B' : 'C';
    return {
        runCount, submitCount, timeSpent,
        runScore, submitScore, timeScore,
        totalScore, rank, code, language, timestamp: Date.now(),
    };
}

const initial: GameResults = browser
    ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    : {};

const gameResultsStore = writable<GameResults>(initial);

if (browser) {
    gameResultsStore.subscribe((value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
}

export default gameResultsStore;
