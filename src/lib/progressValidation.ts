import type { ProgressData } from './progressBackup';

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
				if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error();
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
