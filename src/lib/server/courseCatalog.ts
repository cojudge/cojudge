import fs from 'node:fs/promises';
import path from 'node:path';

export type CourseInfo = {
    title: string;
    description: string;
    'category-order': string[];
    'problems-of-category': Record<string, string[]>;
};

export type Course = {
    id: string;
    info: CourseInfo;
};

export type ProblemSummary = {
    id: string;
    title: string;
    difficulty: string;
    link?: string;
    category?: string;
};

const COURSE_ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function parseCourseInfo(value: unknown): CourseInfo | null {
    if (!isRecord(value) || typeof value.title !== 'string' || !value.title.trim()) return null;
    if (value.description !== undefined && typeof value.description !== 'string') return null;

    const categoryOrder = value['category-order'];
    if (categoryOrder !== undefined && (!Array.isArray(categoryOrder) || categoryOrder.some((category) => typeof category !== 'string'))) {
        return null;
    }

    const rawMapping = value['problems-of-category'];
    if (!isRecord(rawMapping)) return null;

    const mappingEntries: [string, string[]][] = [];
    for (const [category, problemIds] of Object.entries(rawMapping)) {
        if (!category.trim() || !Array.isArray(problemIds) || problemIds.some((id) => typeof id !== 'string' || !id.trim())) {
            return null;
        }
        mappingEntries.push([category, [...problemIds] as string[]]);
    }

    return {
        title: value.title,
        description: value.description ?? '',
        'category-order': categoryOrder ? [...categoryOrder] as string[] : [],
        'problems-of-category': Object.fromEntries(mappingEntries)
    };
}

export async function discoverCourses(coursesDir: string): Promise<Course[]> {
    let entries;
    try {
        entries = await fs.readdir(coursesDir, { withFileTypes: true });
    } catch {
        return [];
    }

    const loaded = await Promise.all(
        entries
            .filter((entry) => entry.isDirectory() && COURSE_ID_PATTERN.test(entry.name))
            .map(async (entry): Promise<Course | null> => {
                try {
                    const content = await fs.readFile(path.join(coursesDir, entry.name, 'courseinfo.json'), 'utf-8');
                    const info = parseCourseInfo(JSON.parse(content));
                    return info ? { id: entry.name, info } : null;
                } catch {
                    return null;
                }
            })
    );

    return loaded
        .filter((course): course is Course => course !== null)
        .toSorted((a, b) => a.id.localeCompare(b.id));
}

export function selectCourse(courses: Course[], requestedId: string | null | undefined): Course | null {
    const requested = requestedId ? courses.find((course) => course.id === requestedId) : undefined;
    return requested ?? courses.find((course) => course.id === 'blind75') ?? courses[0] ?? null;
}

export function orderProblemsForCourse(courseInfo: CourseInfo, problems: ProblemSummary[]): ProblemSummary[] {
    const mapping = courseInfo['problems-of-category'];
    const categories = [...courseInfo['category-order'], ...Object.keys(mapping)];
    const orderedCategories = [...new Set(categories)].filter((category) => category in mapping);
    const problemsById = new Map(problems.map((problem) => [problem.id, problem]));
    const seen = new Set<string>();
    const ordered: ProblemSummary[] = [];

    for (const category of orderedCategories) {
        for (const id of mapping[category]) {
            const problem = problemsById.get(id);
            if (!problem || seen.has(id)) continue;
            ordered.push({ ...problem, category });
            seen.add(id);
        }
    }

    return ordered;
}

export async function loadProblemSummaries(problemsDir: string): Promise<ProblemSummary[]> {
    let entries;
    try {
        entries = await fs.readdir(problemsDir, { withFileTypes: true });
    } catch {
        return [];
    }

    const loaded = await Promise.all(
        entries
            .filter((entry) => entry.isDirectory())
            .map(async (entry): Promise<ProblemSummary | null> => {
                try {
                    const content = await fs.readFile(path.join(problemsDir, entry.name, 'metadata.json'), 'utf-8');
                    const metadata: unknown = JSON.parse(content);
                    if (!isRecord(metadata) || typeof metadata.id !== 'string' || typeof metadata.title !== 'string' || typeof metadata.difficulty !== 'string') {
                        return null;
                    }
                    return {
                        id: metadata.id,
                        title: metadata.title,
                        difficulty: metadata.difficulty,
                        link: typeof metadata.link === 'string' ? metadata.link : undefined,
                        category: typeof metadata.category === 'string' ? metadata.category : undefined
                    };
                } catch {
                    return null;
                }
            })
    );

    return loaded.filter((problem): problem is ProblemSummary => problem !== null);
}
