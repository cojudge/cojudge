import { describe, expect, it } from 'vitest';
import {
	MAX_PERSISTED_LOG_CHARS,
	MAX_PERSISTED_OUTPUT_CHARS,
	stripRegenerableState,
	summarizeFileStoreValue,
	truncateTail
} from './persistLimits';

describe('truncateTail', () => {
	it('leaves small strings untouched', () => {
		expect(truncateTail('hello', 100)).toBe('hello');
		expect(truncateTail('', 100)).toBe('');
		expect(truncateTail(undefined, 100)).toBe('');
		expect(truncateTail(null, 100)).toBe('');
	});

	it('keeps the tail of oversized strings', () => {
		const value = `${'a'.repeat(200)}${'b'.repeat(200)}`;
		const out = truncateTail(value, 60);
		expect(out.length).toBeLessThanOrEqual(60);
		expect(out.endsWith('b'.repeat(10))).toBe(true);
		expect(out).toContain('truncated');
	});

	it('never exceeds the cap', () => {
		const value = 'x'.repeat(100_000);
		expect(truncateTail(value, MAX_PERSISTED_OUTPUT_CHARS).length).toBeLessThanOrEqual(
			MAX_PERSISTED_OUTPUT_CHARS
		);
		expect(truncateTail(value, MAX_PERSISTED_LOG_CHARS).length).toBeLessThanOrEqual(
			MAX_PERSISTED_LOG_CHARS
		);
	});
});

describe('summarizeFileStoreValue', () => {
	it('ranks entries biggest-first without throwing', () => {
		const serialized = JSON.stringify([
			{ fileId: 'small', fileName: 'a', language: 'java', content: 'x' },
			{ fileId: 'big', fileName: 'b', language: 'markdown', content: 'y'.repeat(5000) }
		]);
		const result = summarizeFileStoreValue(serialized);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.rows).toHaveLength(2);
		expect(result.rows[0].fileId).toBe('big');
		expect(result.rows[1].fileId).toBe('small');
	});

	it('reports corrupt payloads instead of throwing', () => {
		expect(summarizeFileStoreValue('not json').ok).toBe(false);
		expect(summarizeFileStoreValue(JSON.stringify({ not: 'an array' })).ok).toBe(false);
		expect(summarizeFileStoreValue(null).ok).toBe(true);
	});
});

describe('stripRegenerableState', () => {
	it('clears run state but keeps user content', () => {
		const serialized = JSON.stringify([
			{
				fileId: '1',
				fileName: 'Notes',
				language: 'markdown',
				content: 'keep me',
				output: 'o'.repeat(100),
				logs: 'l'.repeat(100),
				viewState: '{"cursor":1}'
			}
		]);
		const rows = JSON.parse(stripRegenerableState(serialized)) as Array<Record<string, unknown>>;
		expect(rows).toHaveLength(1);
		expect(rows[0].content).toBe('keep me');
		expect(rows[0].fileName).toBe('Notes');
		expect(rows[0].output).toBe('');
		expect(rows[0].logs).toBe('');
		expect(rows[0].viewState).toBeNull();
	});
});
