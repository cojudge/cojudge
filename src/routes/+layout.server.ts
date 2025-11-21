import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		isDemoSite: env.IS_DEMO_SITE === 'true'
	};
};
