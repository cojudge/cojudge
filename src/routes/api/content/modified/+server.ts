import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
    loadAllCourses,
    loadAllProblemSummaries,
    type ProblemSummary
} from '$lib/server/courseCatalog';
import {
    ensureUserContentSeeded,
    getCourseSources,
    getProblemSources
} from '$lib/server/contentPaths';
import { isExamModeEnabled } from '$lib/server/examMode';

/**
 * Full custom/modified inventory for the Manage Problems dialog. Computing
 * this requires comparing every problem against its bundled copy, so it is
 * served lazily here instead of on every home-page navigation.
 * In exam mode everything is stripped (hence "modified") — report nothing
 * so the dialog doesn't list a thousand items.
 */
export const GET: RequestHandler = async () => {
    if (isExamModeEnabled()) {
        return json({ modifiedProblems: [], modifiedCourses: [] });
    }
    try {
        await ensureUserContentSeeded();
        const [courses, allProblems] = await Promise.all([loadAllCourses(), loadAllProblemSummaries()]);
        const [courseSources, problemSources] = await Promise.all([
            getCourseSources(courses.map((course) => course.id)),
            getProblemSources(allProblems.map((problem: ProblemSummary) => problem.id))
        ]);
        return json({
            modifiedProblems: allProblems
                .filter((problem) => (problemSources[problem.id] ?? 'bundled') === 'modified')
                .map((problem) => ({ id: problem.id, title: problem.title })),
            modifiedCourses: courses
                .filter((course) => (courseSources[course.id] ?? 'bundled') === 'modified')
                .map((course) => ({ id: course.id, title: course.info.title }))
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load modified content';
        return json({ error: message }, { status: 500 });
    }
};
