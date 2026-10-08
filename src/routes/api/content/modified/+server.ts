import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
    discoverCourses,
    loadMergedProblemSummaries,
    type ProblemSummary
} from '$lib/server/courseCatalog';
import {
    ensureUserContentSeeded,
    getBundledCoursesDir,
    getBundledProblemsDir,
    getCourseSources,
    getCoursesDir,
    getProblemsDir,
    getProblemSources
} from '$lib/server/contentPaths';
import { existsSync } from 'node:fs';

/**
 * Full custom/modified inventory for the Manage Problems dialog. Computing
 * this requires comparing every problem against its bundled copy, so it is
 * served lazily here instead of on every home-page navigation.
 */
export const GET: RequestHandler = async () => {
    try {
        await ensureUserContentSeeded();
        const coursesDir = existsSync(getCoursesDir()) ? getCoursesDir() : getBundledCoursesDir();
        const [userCourses, bundledCourses, allProblems] = await Promise.all([
            discoverCourses(coursesDir),
            coursesDir === getBundledCoursesDir()
                ? Promise.resolve([])
                : discoverCourses(getBundledCoursesDir()),
            loadMergedProblemSummaries(getProblemsDir(), getBundledProblemsDir())
        ]);
        const courses = [...userCourses];
        for (const c of bundledCourses) {
            if (!courses.some((existing) => existing.id === c.id)) courses.push(c);
        }
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
