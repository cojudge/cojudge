import type { ProgressData } from './progressBackup';

const PROGRAMMING_LANGUAGES = new Set([
	'java',
	'python',
	'cpp',
	'csharp',
	'rust',
	'go',
	'typescript',
	'plaintext',
	'markdown'
]);

export function requireProgressObject(data: ProgressData, key: string): Record<string, unknown> {
	const value = data[key];
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`${key} must contain an object.`);
	}
	return value as Record<string, unknown>;
}

export function requireStringRecord(data: ProgressData, key: string): Record<string, string> {
	const value = requireProgressObject(data, key);
	for (const [entryKey, entryValue] of Object.entries(value)) {
		if (typeof entryValue !== 'string') {
			throw new Error(`${key}.${entryKey} must contain a string.`);
		}
	}
	return value as Record<string, string>;
}

export function requireFileRecord(data: ProgressData): Record<string, string> {
	const files = requireStringRecord(data, 'files');
	for (const [slug, serialized] of Object.entries(files)) {
		try {
			const entries = JSON.parse(serialized);
			if (!Array.isArray(entries)) throw new Error();
			for (const entry of entries) {
				if (
					!entry ||
					typeof entry !== 'object' ||
					typeof entry.fileName !== 'string' ||
					typeof entry.content !== 'string' ||
					typeof entry.language !== 'string' ||
					typeof entry.fileId !== 'string')
			  {
          console.error("Entry having error: ", entry);
					throw new Error();
				}
			}
		} catch {
			throw new Error(`files.${slug} must contain a valid file list.`);
		}
	}
	return files;
}

export function requireArrayRecord(
	data: ProgressData,
	key: string
): Record<string, Record<string, unknown>[]> {
	const value = requireProgressObject(data, key);
	for (const [entryKey, entryValue] of Object.entries(value)) {
		if (!Array.isArray(entryValue)) {
			throw new Error(`${key}.${entryKey} must contain an array.`);
		}
		for (const [index, entry] of entryValue.entries()) {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
				throw new Error(`${key}.${entryKey}[${index}] must contain an object.`);
			}
		}
	}
	return value as Record<string, Record<string, unknown>[]>;
}

function requireFiniteNumber(
	entry: Record<string, unknown>,
	key: string,
	label: string
): void {
	if (typeof entry[key] !== 'number' || !Number.isFinite(entry[key])) {
		throw new Error(`${label}.${key} must contain a number.`);
	}
}

export function requireGameResultsRecord(
	data: ProgressData
): Record<string, Record<string, unknown>[]> {
	const value = requireArrayRecord(data, 'game-results');
	const numberFields = [
		'runCount',
		'submitCount',
		'timeSpent',
		'runScore',
		'submitScore',
		'timeScore',
		'totalScore',
		'timestamp'
	];
	for (const [problemId, results] of Object.entries(value)) {
		for (const [index, result] of results.entries()) {
			const label = `game-results.${problemId}[${index}]`;
			for (const field of numberFields) requireFiniteNumber(result, field, label);
			if (typeof result.rank !== 'string' || typeof result.code !== 'string') {
				throw new Error(`${label} must contain rank and code strings.`);
			}
			if (typeof result.language !== 'string' || !PROGRAMMING_LANGUAGES.has(result.language)) {
				throw new Error(`${label} has an invalid language.`);
			}
		}
	}
	return value;
}

export function requireUserSettingsObject(data: ProgressData): Record<string, unknown> {
	const value = requireProgressObject(data, 'user-settings');
	for (const key of ['preferredLanguage', 'playgroundPreferredLanguage']) {
		if (key in value && (typeof value[key] !== 'string' || !PROGRAMMING_LANGUAGES.has(value[key]))) {
			throw new Error(`user-settings.${key} has an invalid language.`);
		}
	}
	if (
		'editorFontSize' in value
		&& (typeof value.editorFontSize !== 'number' || !Number.isFinite(value.editorFontSize))
	) {
		throw new Error('user-settings.editorFontSize must contain a number.');
	}
	if ('theme' in value && value.theme !== 'dark' && value.theme !== 'light') {
		throw new Error('user-settings.theme is invalid.');
	}
	if ('vimMode' in value && value.vimMode !== 'off' && value.vimMode !== 'on') {
		throw new Error('user-settings.vimMode is invalid.');
	}
	if ('isSidebarOpen' in value && typeof value.isSidebarOpen !== 'boolean') {
		throw new Error('user-settings.isSidebarOpen must contain a boolean.');
	}
	if (
		'activePanel' in value
		&& value.activePanel !== 'explorer'
		&& value.activePanel !== 'search'
		&& value.activePanel !== null
	) {
		throw new Error('user-settings.activePanel is invalid.');
	}
	return value;
}
