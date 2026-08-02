// Pure helpers for comparing the local `files` store against the cloud's
// sanitized `files` store. No storage or Firebase access: callers feed in the
// raw store maps so this stays unit-testable.

export type FileStore = Record<string, string>;

type EntryLike = {
	fileId?: unknown;
	fileName?: unknown;
	language?: unknown;
	content?: unknown;
	isOpen?: unknown;
	isActive?: unknown;
	lastUpdated?: unknown;
	viewState?: unknown;
	output?: unknown;
	logs?: unknown;
	lastSharedContent?: unknown;
	order?: unknown;
};

export type DiffLine = { type: 'add' | 'remove' | 'same'; text: string };

export type LanguageChange = {
	language: string;
	local: boolean;
	cloud: boolean;
	localContent: string | null;
	cloudContent: string | null;
	blob: boolean;
	lines: DiffLine[];
};

export type FileChange = {
	fileId: string;
	slug: string;
	fileName: string;
	languages: LanguageChange[];
};

export const WHITEBOARD_FILE_ID = 'whiteboard';
export const WHITEBOARD_BOARD_KEY = 'cojudge-whiteboard-v1';
export const WHITEBOARD_RESTORED_EVENT = 'cojudge:whiteboard-restored';

// UI/runtime fields that belong to the editor, not to the file itself. They are
// carried over when a local file is discarded back to its cloud version.
const UI_FIELDS = [
	'isOpen',
	'isActive',
	'lastUpdated',
	'viewState',
	'output',
	'logs',
	'lastSharedContent',
	'order'
] as const;

function parseEntries(store: FileStore, slug: string): Array<Record<string, unknown>> {
	const raw = store[slug];
	if (typeof raw !== 'string') return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Array<Record<string, unknown>>) : [];
	} catch {
		return [];
	}
}

function fileLabel(entry: Record<string, unknown>): string {
	const name = entry['fileName'];
	return typeof name === 'string' && name ? name : 'file';
}

// Heuristic for binary/generated payloads (base64 images, data URLs, encoded
// strings) whose line-wise diff would be meaningless noise.
const BASE64_ALPHABET = /^[A-Za-z0-9+/=\s]+$/;

export function isBlobContent(content: string | null): boolean {
	if (!content) return false;
	const trimmed = content.trim();
	if (trimmed.length < 400) return false;
	if (trimmed.startsWith('data:') && trimmed.includes(';base64,')) return true;
	if (!trimmed.includes('\n') && BASE64_ALPHABET.test(trimmed)) return true;
	return false;
}

export function computeLineDiff(base: string[], next: string[]): DiffLine[] {
	const m = base.length;
	const n = next.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
	for (let i = m - 1; i >= 0; i--) {
		for (let j = n - 1; j >= 0; j--) {
			dp[i][j] = base[i] === next[j]
				? dp[i + 1][j + 1] + 1
				: Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	const lines: DiffLine[] = [];
	let i = 0;
	let j = 0;
	while (i < m && j < n) {
		if (base[i] === next[j]) {
			lines.push({ type: 'same', text: base[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			lines.push({ type: 'remove', text: base[i] });
			i++;
		} else {
			lines.push({ type: 'add', text: next[j] });
			j++;
		}
	}
	while (i < m) {
		lines.push({ type: 'remove', text: base[i] });
		i++;
	}
	while (j < n) {
		lines.push({ type: 'add', text: next[j] });
		j++;
	}
	return lines;
}

// Finds every file that exists in either the local or cloud store and describes
// how its content differs across languages.
export function computeFileChanges(localStore: FileStore, cloudStore: FileStore): FileChange[] {
	const slugs = new Set([...Object.keys(localStore), ...Object.keys(cloudStore)]);

	type Group = {
		slug: string;
		fileId: string;
		fileName: string;
		local: Array<Record<string, unknown>>;
		cloud: Array<Record<string, unknown>>;
	};
	const groups = new Map<string, Group>();

	for (const slug of slugs) {
		for (const entry of parseEntries(localStore, slug)) {
			const fileId = entry['fileId'];
			if (typeof fileId !== 'string') continue;
			const existing = groups.get(fileId) ?? { slug, fileId, fileName: fileLabel(entry), local: [], cloud: [] };
			existing.local.push(entry);
			groups.set(fileId, existing);
		}
		for (const entry of parseEntries(cloudStore, slug)) {
			const fileId = entry['fileId'];
			if (typeof fileId !== 'string') continue;
			const existing = groups.get(fileId) ?? { slug, fileId, fileName: '', local: [], cloud: [] };
			existing.cloud.push(entry);
			if (!existing.fileName) existing.fileName = fileLabel(entry);
			groups.set(fileId, existing);
		}
	}

	const changes: FileChange[] = [];
	for (const group of groups.values()) {
		const fileName = group.local[0]?.['fileName'] ?? group.cloud[0]?.['fileName'] ?? group.fileName;

		const languages = new Set<string>();
		for (const entry of [...group.local, ...group.cloud]) {
			const lang = entry['language'];
			if (typeof lang === 'string') languages.add(lang);
		}

		const languageChanges: LanguageChange[] = [];
		for (const language of languages) {
			const local = group.local.find((entry) => entry['language'] === language);
			const cloud = group.cloud.find((entry) => entry['language'] === language);
			const localContent = local && typeof local['content'] === 'string' ? local['content'] : null;
			const cloudContent = cloud && typeof cloud['content'] === 'string' ? cloud['content'] : null;
			if (localContent === cloudContent) continue;
			const blob = isBlobContent(localContent) || isBlobContent(cloudContent);

			languageChanges.push({
				language,
				local: local !== undefined,
				cloud: cloud !== undefined,
				localContent,
				cloudContent,
				blob,
				lines: blob
					? []
					: computeLineDiff(cloudContent?.split('\n') ?? [], localContent?.split('\n') ?? [])
			});
		}
		if (languageChanges.length === 0) continue;

		changes.push({
			fileId: group.fileId,
			slug: group.slug,
			fileName: typeof fileName === 'string' && fileName ? fileName : 'file',
			languages: languageChanges
		});
	}
	return changes;
}

// Describes whether the whiteboard board differs from the cloud. The board is a
// JSON payload that can embed base64 images, so the diff is always treated as a
// blob and no line-wise diff is produced.
export function computeWhiteboardChange(localBoard: unknown, cloudBoard: unknown): FileChange | null {
	const localContent = localBoard == null ? null : JSON.stringify(localBoard);
	const cloudContent = cloudBoard == null ? null : JSON.stringify(cloudBoard);
	if (localContent === cloudContent) return null;
	return {
		fileId: WHITEBOARD_FILE_ID,
		slug: 'whiteboard',
		fileName: 'Whiteboard',
		languages: [
			{
				language: 'drawing',
				local: localBoard != null,
				cloud: cloudBoard != null,
				localContent,
				cloudContent,
				blob: true,
				lines: []
			}
		]
	};
}

// Reverts a single file to its cloud version: locals that only exist locally are
// removed, and entries the file still owns in the cloud are restored while
// carrying over editor UI state.
export function discardFile(
	localStore: FileStore,
	fileId: string,
	cloudStore: FileStore
): FileStore {
	const result: FileStore = { ...localStore };

	for (const slug of Object.keys(result)) {
		const entries = parseEntries(result, slug);
		const localEntries = entries.filter((entry) => entry['fileId'] === fileId);
		const cloudEntries = parseEntries(cloudStore, slug).filter((entry) => entry['fileId'] === fileId);
		if (localEntries.length === 0 && cloudEntries.length === 0) continue;

		const kept = entries.filter((entry) => entry['fileId'] !== fileId);
		if (cloudEntries.length === 0) {
			result[slug] = JSON.stringify(kept);
			continue;
		}

		const restored = cloudEntries.map((cloudEntry) => {
			const localEntry = localEntries.find(
				(entry) => entry['language'] === cloudEntry['language']
			);
			const merged = { ...cloudEntry };
			if (localEntry) {
				for (const field of UI_FIELDS) {
					if (localEntry[field] !== undefined) merged[field] = localEntry[field];
				}
			}
			return merged;
		});

		result[slug] = JSON.stringify([...kept, ...restored]);
	}
	return result;
}