import {
    loadAllCourses,
    loadAllProblemSummaries,
    orderProblemsForCourse,
    selectCourse
} from '$lib/server/courseCatalog';
import {
    ensureUserContentSeeded,
    getContentRoot,
    getCourseSources,
    getProblemSources
} from '$lib/server/contentPaths';
import type { PageServerLoad } from './$types';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getInstalled, pluginForCourse } from '$lib/server/plugins';

/** Packs that used to ship bundled with Cojudge and are now plugins. */
const MOVED_OUT_PACKS = [
    { id: 'basic-50', name: 'Basic 50' },
    { id: 'leetcode-1000', name: 'LeetCode 1000' }
];
import { isExamModeEnabled } from '$lib/server/examMode';

export const load: PageServerLoad = async ({ url }) => {
    // Existing installs (content folder seeded before) that used to get
    // these packs bundled are offered the plugins once (client dismisses).
    const isExistingInstall = existsSync(path.join(getContentRoot(), '.cojudge-seed.json'));
    const suggestedPlugins = isExistingInstall
        ? MOVED_OUT_PACKS.filter((p) => !getInstalled(p.id))
        : [];
    await ensureUserContentSeeded();
    // Courses from ~/cojudge, enabled plugins and the bundled copy.
    const courses = await loadAllCourses();
    // Core courses first, then plugin courses (e.g. the LeetCode 1000 archive).
    const pluginCourse = new Set(courses.filter((c) => pluginForCourse(c.id)).map((c) => c.id));
    courses.sort((a, b) =>
        Number(pluginCourse.has(a.id)) - Number(pluginCourse.has(b.id)) || a.id.localeCompare(b.id));
    const selectedCourse = selectCourse(courses, url.searchParams.get('course'));

    // Single pass over every problem (user copy wins, bundled fills gaps) and
    // without `statement.md`: statements were ~2/3 of the old `__data.json`
    // and are only needed for text search, which fetches them lazily per
    // course from /api/course-statements on the first search keystroke.
    // This load runs on every course-tab navigation, so it must stay lean.
    const allProblems = await loadAllProblemSummaries();
    const problems = selectedCourse
        ? orderProblemsForCourse(selectedCourse.info, allProblems)
        : [];

    // Label user content: `custom` (only in ~/cojudge) or `modified`
    // (differs from the bundled copy) so the UI can badge overrides.
    // Sources are only resolved for the visible course. The full modified
    // inventory for Manage Problems is served lazily by
    // GET /api/content/modified instead of on every navigation.
    // In exam mode every problem is stripped (hence "modified") — mask the
    // source as bundled so the UI doesn't plaster Modified badges everywhere.
    const examMode = isExamModeEnabled();
    const selectedIds = [...new Set(problems.map((problem) => problem.id))];
    const [courseSources, problemSources]: Array<Record<string, 'custom' | 'modified' | 'bundled'>> = examMode
        ? [{}, {}]
        : await Promise.all([
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
        contentDir: getContentRoot(),
        suggestedPlugins
    };
};
