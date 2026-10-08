// Caps for regenerable per-run state persisted alongside playground files.
//
// `content` (user code/notes) is NEVER truncated here. Only `output`, `logs`
// and `viewState` are capped: they are re-created on the next run / editor
// open, but an unbounded runaway (e.g. an infinite loop printing megabytes)
// would otherwise bloat localStorage, wedge the playground on load, and blow
// past the desktop export body limit.

export const MAX_PERSISTED_OUTPUT_CHARS = 20_000;
export const MAX_PERSISTED_LOG_CHARS = 20_000;
export const MAX_PERSISTED_VIEWSTATE_CHARS = 20_000;

export const TRUNCATION_NOTE = '…[earlier output truncated]…';

/** Keep the tail (most recent part) of a persisted string, unchanged when small. */
export function truncateTail(value: string | undefined | null, maxChars: number): string {
	if (typeof value !== 'string' || value.length === 0) return '';
	if (!Number.isSafeInteger(maxChars) || maxChars <= 0) return '';
	if (value.length <= maxChars) return value;
	if (maxChars <= TRUNCATION_NOTE.length + 1) return value.slice(-maxChars);
	return `${TRUNCATION_NOTE}\n${value.slice(-(maxChars - TRUNCATION_NOTE.length - 1))}`;
}

export type FileSizeRow = {
	fileId: string;
	fileName: string;
	language: string;
	type: string;
	contentChars: number;
	outputChars: number;
	logsChars: number;
	viewStateChars: number;
	totalChars: number;
};

function rowLength(value: unknown): number {
	return typeof value === 'string' ? value.length : 0;
}

/**
 * Describe one serialized `files[slug]` value (a JSON array of FileEntry)
 * without throwing. Used by the safe-mode recovery view.
 */
export function summarizeFileStoreValue(
	serialized: string | null | undefined
): { ok: true; rows: FileSizeRow[] } | { ok: false; error: string } {
	try {
		const parsed: unknown = JSON.parse(serialized ?? '[]');
		if (!Array.isArray(parsed)) return { ok: false, error: 'expected an array of files' };
		const rows: FileSizeRow[] = parsed.map((entry) => {
			const record = (entry ?? {}) as Record<string, unknown>;
			const contentChars = rowLength(record.content);
			const outputChars = rowLength(record.output);
			const logsChars = rowLength(record.logs);
			const viewStateChars = rowLength(record.viewState);
			return {
				fileId: typeof record.fileId === 'string' ? record.fileId : '',
				fileName: typeof record.fileName === 'string' ? record.fileName : '(unnamed)',
				language: typeof record.language === 'string' ? record.language : '',
				type: typeof record.type === 'string' ? record.type : 'editor',
				contentChars,
				outputChars,
				logsChars,
				viewStateChars,
				totalChars: contentChars + outputChars + logsChars + viewStateChars
			};
		});
		rows.sort((a, b) => b.totalChars - a.totalChars);
		return { ok: true, rows };
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : String(error) };
	}
}

/** Return a copy of a serialized `files[slug]` value with run state cleared. */
export function stripRegenerableState(serialized: string): string {
	const parsed: unknown = JSON.parse(serialized);
	if (!Array.isArray(parsed)) return serialized;
	return JSON.stringify(
		parsed.map((entry) => {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
			return { ...(entry as Record<string, unknown>), output: '', logs: '', viewState: null };
		})
	);
}
