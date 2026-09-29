import { describe, expect, it } from 'vitest';
import {
	createReleaseNotesPreview,
	formatAppUpdateInstallError,
	normalizeUpdateErrorMessage,
	APP_UPDATE_RELEASES_URL
} from './appUpdate';

describe('appUpdate helpers', () => {
	it('normalizes quoted and prefixed errors', () => {
		expect(normalizeUpdateErrorMessage('"hello"')).toBe('hello');
		expect(normalizeUpdateErrorMessage('Error: boom')).toBe('boom');
		expect(normalizeUpdateErrorMessage('  Error: "spaced"  ')).toBe('spaced');
	});

	it('strips markdown for release-notes preview', () => {
		expect(createReleaseNotesPreview(null)).toBeNull();
		expect(createReleaseNotesPreview('## Title\n- item')).toBe('Title\nitem');
		const long = 'a'.repeat(300);
		const preview = createReleaseNotesPreview(long);
		expect(preview?.endsWith('...')).toBe(true);
		expect(preview!.length).toBeLessThan(long.length);
	});

	it('formats install errors with manual fallback', () => {
		const message = formatAppUpdateInstallError(new Error('econnreset while downloading'));
		expect(message).toContain('Cojudge');
		expect(message).toContain(APP_UPDATE_RELEASES_URL);
	});
});
