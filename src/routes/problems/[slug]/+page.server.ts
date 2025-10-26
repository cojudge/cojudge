import fs from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const baseDir = path.resolve('problems', params.slug);
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

        // Normalize hints to an array of strings to ensure UI always works consistently
        if (Array.isArray(problem.hints)) {
            problem.hints = problem.hints.map((h: unknown) => String(h));
        } else if (typeof problem.hints === 'string' && problem.hints.trim().length > 0) {
            problem.hints = [problem.hints.trim()];
        } else {
            problem.hints = [];
        }

        return { problem };
    } catch (e) {
        throw error(404, 'Problem not found');
    }
};