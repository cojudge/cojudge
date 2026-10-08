import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    discoverCourses,
    loadMergedProblemSummaries,
    loadProblemSummaries,
    orderProblemsForCourse,
    selectCourse,
    type Course,
    type CourseInfo,
    type ProblemSummary
} from './courseCatalog';

const blind75Info: CourseInfo = {
    title: 'Blind 75',
    description: '',
    'category-order': ['array'],
    'problems-of-category': { array: ['two-sum'] }
};

describe('course catalog', () => {
    it('discovers only valid, safely named course entries', async () => {
        const coursesDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-courses-'));
        try {
            await Promise.all([
                fs.mkdir(path.join(coursesDir, 'blind75')),
                fs.mkdir(path.join(coursesDir, 'bad.course')),
                fs.mkdir(path.join(coursesDir, 'invalid'))
            ]);
            await Promise.all([
                fs.writeFile(path.join(coursesDir, 'blind75', 'courseinfo.json'), JSON.stringify(blind75Info)),
                fs.writeFile(path.join(coursesDir, 'bad.course', 'courseinfo.json'), JSON.stringify(blind75Info)),
                fs.writeFile(path.join(coursesDir, 'invalid', 'courseinfo.json'), '{not json')
            ]);

            const courses = await discoverCourses(coursesDir);

            expect(courses.map(({ id, info }) => ({ id, title: info.title }))).toEqual([
                { id: 'blind75', title: 'Blind 75' }
            ]);
        } finally {
            await fs.rm(coursesDir, { recursive: true, force: true });
        }
    });

    it('selects an exact course and safely falls back to Blind 75', () => {
        const courses: Course[] = [
            { id: 'blind75', info: blind75Info },
            { id: 'nc150', info: { ...blind75Info, title: 'NeetCode 150' } }
        ];

        expect(selectCourse(courses, 'nc150')?.id).toBe('nc150');
        expect(selectCourse(courses, '../../problems')?.id).toBe('blind75');
        expect(selectCourse(courses, 'missing')?.id).toBe('blind75');
        expect(selectCourse(courses, null)?.id).toBe('blind75');
    });

    it('returns only listed problems in course category order', () => {
        const courseInfo: CourseInfo = {
            title: 'Course',
            description: '',
            'category-order': ['tree', 'array'],
            'problems-of-category': {
                array: ['array-problem', 'missing-problem'],
                tree: ['tree-problem'],
                extra: ['extra-problem']
            }
        };
        const problems: ProblemSummary[] = [
            { id: 'unlisted-problem', title: 'Unlisted', difficulty: 'Easy' },
            { id: 'array-problem', title: 'Array', difficulty: 'Easy', category: 'old-category' },
            { id: 'extra-problem', title: 'Extra', difficulty: 'Hard' },
            { id: 'tree-problem', title: 'Tree', difficulty: 'Medium' }
        ];

        expect(orderProblemsForCourse(courseInfo, problems).map(({ id, category }) => ({ id, category }))).toEqual([
            { id: 'tree-problem', category: 'tree' },
            { id: 'array-problem', category: 'array' },
            { id: 'extra-problem', category: 'extra' }
        ]);
    });

    async function makeProblemsDir(
        base: string,
        problems: Record<string, { metadata: Record<string, unknown>; statement?: string }>
    ): Promise<string> {
        const dir = path.join(base, `problems-${Math.random().toString(36).slice(2)}`);
        for (const [slug, { metadata, statement }] of Object.entries(problems)) {
            await fs.mkdir(path.join(dir, slug), { recursive: true });
            await fs.writeFile(path.join(dir, slug, 'metadata.json'), JSON.stringify(metadata));
            if (statement !== undefined) {
                await fs.writeFile(path.join(dir, slug, 'statement.md'), statement);
            }
        }
        return dir;
    }

    it('skips statement.md when includeStatement is false', async () => {
        const base = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-stmt-'));
        try {
            const dir = await makeProblemsDir(base, {
                'two-sum': {
                    metadata: { id: 'two-sum', title: '1. Two Sum', difficulty: 'Easy' },
                    statement: 'Given an array of integers...'
                }
            });

            const withStatement = await loadProblemSummaries(dir);
            expect(withStatement[0]?.statement).toBe('Given an array of integers...');

            const withoutStatement = await loadProblemSummaries(dir, { includeStatement: false });
            expect(withoutStatement[0]?.statement).toBeUndefined();
            expect(withoutStatement[0]?.title).toBe('1. Two Sum');
        } finally {
            await fs.rm(base, { recursive: true, force: true });
        }
    });

    it('merges user and bundled dirs in a single pass, preferring the user copy', async () => {
        const base = await fs.mkdtemp(path.join(os.tmpdir(), 'cojudge-merge-'));
        try {
            const userDir = await makeProblemsDir(base, {
                shared: {
                    metadata: { id: 'shared', title: 'User Title', difficulty: 'Easy' },
                    statement: 'user statement'
                },
                'user-only': {
                    metadata: { id: 'user-only', title: 'User Only', difficulty: 'Medium' }
                }
            });
            const bundledDir = await makeProblemsDir(base, {
                shared: {
                    metadata: { id: 'shared', title: 'Bundled Title', difficulty: 'Easy' },
                    statement: 'bundled statement'
                },
                'bundled-only': {
                    metadata: { id: 'bundled-only', title: 'Bundled Only', difficulty: 'Hard' }
                }
            });

            const merged = await loadMergedProblemSummaries(userDir, bundledDir);
            expect(merged.map((p) => p.id).toSorted()).toEqual(['bundled-only', 'shared', 'user-only']);
            // User copy wins.
            expect(merged.find((p) => p.id === 'shared')?.title).toBe('User Title');
            // Statements skipped by default for lean home-page payloads.
            expect(merged.find((p) => p.id === 'shared')?.statement).toBeUndefined();

            const mergedWithStatements = await loadMergedProblemSummaries(userDir, bundledDir, {
                includeStatement: true
            });
            expect(mergedWithStatements.find((p) => p.id === 'shared')?.statement).toBe(
                'user statement'
            );
        } finally {
            await fs.rm(base, { recursive: true, force: true });
        }
    });
});
