// App update state and helpers, mirroring github.com/anslwy/openduck's
// Tauri signed-updater flow, extended for win/mac/linux.
//
// Desktop (Tauri) uses `@tauri-apps/plugin-updater` against:
//   https://github.com/cojudge/cojudge/releases/latest/download/latest.json
// Web/demo falls back to opening the repo page.

export const APP_UPDATE_REPO = 'cojudge/cojudge';
export const APP_UPDATE_REPO_URL = `https://github.com/${APP_UPDATE_REPO}`;
export const APP_UPDATE_LATEST_JSON_URL = `https://github.com/${APP_UPDATE_REPO}/releases/latest/download/latest.json`;
export const APP_UPDATE_RELEASES_URL = `https://github.com/${APP_UPDATE_REPO}/releases/latest`;
export const APP_UPDATE_GITHUB_API_URL = `https://api.github.com/repos/${APP_UPDATE_REPO}/releases/latest`;

export const APP_UPDATE_PREFERENCES_STORAGE_KEY = 'cojudge.app-update-preferences.v1';
export const DEFAULT_AUTO_CHECK_APP_UPDATES = true;

export type AppUpdateStatus =
	| 'idle'
	| 'checking'
	| 'available'
	| 'up_to_date'
	| 'installing'
	| 'installed'
	| 'error';

export type AppUpdateInfo = {
	version: string;
	currentVersion: string;
	notes?: string | null;
	publishedAt?: string | null;
	target: string;
	releaseNotesUrl?: string | null;
};

export type StoredAppUpdatePreference = {
	version: 1;
	skippedVersion: string | null;
	autoCheckEnabled?: boolean;
};

export function loadAppUpdatePreferenceFromStorage(): {
	skippedVersion: string | null;
	autoCheckEnabled: boolean;
} {
	if (typeof window === 'undefined') {
		return { skippedVersion: null, autoCheckEnabled: DEFAULT_AUTO_CHECK_APP_UPDATES };
	}
	try {
		const raw = window.localStorage.getItem(APP_UPDATE_PREFERENCES_STORAGE_KEY);
		if (!raw) return { skippedVersion: null, autoCheckEnabled: DEFAULT_AUTO_CHECK_APP_UPDATES };
		const parsed = JSON.parse(raw) as {
			version?: unknown;
			skippedVersion?: unknown;
			autoCheckEnabled?: unknown;
		};
		if (
			parsed.version !== 1 ||
			(parsed.skippedVersion !== null && typeof parsed.skippedVersion !== 'string') ||
			(parsed.autoCheckEnabled !== undefined && typeof parsed.autoCheckEnabled !== 'boolean')
		) {
			return { skippedVersion: null, autoCheckEnabled: DEFAULT_AUTO_CHECK_APP_UPDATES };
		}
		return {
			skippedVersion: parsed.skippedVersion ?? null,
			autoCheckEnabled: parsed.autoCheckEnabled ?? DEFAULT_AUTO_CHECK_APP_UPDATES
		};
	} catch {
		return { skippedVersion: null, autoCheckEnabled: DEFAULT_AUTO_CHECK_APP_UPDATES };
	}
}

export function persistAppUpdatePreference(options: {
	skippedVersion: string | null;
	autoCheckEnabled: boolean;
}): void {
	if (typeof window === 'undefined') return;
	const payload: StoredAppUpdatePreference = {
		version: 1,
		skippedVersion: options.skippedVersion,
		autoCheckEnabled: options.autoCheckEnabled
	};
	window.localStorage.setItem(APP_UPDATE_PREFERENCES_STORAGE_KEY, JSON.stringify(payload));
}

export function normalizeUpdateErrorMessage(error: unknown): string {
	let message = String(error ?? '').trim();
	for (let i = 0; i < 2; i++) {
		if (message.toLowerCase().startsWith('error: ')) message = message.slice(7).trim();
		if (message.startsWith('"') && message.endsWith('"') && message.length >= 2) {
			try {
				const parsed = JSON.parse(message);
				if (typeof parsed === 'string') {
					message = parsed.trim();
					continue;
				}
			} catch {
				// keep raw
			}
		}
		break;
	}
	if (message.toLowerCase().startsWith('error: ')) message = message.slice(7).trim();
	return message || 'Unknown error';
}

function currentPlatformHint(): 'mac' | 'windows' | 'linux' | 'other' {
	if (typeof navigator === 'undefined') return 'other';
	const platform = `${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`.toLowerCase();
	if (platform.includes('mac')) return 'mac';
	if (platform.includes('win')) return 'windows';
	if (platform.includes('linux')) return 'linux';
	return 'other';
}

export function formatAppUpdateInstallError(error: unknown): string {
	const message = normalizeUpdateErrorMessage(error);
	const normalized = message.toLowerCase();
	const platform = currentPlatformHint();

	if (normalized.includes('cross-device link') || normalized.includes('os error 18')) {
		if (platform === 'mac') {
			return [
				'Cojudge downloaded the update, but it could not replace the current app bundle.',
				`Technical details: ${message}`,
				'Likely cause: the app is running from a different volume than the updater target — e.g. launched directly from a mounted DMG or Downloads instead of /Applications.',
				'Try this:',
				'1. Quit Cojudge.',
				'2. Move Cojudge.app into /Applications.',
				'3. Launch it from /Applications.',
				'4. Retry the update.'
			].join('\n\n');
		}
		return [
			'Cojudge downloaded the update, but it could not replace the current installation.',
			`Technical details: ${message}`,
			'Try quitting Cojudge, moving it to its standard install location, then retry the update.',
			`You can also download the latest installer manually: ${APP_UPDATE_RELEASES_URL}`
		].join('\n\n');
	}

	if (normalized.includes('permission denied') || normalized.includes('authentication failed')) {
		if (platform === 'mac') {
			return [
				'Cojudge downloaded the update, but it was not allowed to replace the current app bundle.',
				`Technical details: ${message}`,
				'Try moving Cojudge.app into /Applications, then retry the update. Approve any macOS permission prompt.'
			].join('\n\n');
		}
		if (platform === 'windows') {
			return [
				'Cojudge downloaded the update, but Windows blocked the install.',
				`Technical details: ${message}`,
				'Try running Cojudge as administrator once to apply the update, or download the latest setup manually:',
				APP_UPDATE_RELEASES_URL
			].join('\n\n');
		}
		return [
			'Cojudge downloaded the update, but it was not allowed to replace the current installation.',
			`Technical details: ${message}`,
			'On Linux this usually means the install location is not writable (e.g. installed via .deb/.rpm to a system path).',
			`Try again with sufficient permissions, or download the latest package manually: ${APP_UPDATE_RELEASES_URL}`
		].join('\n\n');
	}

	return [
		'Cojudge failed while installing the downloaded update.',
		`Technical details: ${message}`,
		`You can always download the latest installer manually: ${APP_UPDATE_RELEASES_URL}`
	].join('\n\n');
}

export function createReleaseNotesPreview(
	notes: string | null | undefined,
	maxLength = 180
): string | null {
	if (!notes) return null;
	const plainText = notes
		.replace(/\r\n?/g, '\n')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
		.replace(/(\*\*|__)(.*?)\1/g, '$2')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^>\s?/gm, '')
		.replace(/^[\t ]*[-*+]\s+/gm, '')
		.replace(/^[\t ]*\d+\.\s+/gm, '')
		.replace(/^[\t ]*Full Changelog:\s*.*$/gim, '')
		.replace(/[^\S\n]+/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	if (!plainText) return null;
	if (plainText.length <= maxLength) return plainText;
	return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export type GithubLatestReleasePayload = {
	body?: unknown;
	html_url?: unknown;
	published_at?: unknown;
	tag_name?: unknown;
	name?: unknown;
};

export async function fetchGithubReleaseNotesMetadata(): Promise<{
	notesPreview: string | null;
	releaseNotesUrl: string;
}> {
	const response = await fetch(APP_UPDATE_GITHUB_API_URL, {
		headers: { Accept: 'application/vnd.github+json' }
	});
	if (!response.ok) {
		throw new Error(`GitHub release notes request failed with status ${response.status}.`);
	}
	const payload = (await response.json()) as GithubLatestReleasePayload;
	const notes = typeof payload.body === 'string' ? payload.body : undefined;
	const releaseNotesUrl =
		typeof payload.html_url === 'string' && payload.html_url.trim()
			? payload.html_url
			: APP_UPDATE_RELEASES_URL;
	return { notesPreview: createReleaseNotesPreview(notes), releaseNotesUrl };
}
