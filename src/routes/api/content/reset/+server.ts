import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	resetAllModifiedToBundled,
	resetCourseToBundled,
	resetProblemToBundled
} from '$lib/server/contentPaths';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json().catch(() => null)) as {
			type?: unknown;
			id?: unknown;
			all?: unknown;
		} | null;
		if (body?.all === true) {
			await resetAllModifiedToBundled();
			return json({ success: true });
		}
		if (
			(body?.type !== 'problem' && body?.type !== 'course') ||
			typeof body?.id !== 'string' ||
			!body.id.trim()
		) {
			return json(
				{ error: "Expected { type: 'problem' | 'course', id } or { all: true }" },
				{ status: 400 }
			);
		}
		const id = body.id.trim();
		if (body.type === 'problem') await resetProblemToBundled(id);
		else await resetCourseToBundled(id);
		return json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to reset content';
		const status = /No bundled/.test(message) ? 404 : 500;
		return json({ error: message }, { status });
	}
};
