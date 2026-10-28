import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import { isExamModeEnabled, isExamTampered } from '$lib/server/examMode';

export const load: LayoutServerLoad = async () => {
	return {
		isDemoSite: env.IS_DEMO_SITE === 'true',
		isExamMode: isExamModeEnabled(),
		examTampered: isExamTampered()
	};
};
