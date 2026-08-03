// Pure helpers for comparing the local `files` store against the cloud's
// sanitized `files` store. No storage or Firebase access: callers feed in the
// raw store maps so this stays unit-testable.

export type FileStore = Record<string, string>;
export type ProgressStore = Record<string, unknown>;

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
export const SOLUTION_FILE_ID_PREFIX = 'solution:';
export const TESTCASES_FILE_ID_PREFIX = 'testcases:';
export const GAME_RESULT_FILE_ID_PREFIX = 'game-result:';
export const WORKSPACE_FILE_ID_PREFIX = 'workspace:';
export const STORAGE_FILE_ID_PREFIX = 'storage:';
export const CHECKBOXES_FILE_ID = 'checkboxes';
export const USER_SETTINGS_FILE_ID = 'user-settings';
export const OTHER_CHANGE_FILE_ID_PREFIXES = [
	SOLUTION_FILE_ID_PREFIX,
	TESTCASES_FILE_ID_PREFIX,
	GAME_RESULT_FILE_ID_PREFIX,
	WORKSPACE_FILE_ID_PREFIX,
	STORAGE_FILE_ID_PREFIX
] as const;

// UI/runtime fields that belong to the editor, not to the file itself. They are
// carried over when a local file is discarded back to its cloud version.
// Note: `order` is intentionally excluded — it is a cloud-synced field, so
// discarding must restore the cloud order or a residual "Files (names or order)"
// change appears after every content discard.
const UI_FIELDS = [
	'isOpen',
	'isActive',
	'lastUpdated',
	'viewState',
	'output',
	'logs',
	'lastSharedContent'
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

function stableStringify(value: unknown): string {
	if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
	const entries = Object.entries(value as Record<string, unknown>)
		.filter(([, v]) => v !== undefined)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
	return `{${entries.join(',')}}`;
}

function valuesEqual(a: unknown, b: unknown): boolean {
	return stableStringify(a) === stableStringify(b);
}

function recordFrom(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function stringRecordFrom(value: unknown): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, entry] of Object.entries(recordFrom(value))) {
		if (typeof entry === 'string') result[key] = entry;
	}
	return result;
}

function summarizeValue(value: unknown): string {
	if (value === undefined) return '';
	const serialized = stableStringify(value);
	return serialized.length > 200 ? `${serialized.slice(0, 200)}…` : serialized;
}

// Fallback change for a whole storage key when finer-grained diffing is not
// available. Used for compound records (e.g. test case arrays) so users can
// still see and discard the change.
function wholeRecordChange(fileId: string, slug: string, fileName: string, localValue: unknown, cloudValue: unknown): FileChange {
	const localContent = localValue === undefined ? null : JSON.stringify(localValue, null, 2);
	const cloudContent = cloudValue === undefined ? null : JSON.stringify(cloudValue, null, 2);
	return {
		fileId,
		slug,
		fileName,
		languages: [
			{
				language: 'value',
				local: localValue !== undefined,
				cloud: cloudValue !== undefined,
				localContent,
				cloudContent,
				blob: true,
				lines: []
			}
		]
	};
}

// Compares the non-file parts of the cloud snapshot: solutions, test cases,
// game results, checkboxes, shared whiteboards and settings.
export function computeOtherChanges(localData: ProgressStore, cloudData: ProgressStore): FileChange[] {
	const changes: FileChange[] = [];

	// Solutions: one code string per problem slug.
	const localSolutions = stringRecordFrom(localData['solutions']);
	const cloudSolutions = stringRecordFrom(cloudData['solutions']);
	for (const slug of new Set([...Object.keys(localSolutions), ...Object.keys(cloudSolutions)])) {
		const localContent = localSolutions[slug] ?? null;
		const cloudContent = cloudSolutions[slug] ?? null;
		if (localContent === cloudContent) continue;
		const blob = isBlobContent(localContent) || isBlobContent(cloudContent);
		changes.push({
			fileId: `${SOLUTION_FILE_ID_PREFIX}${slug}`,
			slug,
			fileName: 'Solution',
			languages: [
				{
					language: 'code',
					local: slug in localSolutions,
					cloud: slug in cloudSolutions,
					localContent,
					cloudContent,
					blob,
					lines: blob
						? []
						: computeLineDiff(cloudContent?.split('\n') ?? [], localContent?.split('\n') ?? [])
				}
			]
		});
	}

	// Test cases: one array of cases per problem slug. The cases are compact
	// objects without a stable identity, so the whole array is treated as one
	// blob change.
	const localTestcases = recordFrom(localData['testcases']);
	const cloudTestcases = recordFrom(cloudData['testcases']);
	for (const slug of new Set([...Object.keys(localTestcases), ...Object.keys(cloudTestcases)])) {
		const localValue = localTestcases[slug];
		const cloudValue = cloudTestcases[slug];
		if (valuesEqual(localValue, cloudValue)) continue;
		changes.push(
			wholeRecordChange(`${TESTCASES_FILE_ID_PREFIX}${slug}`, slug, 'Test cases', localValue, cloudValue)
		);
	}

	// Game results: one array of results per problem slug, also compared whole.
	const localResults = recordFrom(localData['game-results']);
	const cloudResults = recordFrom(cloudData['game-results']);
	for (const slug of new Set([...Object.keys(localResults), ...Object.keys(cloudResults)])) {
		const localValue = localResults[slug];
		const cloudValue = cloudResults[slug];
		if (valuesEqual(localValue, cloudValue)) continue;
		changes.push(
			wholeRecordChange(`${GAME_RESULT_FILE_ID_PREFIX}${slug}`, slug, 'Game results', localValue, cloudValue)
		);
	}

	// Progress checkboxes: aggregate into a single change listing each problem.
	const localChecks = recordFrom(localData['user-checkboxes']);
	const cloudChecks = recordFrom(cloudData['user-checkboxes']);
	const checkboxLines: DiffLine[] = [];
	for (const slug of new Set([...Object.keys(localChecks), ...Object.keys(cloudChecks)])) {
		const localChecked = localChecks[slug] === true || localChecks[slug] === 'true';
		const cloudChecked = cloudChecks[slug] === true || cloudChecks[slug] === 'true';
		if (!(slug in localChecks) || !(slug in cloudChecks) || localChecked !== cloudChecked) {
			checkboxLines.push({
				type: 'same',
				text: `${slug}: ${cloudChecked ? 'checked' : 'unchecked'} → ${localChecked ? 'checked' : 'unchecked'}`
			});
		}
	}
	if (checkboxLines.length > 0) {
		changes.push({
			fileId: CHECKBOXES_FILE_ID,
			slug: 'solved',
			fileName: 'Solved checkboxes',
			languages: [
				{
					language: 'progress',
					local: Object.keys(localChecks).length > 0,
					cloud: Object.keys(cloudChecks).length > 0,
					localContent: null,
					cloudContent: null,
					blob: false,
					lines: checkboxLines
				}
			]
		});
	}

	// Shared whiteboard boards, one extra localStorage key per shared board.
	const sharePrefix = `${WHITEBOARD_BOARD_KEY}:share:`;
	const shareKeys = new Set(
		[...Object.keys(localData), ...Object.keys(cloudData)].filter((key) => key.startsWith(sharePrefix))
	);
	for (const key of shareKeys) {
		const localBoard = localData[key];
		const cloudBoard = cloudData[key];
		const change = computeWhiteboardChange(localBoard, cloudBoard);
		if (!change) continue;
		change.fileId = `storage:${key}`;
		change.fileName = `Shared whiteboard (${key.slice(sharePrefix.length)})`;
		changes.push(change);
	}

	// User settings, compared per field so the diff stays readable.
	const localSettings = recordFrom(localData['user-settings']);
	const cloudSettings = recordFrom(cloudData['user-settings']);
	const settingLines: DiffLine[] = [];
	for (const key of new Set([...Object.keys(localSettings), ...Object.keys(cloudSettings)])) {
		const localValue = localSettings[key];
		const cloudValue = cloudSettings[key];
		if (valuesEqual(localValue, cloudValue)) continue;
		if (key in cloudSettings) {
			settingLines.push({ type: 'remove', text: `${key}: ${summarizeValue(cloudValue)}` });
		}
		if (key in localSettings) {
			settingLines.push({ type: 'add', text: `${key}: ${summarizeValue(localValue)}` });
		}
	}
	if (settingLines.length > 0) {
		changes.push({
			fileId: USER_SETTINGS_FILE_ID,
			slug: 'settings',
			fileName: 'Settings',
			languages: [
				{
					language: 'settings',
					local: true,
					cloud: true,
					localContent: null,
					cloudContent: null,
					blob: false,
					lines: settingLines
				}
			]
		});
	}

	return changes;
}

// Catch-all for `files` store differences that produce no content diff (file
// renames, reorders, or other metadata edits): one blob change per workspace
// slug, skipped when a content-level change already covers that workspace.
export function computeWorkspaceChanges(
	localData: ProgressStore,
	cloudData: ProgressStore,
	coveredSlugs: Set<string>
): FileChange[] {
	const changes: FileChange[] = [];
	const localFiles = recordFrom(localData['files']);
	const cloudFiles = recordFrom(cloudData['files']);
	for (const slug of new Set([...Object.keys(localFiles), ...Object.keys(cloudFiles)])) {
		if (coveredSlugs.has(slug)) continue;
		if (valuesEqual(localFiles[slug], cloudFiles[slug])) continue;
		changes.push({
			fileId: `${WORKSPACE_FILE_ID_PREFIX}${slug}`,
			slug,
			fileName: 'Files (names or order)',
			languages: [
				{
					language: 'workspace',
					local: slug in localFiles,
					cloud: slug in cloudFiles,
					localContent: null,
					cloudContent: null,
					blob: true,
					lines: []
				}
			]
		});
	}
	return changes;
}

// Reverts one non-file change to its cloud value inside a progress data map,
// returning the updated map. Unknown fileIds are ignored.
export function discardChange(data: ProgressStore, fileId: string, cloudData: ProgressStore): ProgressStore {
	const result: ProgressStore = { ...data };
	const assign = (key: string, value: unknown) => {
		if (value === undefined) delete result[key];
		else result[key] = value;
	};

	if (fileId.startsWith(SOLUTION_FILE_ID_PREFIX)) {
		const slug = fileId.slice(SOLUTION_FILE_ID_PREFIX.length);
		const solutions = { ...stringRecordFrom(result['solutions']) };
		const cloudSolutions = stringRecordFrom(cloudData['solutions']);
		if (slug in cloudSolutions) solutions[slug] = cloudSolutions[slug];
		else delete solutions[slug];
		assign('solutions', solutions);
		return result;
	}
	if (fileId.startsWith(TESTCASES_FILE_ID_PREFIX)) {
		const slug = fileId.slice(TESTCASES_FILE_ID_PREFIX.length);
		const testcases = { ...recordFrom(result['testcases']) };
		const cloudTestcases = recordFrom(cloudData['testcases']);
		if (slug in cloudTestcases) testcases[slug] = cloudTestcases[slug];
		else delete testcases[slug];
		assign('testcases', testcases);
		return result;
	}
	if (fileId.startsWith(GAME_RESULT_FILE_ID_PREFIX)) {
		const slug = fileId.slice(GAME_RESULT_FILE_ID_PREFIX.length);
		const results = { ...recordFrom(result['game-results']) };
		const cloudResults = recordFrom(cloudData['game-results']);
		if (slug in cloudResults) results[slug] = cloudResults[slug];
		else delete results[slug];
		assign('game-results', results);
		return result;
	}
	if (fileId === CHECKBOXES_FILE_ID) {
		assign('user-checkboxes', cloudData['user-checkboxes']);
		return result;
	}
	if (fileId === USER_SETTINGS_FILE_ID) {
		assign('user-settings', cloudData['user-settings']);
		return result;
	}
	if (fileId.startsWith(WORKSPACE_FILE_ID_PREFIX)) {
		const slug = fileId.slice(WORKSPACE_FILE_ID_PREFIX.length);
		const files = { ...recordFrom(result['files']) };
		const cloudFiles = recordFrom(cloudData['files']);
		if (slug in cloudFiles) files[slug] = cloudFiles[slug];
		else delete files[slug];
		assign('files', files);
		return result;
	}
	if (fileId.startsWith(STORAGE_FILE_ID_PREFIX)) {
		const key = fileId.slice(STORAGE_FILE_ID_PREFIX.length);
		assign(key, cloudData[key]);
		return result;
	}
	return result;
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
// carrying over editor UI state. Restored entries replace matching local slots
// in place so sibling files (and array order) stay put — otherwise discarding
// content leaves a residual "Files (names or order)" workspace change.
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

		if (cloudEntries.length === 0) {
			result[slug] = JSON.stringify(entries.filter((entry) => entry['fileId'] !== fileId));
			continue;
		}

		const restoredByLanguage = new Map<string, Record<string, unknown>>();
		for (const cloudEntry of cloudEntries) {
			const language = cloudEntry['language'];
			const langKey = typeof language === 'string' ? language : '';
			const localEntry = localEntries.find((entry) => entry['language'] === cloudEntry['language']);
			const merged = { ...cloudEntry };
			if (localEntry) {
				for (const field of UI_FIELDS) {
					if (localEntry[field] !== undefined) merged[field] = localEntry[field];
				}
			}
			restoredByLanguage.set(langKey, merged);
		}

		const usedLanguages = new Set<string>();
		const next: Array<Record<string, unknown>> = [];
		for (const entry of entries) {
			if (entry['fileId'] !== fileId) {
				next.push(entry);
				continue;
			}
			const language = entry['language'];
			const langKey = typeof language === 'string' ? language : '';
			const restored = restoredByLanguage.get(langKey);
			if (restored) {
				next.push(restored);
				usedLanguages.add(langKey);
			}
		}
		for (const [langKey, restored] of restoredByLanguage) {
			if (!usedLanguages.has(langKey)) next.push(restored);
		}

		result[slug] = JSON.stringify(next);
	}
	return result;
}