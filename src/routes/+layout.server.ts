import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		isDemoSite: env.IS_DEMO_SITE === 'true',
		// Per-launch token of the packaged desktop backend, used to build the
		// copyable MCP URL for agents. Absent in dev mode.
		desktopMcpToken: env.COJUDGE_DESKTOP_TOKEN ?? null
	};
};
