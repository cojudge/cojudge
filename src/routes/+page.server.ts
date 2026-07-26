import path from 'node:path';
import {
    discoverCourses,
    loadProblemSummaries,
    orderProblemsForCourse,
    selectCourse
} from '$lib/server/courseCatalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const [courses, allProblems] = await Promise.all([
        discoverCourses(path.resolve('courses')),
        loadProblemSummaries(path.resolve('problems'))
    ]);
    const selectedCourse = selectCourse(courses, url.searchParams.get('course'));
    const problems = selectedCourse
        ? orderProblemsForCourse(selectedCourse.info, allProblems)
        : [];

    return {
        courses: courses.map((course) => ({ id: course.id, title: course.info.title })),
        selectedCourseId: selectedCourse?.id ?? null,
        selectedCourseInfo: selectedCourse?.info ?? null,
        problems
    };
};
