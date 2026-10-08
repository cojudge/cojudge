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
    statement?: string;
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

async function readProblemSummary(
    problemsDir: string,
    slug: string,
    includeStatement: boolean
): Promise<ProblemSummary | null> {
    try {
        const content = await fs.readFile(path.join(problemsDir, slug, 'metadata.json'), 'utf-8');
        const metadata: unknown = JSON.parse(content);
        if (!isRecord(metadata) || typeof metadata.id !== 'string' || typeof metadata.title !== 'string' || typeof metadata.difficulty !== 'string') {
            return null;
        }
        let statement: string | undefined = undefined;
        if (includeStatement) {
            try {
                statement = await fs.readFile(path.join(problemsDir, slug, 'statement.md'), 'utf-8');
            } catch {
                // ignore
            }
        }
        return {
            id: metadata.id,
            title: metadata.title,
            difficulty: metadata.difficulty,
            link: typeof metadata.link === 'string' ? metadata.link : undefined,
            category: typeof metadata.category === 'string' ? metadata.category : undefined,
            statement
        };
    } catch {
        return null;
    }
}

export async function loadProblemSummaries(
    problemsDir: string,
    opts: { includeStatement?: boolean } = {}
): Promise<ProblemSummary[]> {
    const includeStatement = opts.includeStatement ?? true;
    let entries;
    try {
        entries = await fs.readdir(problemsDir, { withFileTypes: true });
    } catch {
        return [];
    }

    const loaded = await Promise.all(
        entries
            .filter((entry) => entry.isDirectory())
            .map((entry): Promise<ProblemSummary | null> => readProblemSummary(problemsDir, entry.name, includeStatement))
    );

    return loaded.filter((problem): problem is ProblemSummary => problem !== null);
}

/**
 * Load every problem once, preferring the user copy and falling back to the
 * bundled copy. The home page hits this on every course-tab navigation, so a
 * single pass (instead of loading both dirs and merging) plus skipping
 * `statement.md` keeps `__data.json` small and fast.
 */
export async function loadMergedProblemSummaries(
    userProblemsDir: string,
    bundledProblemsDir: string,
    opts: { includeStatement?: boolean } = {}
): Promise<ProblemSummary[]> {
    const includeStatement = opts.includeStatement ?? false;
    if (userProblemsDir === bundledProblemsDir) {
        return loadProblemSummaries(userProblemsDir, { includeStatement });
    }

    const [userEntries, bundledEntries] = await Promise.all([
        fs.readdir(userProblemsDir, { withFileTypes: true }).catch(() => []),
        fs.readdir(bundledProblemsDir, { withFileTypes: true }).catch(() => [])
    ]);
    const userSlugs = new Set(
        userEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    );
    const slugs = new Set<string>();
    for (const entry of [...userEntries, ...bundledEntries]) {
        if (entry.isDirectory()) slugs.add(entry.name);
    }

    const loaded = await Promise.all(
        [...slugs].map((slug): Promise<ProblemSummary | null> => {
            const dir = userSlugs.has(slug) ? userProblemsDir : bundledProblemsDir;
            return readProblemSummary(dir, slug, includeStatement);
        })
    );

    return loaded.filter((problem): problem is ProblemSummary => problem !== null);
}
