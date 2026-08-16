import { describe, expect, it } from 'vitest';
import {
	decodeCloudAssetParts,
	encodeCloudAssetParts,
	extractCloudAssets,
	hydrateCloudAssets
} from './cloudAssets';
import { hashProgress, serializeProgressData } from './progressBackup';

describe('cloud image sidecars', () => {
	it('extracts and exactly restores every supported embedded image location', async () => {
		const png = `data:image/png;base64,${'A'.repeat(2048)}`;
		const jpeg = 'data:image/jpeg;charset=utf-8;base64,AQIDBA==';
		const data = {
			files: {
				playground: JSON.stringify([
					{
						fileId: 'notes',
						fileName: 'Notes',
						language: 'markdown',
						content: `# Unicode 你好\n![inline](${png})`
					}
				])
			},
			'pasted-images': { pasted: png },
			'cojudge-whiteboard-v1': {
				version: 1,
				elements: [{ id: 'image', type: 'image', imageData: jpeg }]
			},
			'cojudge-whiteboard-v1:share:abc': {
				version: 1,
				elements: [{ id: 'duplicate', type: 'image', imageData: jpeg }]
			}
		};

		const extracted = await extractCloudAssets(data);

		expect(extracted.count).toBe(2);
		expect(JSON.stringify(extracted.data)).not.toContain('data:image');
		expect(JSON.stringify(extracted.data)).toContain('cojudge-cloud-asset://');
		expect(extracted.bytes.length).toBeLessThan(JSON.stringify(data).length);
		const hydrated = await hydrateCloudAssets(extracted.data, extracted.bytes);
		expect(hydrated).toEqual(data);
		expect(serializeProgressData(hydrated)).toBe(serializeProgressData(data));
		expect(await hashProgress(serializeProgressData(hydrated))).toBe(
			await hashProgress(serializeProgressData(data))
		);
	});

	it('leaves image-free snapshots unchanged without creating a sidecar', async () => {
		const data = {
			files: { playground: JSON.stringify([{ content: 'plain text', language: 'markdown' }]) },
			solutions: { sample: 'return 1;' }
		};

		const extracted = await extractCloudAssets(data);

		expect(extracted.count).toBe(0);
		expect(extracted.bytes).toHaveLength(0);
		expect(extracted.data).toEqual(data);
		expect(await hydrateCloudAssets(extracted.data, extracted.bytes)).toEqual(data);
	});

	it('moves an image larger than the old snapshot limit out of progress JSON', async () => {
		const image = `data:image/png;base64,${'A'.repeat(6 * 1024 * 1024 + 1)}`;
		const data = { 'pasted-images': { large: image } };

		const extracted = await extractCloudAssets(data);

		expect(new TextEncoder().encode(JSON.stringify(data)).length).toBeGreaterThan(6 * 1024 * 1024);
		expect(new TextEncoder().encode(JSON.stringify(extracted.data)).length).toBeLessThan(1024);
		expect(extracted.bytes.length).toBeGreaterThan(6 * 1024 * 1024);
	});

	it('rejects corrupt or incomplete image payloads before restore', async () => {
		const data = {
			'cojudge-whiteboard-v1': {
				version: 1,
				elements: [{ id: 'image', type: 'image', imageData: 'data:image/png;base64,AQIDBA==' }]
			}
		};
		const extracted = await extractCloudAssets(data);
		const corrupt = extracted.bytes.slice();
		corrupt[corrupt.length - 1] ^= 1;

		await expect(hydrateCloudAssets(extracted.data, corrupt)).rejects.toThrow(
			'Cloud image failed its integrity check.'
		);
		await expect(hydrateCloudAssets(extracted.data, corrupt.slice(1))).rejects.toThrow(
			'Cloud image download is incomplete.'
		);
	});

	it('round-trips binary Firestore chunks', () => {
		const bytes = new TextEncoder().encode('image-one\0image-two\0你好');
		const parts = encodeCloudAssetParts(bytes, 7);

		expect(parts.length).toBeGreaterThan(1);
		expect(decodeCloudAssetParts(parts, bytes.length)).toEqual(bytes);
		expect(() => decodeCloudAssetParts(parts.slice(1), bytes.length)).toThrow(
			'Cloud image download is incomplete.'
		);
	});
});
