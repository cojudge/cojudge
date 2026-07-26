import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    discoverCourses,
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
});
