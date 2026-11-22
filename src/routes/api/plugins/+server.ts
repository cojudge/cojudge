import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	fetchCatalog,
	getPluginsDir,
	install,
	listInstalled,
	setEnabled,
	uninstall,
	upgrade,
	validId
} from '$lib/server/plugins';
import { isExamModeEnabled } from '$lib/server/examMode';

/**
 * Problem-pack plugins.
 *   GET  /api/plugins              installed plugins (+ catalog with ?catalog=1)
 *   POST /api/plugins {action, id?, source?}
 *        action: install | uninstall | enable | disable | upgrade
 * Same operations as `cojudge plugin ...` (shared code in bin/lib/plugins.js).
 */
export const GET: RequestHandler = async ({ url }) => {
	const installed = listInstalled().map(({ dir: _dir, ...p }) => p);
	if (url.searchParams.get('catalog') !== '1') {
		return json({ installed, pluginsDir: getPluginsDir() });
	}
	try {
		return json({ installed, pluginsDir: getPluginsDir(), catalog: await fetchCatalog() });
	} catch (error) {
		// Offline is normal for Cojudge: still return what is installed.
		const message = error instanceof Error ? error.message : 'Could not load the plugin catalog';
		return json({ installed, pluginsDir: getPluginsDir(), catalog: [], catalogError: message });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	if (isExamModeEnabled()) {
		return json({ error: 'Plugins cannot be changed in exam mode' }, { status: 403 });
	}
	let body: { action?: string; id?: string; source?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Expected a JSON body' }, { status: 400 });
	}
	const { action, id, source } = body;
	try {
		switch (action) {
			case 'install': {
				// The web UI installs only GitHub sources; local paths are CLI-only.
				if (typeof source !== 'string' || !/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+(@[A-Za-z0-9._/-]+)?$|^https:\/\/github\.com\//.test(source)) {
					return json({ error: 'Expected source as owner/repo or a https://github.com URL' }, { status: 400 });
				}
				const p = await install(source);
				return json({ plugin: p });
			}
			case 'upgrade':
			case 'uninstall':
			case 'enable':
			case 'disable': {
				if (typeof id !== 'string' || !validId(id)) {
					return json({ error: 'Expected a plugin id' }, { status: 400 });
				}
				if (action === 'uninstall') return json(uninstall(id));
				if (action === 'upgrade') return json({ plugin: await upgrade(id) });
				return json({ plugin: setEnabled(id, action === 'enable') });
			}
			default:
				return json({ error: `Unknown action '${action}'` }, { status: 400 });
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Plugin operation failed';
		return json({ error: message }, { status: 500 });
	}
};
