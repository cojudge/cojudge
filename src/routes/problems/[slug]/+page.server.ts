import fs from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';
import { ensureUserContentSeeded, getProblemSource, resolveProblemDir } from '$lib/server/contentPaths';
import { isExamModeEnabled } from '$lib/server/examMode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        await ensureUserContentSeeded();
        // Reads from ~/cojudge/problems/<slug> first, bundled copy as fallback.
        const baseDir = await resolveProblemDir(params.slug);
        const problemPath = path.join(baseDir, 'metadata.json');
        const content = await fs.readFile(problemPath, 'utf-8');
        const problem = JSON.parse(content);

        // Load statement.md if present and attach as problem.statement
        const statementPath = path.join(baseDir, 'statement.md');
        try {
            const statementMd = await fs.readFile(statementPath, 'utf-8');
            // Preserve compatibility with the Svelte page expecting problem.statement
            problem.statement = statementMd;
        } catch {
            // If missing, default to empty string
            problem.statement = '';
        }

        // Keep the source statement available when reviewing a machine translation.
        try {
            problem.originalStatement = await fs.readFile(path.join(baseDir, 'statement.en.md'), 'utf-8');
        } catch {
            problem.originalStatement = null;
        }

        // Load solution.md if present and attach as problem.solution
        const solutionPath = path.join(baseDir, 'solution.md');
        try {
            const solutionMd = await fs.readFile(solutionPath, 'utf-8');
            problem.solution = solutionMd;
        } catch {
            problem.solution = null;
        }

        // Normalize hints to an array of strings to ensure UI always works consistently
        if (Array.isArray(problem.hints)) {
            problem.hints = problem.hints.map((h: unknown) => String(h));
        } else if (typeof problem.hints === 'string' && problem.hints.trim().length > 0) {
            problem.hints = [problem.hints.trim()];
        } else {
            problem.hints = [];
        }

        // Exam mode (discussion #185): strip hints and reference solutions
        // server-side so they never reach `__data.json`. A client-side hide
        // alone would still leak via view-source / network.
        if (isExamModeEnabled()) {
            problem.hints = [];
            problem.solution = null;
        }

        problem.examples = Array.isArray(problem.examples)
            ? problem.examples
                .filter((example: unknown) => example !== null && typeof example === 'object')
                .map((example: Record<string, unknown>) => ({
                    input: String(example.input ?? ''),
                    output: String(example.output ?? ''),
                    explanation: typeof example.explanation === 'string'
                        ? example.explanation.trim()
                        : ''
                }))
            : [];

        // Label user content so the UI can badge custom/modified problems.
        // In exam mode the stripped content would all read "modified" —
        // mask it so no badges show.
        try {
            problem.source = isExamModeEnabled() ? 'bundled' : await getProblemSource(params.slug);
        } catch {
            problem.source = 'bundled';
        }

        return { problem };
    } catch (e) {
        throw error(404, 'Problem not found');
    }
};
