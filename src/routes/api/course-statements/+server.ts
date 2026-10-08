import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseCourseInfo } from '$lib/server/courseCatalog';
import {
    ensureUserContentSeeded,
    readProblemFile,
    resolveCourseFileSync
} from '$lib/server/contentPaths';
import fs from 'node:fs/promises';

const COURSE_ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;

/**
 * Statement-text index for one course, fetched lazily on the first search
 * keystroke. Keeps statement bodies out of the home-page `__data.json`
 * (they were ~2/3 of the nc250 payload) without losing statement search.
 */
export const GET: RequestHandler = async ({ url }) => {
    try {
        const courseId = (url.searchParams.get('course') ?? '').trim();
        if (!COURSE_ID_PATTERN.test(courseId)) {
            return json({ error: 'Expected ?course=<id>' }, { status: 400 });
        }
        await ensureUserContentSeeded();
        const infoPath = resolveCourseFileSync(courseId, 'courseinfo.json');
        let info;
        try {
            info = parseCourseInfo(JSON.parse(await fs.readFile(infoPath, 'utf-8')));
        } catch {
            info = null;
        }
        if (!info) return json({ error: `Unknown course '${courseId}'` }, { status: 404 });

        const ids = [...new Set(Object.values(info['problems-of-category']).flat())];
        const entries = await Promise.all(
            ids.map(async (id) => {
                try {
                    return [id, await readProblemFile(id, 'statement.md')] as const;
                } catch {
                    return [id, ''] as const;
                }
            })
        );
        return json({ statements: Object.fromEntries(entries) });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load statements';
        return json({ error: message }, { status: 500 });
    }
};
