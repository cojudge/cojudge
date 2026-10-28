import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import {
	clearExamPassword,
	hasExamPassword,
	isEnvExamMode,
	isExamModeEnabled,
	isExamStripping,
	isExamTampered,
	removeExamLock,
	restoreExamContent,
	setExamPassword,
	stripExamContent,
	verifyExamPassword,
	writeExamLock,
} from '$lib/server/examMode';

const MIN_PASSWORD_LENGTH = 4;

export const GET: RequestHandler = async () => {
	return json({
		isExamMode: isExamModeEnabled(),
		hasPassword: hasExamPassword(),
		tampered: isExamTampered(),
		stripping: isExamStripping(),
	});
};

export const POST: RequestHandler = async ({ request }) => {
	// Never allow the shared demo site to enter exam mode.
	if (env.IS_DEMO_SITE === 'true') {
		return json({ error: 'Exam mode is not available on the demo site' }, { status: 403 });
	}
	const body = (await request.json().catch(() => null)) as {
		on?: unknown;
		password?: unknown;
	} | null;
	if (typeof body?.on !== 'boolean') {
		return json({ error: 'Expected { on: boolean, password?: string }' }, { status: 400 });
	}
	if (body.on) {
		if (typeof body.password !== 'string' || body.password.length < MIN_PASSWORD_LENGTH) {
			return json(
				{ error: `A password of at least ${MIN_PASSWORD_LENGTH} characters is required` },
				{ status: 400 }
			);
		}
		// The lock takes effect immediately (hints/solutions masked,
		// badges hidden, reset/reveal blocked). File stripping is slow
		// (1000+ problems), so it runs in the background.
		writeExamLock();
		setExamPassword(body.password);
		void stripExamContent().catch((e) => console.error('Exam strip failed:', e));
		return json({ success: true, isExamMode: true });
	}
	if (isEnvExamMode()) {
		return json(
			{ error: 'Exam mode is forced on by COJUDGE_EXAM_MODE — unset it to disable' },
			{ status: 403 }
		);
	}
	// Locks from before passwords existed carry no hash — allow those off.
	if (hasExamPassword() && !verifyExamPassword(typeof body.password === 'string' ? body.password : '')) {
		return json({ error: 'Incorrect exam password' }, { status: 401 });
	}
	// Proper disable: restore originals first (the lock still blocks resets
	// meanwhile), then unlock. Without a backup the content stays stripped
	// and the teacher restores via Reset in Manage Problems.
	let backupMissing = false;
	let merged = 0;
	try {
		const r = await restoreExamContent();
		backupMissing = r.missing;
		merged = r.merged;
	} catch (e) {
		console.error('Exam restore failed:', e);
	}
	removeExamLock();
	clearExamPassword();
	return json({ success: true, isExamMode: false, backupMissing, merged });
};
