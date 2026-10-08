import {
    discoverCourses,
    loadMergedProblemSummaries,
    orderProblemsForCourse,
    selectCourse
} from '$lib/server/courseCatalog';
import {
    ensureUserContentSeeded,
    getBundledCoursesDir,
    getBundledProblemsDir,
    getContentRoot,
    getCourseSources,
    getCoursesDir,
    getProblemsDir,
    getProblemSources
} from '$lib/server/contentPaths';
import { existsSync } from 'node:fs';
import type { PageServerLoad } from './$types';

async function resolveContentDir(userDir: string, bundledDir: string): Promise<string> {
    await ensureUserContentSeeded();
    return existsSync(userDir) ? userDir : bundledDir;
}

export const load: PageServerLoad = async ({ url }) => {
    const coursesDir = await resolveContentDir(getCoursesDir(), getBundledCoursesDir());
    // Merge user (~/cojudge) and bundled content so newly shipped problems
    // still appear even before the next seed pass copies them over.
    const [userCourses, bundledCourses] = await Promise.all([
        discoverCourses(coursesDir),
        coursesDir === getBundledCoursesDir() ? Promise.resolve([]) : discoverCourses(getBundledCoursesDir())
    ]);
    const courses = [...userCourses];
    for (const c of bundledCourses) {
        if (!courses.some((existing) => existing.id === c.id)) courses.push(c);
    }
    courses.sort((a, b) => a.id.localeCompare(b.id));
    const selectedCourse = selectCourse(courses, url.searchParams.get('course'));

    // Single pass over every problem (user copy wins, bundled fills gaps) and
    // without `statement.md`: statements were ~2/3 of the old `__data.json`
    // and are only needed for text search, which fetches them lazily per
    // course from /api/course-statements on the first search keystroke.
    // This load runs on every course-tab navigation, so it must stay lean.
    const allProblems = await loadMergedProblemSummaries(getProblemsDir(), getBundledProblemsDir());
    const problems = selectedCourse
        ? orderProblemsForCourse(selectedCourse.info, allProblems)
        : [];

    // Label user content: `custom` (only in ~/cojudge) or `modified`
    // (differs from the bundled copy) so the UI can badge overrides.
    // Sources are only resolved for the visible course. The full modified
    // inventory for Manage Problems is served lazily by
    // GET /api/content/modified instead of on every navigation.
    const selectedIds = [...new Set(problems.map((problem) => problem.id))];
    const [courseSources, problemSources] = await Promise.all([
        getCourseSources(courses.map((course) => course.id)),
        getProblemSources(selectedIds)
    ]);
    const problemsWithSource = problems.map((problem) => ({
        ...problem,
        source: problemSources[problem.id] ?? 'bundled'
    }));

    // Bookmark lookups need the full catalog (bookmarks can span courses), but
    // without statements to keep the payload small. Problems from the selected
    // course reuse their source so badges still render in the Bookmarks view.
    const allProblemsWithSource = allProblems
        .map((problem) => ({
            ...problem,
            source: problemSources[problem.id] as 'custom' | 'modified' | 'bundled' | undefined
        }))
        .toSorted((a, b) => (a.title || '').localeCompare(b.title || ''));

    return {
        courses: courses.map((course) => ({ id: course.id, title: course.info.title, source: courseSources[course.id] ?? 'bundled' })),
        selectedCourseId: selectedCourse?.id ?? null,
        selectedCourseInfo: selectedCourse?.info ?? null,
        problems: problemsWithSource,
        // Full catalog so the client can resolve bookmarked problems that
        // live in a different course than the one currently selected.
        allProblems: allProblemsWithSource,
        // Absolute path of the user-editable content folder (~/cojudge by
        // default), shown in the "Manage Problems" popup.
        contentDir: getContentRoot()
    };
};
