import { describe, expect, it } from 'vitest';
import {
	requireArrayRecord,
	requireFileRecord,
	requireStringRecord
} from './progressValidation';

describe('progress restore validation', () => {
	it('rejects malformed string and array records', () => {
		expect(() => requireStringRecord({ solutions: { broken: 123 } }, 'solutions')).toThrow(
			'solutions.broken must contain a string'
		);
		expect(() => requireArrayRecord({ testcases: { broken: {} } }, 'testcases')).toThrow(
			'testcases.broken must contain an array'
		);
		expect(() => requireArrayRecord({ testcases: { broken: [null] } }, 'testcases')).toThrow(
			'testcases.broken[0] must contain an object'
		);
	});

	it('validates serialized file lists', () => {
		expect(() => requireFileRecord({ files: { playground: '{"not":"an array"}' } })).toThrow(
			'files.playground must contain a valid file list'
		);
		expect(
			requireFileRecord({
				files: {
					playground: JSON.stringify([
						{
							fileName: 'main.ts',
							content: 'console.log(1);',
							language: 'typescript',
							fileId: 'file-1',
							isActive: true
						}
					])
				}
			})
		).toHaveProperty('playground');
		expect(
			requireFileRecord({
				files: {
					playground: JSON.stringify([
						{
							fileName: 'diagram',
							content: '{"version":1,"elements":[]}',
							language: '__drawing__',
							fileId: 'file-1',
							isActive: true,
							type: 'drawing'
						}
					])
				}
			})
		).toHaveProperty('playground');
		expect(
			requireFileRecord({
				files: {
					playground: JSON.stringify([
						{
							fileName: 'Preview',
							content: '# Preview',
							language: 'markdown',
							fileId: 'preview-1',
							type: 'preview',
							sourceFileId: 'source-1'
						}
					])
				}
			})
		).toHaveProperty('playground');
	});
});
