import type { ProgressData } from '$lib/progressBackup';

export const CLOUD_ASSET_CHUNK_BYTES = 700 * 1024;
export const MAX_CLOUD_ASSET_BYTES = 64 * 1024 * 1024;
export const MAX_CLOUD_ASSET_PARTS = 96;
export const MAX_CLOUD_ASSET_COUNT = 512;

const CLOUD_ASSET_MANIFEST_KEY = 'cojudge-cloud-assets-v1';
const CLOUD_ASSET_REFERENCE_PREFIX = 'cojudge-cloud-asset://';
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const DATA_IMAGE_URL_SOURCE = String.raw`data:image\/[a-z0-9.+-]+(?:;[^,;"'\s)]+)*;base64,[a-z0-9+/]+={0,2}`;
const CLOUD_ASSET_REFERENCE_SOURCE = String.raw`cojudge-cloud-asset:\/\/([a-f0-9]{64})`;

type CloudAssetDescriptor = {
	id: string;
	offset: number;
	length: number;
};

type CloudAssetManifest = {
	version: 1;
	assets: CloudAssetDescriptor[];
};

export type ExtractedCloudAssets = {
	data: ProgressData;
	bytes: Uint8Array;
	count: number;
};

function dataImagePattern(): RegExp {
	return new RegExp(DATA_IMAGE_URL_SOURCE, 'gi');
}

function cloudAssetReferencePattern(): RegExp {
	return new RegExp(CLOUD_ASSET_REFERENCE_SOURCE, 'g');
}

function collectDataImages(value: unknown, images: Set<string>): void {
	if (typeof value === 'string') {
		for (const match of value.matchAll(dataImagePattern())) images.add(match[0]);
		return;
	}
	if (Array.isArray(value)) {
		for (const entry of value) collectDataImages(entry, images);
		return;
	}
	if (!value || typeof value !== 'object') return;
	for (const entry of Object.values(value as Record<string, unknown>)) {
		collectDataImages(entry, images);
	}
}

function cloneReplacingDataImages(value: unknown, references: Map<string, string>): unknown {
	if (typeof value === 'string') {
		return value.replace(dataImagePattern(), (image) => {
			const id = references.get(image);
			if (!id) throw new Error('Cloud image extraction is incomplete.');
			return `${CLOUD_ASSET_REFERENCE_PREFIX}${id}`;
		});
	}
	if (Array.isArray(value)) return value.map((entry) => cloneReplacingDataImages(entry, references));
	if (!value || typeof value !== 'object') return value;

	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
		result[key] = cloneReplacingDataImages(entry, references);
	}
	return result;
}

function cloneReplacingAssetReferences(
	value: unknown,
	assets: Map<string, string>,
	used: Set<string>
): unknown {
	if (typeof value === 'string') {
		return value.replace(cloudAssetReferencePattern(), (_reference, id: string) => {
			const image = assets.get(id);
			if (!image) throw new Error('Cloud snapshot references a missing image.');
			used.add(id);
			return image;
		});
	}
	if (Array.isArray(value)) {
		return value.map((entry) => cloneReplacingAssetReferences(entry, assets, used));
	}
	if (!value || typeof value !== 'object') return value;

	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
		if (key === CLOUD_ASSET_MANIFEST_KEY) continue;
		result[key] = cloneReplacingAssetReferences(entry, assets, used);
	}
	return result;
}

export async function hashCloudAssetBytes(bytes: Uint8Array): Promise<string> {
	const digestBytes = new Uint8Array(bytes.length);
	digestBytes.set(bytes);
	const digest = await crypto.subtle.digest('SHA-256', digestBytes);
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashCloudAssetValue(value: string): Promise<string> {
	return hashCloudAssetBytes(new TextEncoder().encode(value));
}

function parseManifest(value: unknown): CloudAssetManifest {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Cloud image manifest is invalid.');
	}
	const manifest = value as Partial<CloudAssetManifest>;
	if (manifest.version !== 1 || !Array.isArray(manifest.assets)) {
		throw new Error('Cloud image manifest is invalid.');
	}
	if (manifest.assets.length === 0 || manifest.assets.length > MAX_CLOUD_ASSET_COUNT) {
		throw new Error('Cloud image manifest has an invalid image count.');
	}

	const descriptors: CloudAssetDescriptor[] = [];
	let expectedOffset = 0;
	const ids = new Set<string>();
	for (const candidate of manifest.assets) {
		if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
			throw new Error('Cloud image manifest is invalid.');
		}
		const descriptor = candidate as Partial<CloudAssetDescriptor>;
		if (
			typeof descriptor.id !== 'string'
			|| !SHA256_PATTERN.test(descriptor.id)
			|| ids.has(descriptor.id)
			|| !Number.isSafeInteger(descriptor.offset)
			|| descriptor.offset !== expectedOffset
			|| !Number.isSafeInteger(descriptor.length)
			|| (descriptor.length as number) <= 0
		) {
			throw new Error('Cloud image manifest is invalid.');
		}
		ids.add(descriptor.id);
		descriptors.push(descriptor as CloudAssetDescriptor);
		expectedOffset += descriptor.length as number;
		if (!Number.isSafeInteger(expectedOffset) || expectedOffset > MAX_CLOUD_ASSET_BYTES) {
			throw new Error('Cloud image manifest exceeds the supported size.');
		}
	}
	return { version: 1, assets: descriptors };
}

function isCompleteDataImage(value: string): boolean {
	const matches = [...value.matchAll(dataImagePattern())];
	return matches.length === 1 && matches[0][0] === value;
}

export async function extractCloudAssets(data: ProgressData): Promise<ExtractedCloudAssets> {
	if (CLOUD_ASSET_MANIFEST_KEY in data) {
		throw new Error('Progress data contains a reserved cloud image key.');
	}

	const imageValues = new Set<string>();
	collectDataImages(data, imageValues);
	if (imageValues.size === 0) {
		return {
			data: cloneReplacingDataImages(data, new Map()) as ProgressData,
			bytes: new Uint8Array(),
			count: 0
		};
	}
	if (imageValues.size > MAX_CLOUD_ASSET_COUNT) {
		throw new Error(`A cloud snapshot can contain at most ${MAX_CLOUD_ASSET_COUNT} images.`);
	}

	const values = [...imageValues];
	const ids = await Promise.all(values.map(hashCloudAssetValue));
	const valueById = new Map<string, string>();
	const idByValue = new Map<string, string>();
	for (let index = 0; index < values.length; index++) {
		const value = values[index];
		const id = ids[index];
		const collision = valueById.get(id);
		if (collision !== undefined && collision !== value) {
			throw new Error('Two cloud images produced the same content hash.');
		}
		valueById.set(id, value);
		idByValue.set(value, id);
	}

	const encoder = new TextEncoder();
	const encoded = [...valueById.entries()]
		.sort(([first], [second]) => first.localeCompare(second))
		.map(([id, value]) => ({ id, bytes: encoder.encode(value) }));
	const totalBytes = encoded.reduce((total, asset) => total + asset.bytes.length, 0);
	if (!Number.isSafeInteger(totalBytes) || totalBytes > MAX_CLOUD_ASSET_BYTES) {
		throw new Error('Cloud images exceed the 64 MB limit.');
	}

	const bytes = new Uint8Array(totalBytes);
	const descriptors: CloudAssetDescriptor[] = [];
	let offset = 0;
	for (const asset of encoded) {
		bytes.set(asset.bytes, offset);
		descriptors.push({ id: asset.id, offset, length: asset.bytes.length });
		offset += asset.bytes.length;
	}

	const result = cloneReplacingDataImages(data, idByValue) as ProgressData;
	result[CLOUD_ASSET_MANIFEST_KEY] = { version: 1, assets: descriptors } satisfies CloudAssetManifest;
	return { data: result, bytes, count: descriptors.length };
}

export async function hydrateCloudAssets(data: ProgressData, bytes: Uint8Array): Promise<ProgressData> {
	const manifestValue = data[CLOUD_ASSET_MANIFEST_KEY];
	if (manifestValue === undefined) {
		if (bytes.length !== 0) throw new Error('Cloud snapshot has images but no image manifest.');
		return cloneReplacingAssetReferences(data, new Map(), new Set()) as ProgressData;
	}
	const manifest = parseManifest(manifestValue);
	const expectedBytes = manifest.assets.reduce((total, asset) => total + asset.length, 0);
	if (bytes.length !== expectedBytes) throw new Error('Cloud image download is incomplete.');

	const decoder = new TextDecoder('utf-8', { fatal: true });
	const assets = new Map<string, string>();
	for (const descriptor of manifest.assets) {
		const value = decoder.decode(bytes.subarray(descriptor.offset, descriptor.offset + descriptor.length));
		if (!isCompleteDataImage(value) || (await hashCloudAssetValue(value)) !== descriptor.id) {
			throw new Error('Cloud image failed its integrity check.');
		}
		assets.set(descriptor.id, value);
	}

	const used = new Set<string>();
	const hydrated = cloneReplacingAssetReferences(data, assets, used) as ProgressData;
	if (used.size !== assets.size) throw new Error('Cloud snapshot contains an unreferenced image.');
	return hydrated;
}

export function encodeCloudAssetParts(
	bytes: Uint8Array,
	chunkBytes = CLOUD_ASSET_CHUNK_BYTES
): Uint8Array[] {
	if (!Number.isSafeInteger(chunkBytes) || chunkBytes <= 0) {
		throw new Error('Cloud image chunk size must be a positive integer.');
	}
	const parts: Uint8Array[] = [];
	for (let offset = 0; offset < bytes.length; offset += chunkBytes) {
		parts.push(bytes.slice(offset, offset + chunkBytes));
	}
	return parts;
}

export function decodeCloudAssetParts(parts: readonly Uint8Array[], totalBytes: number): Uint8Array {
	if (!Number.isSafeInteger(totalBytes) || totalBytes < 0 || totalBytes > MAX_CLOUD_ASSET_BYTES) {
		throw new Error('Cloud images have an invalid size.');
	}
	const actualBytes = parts.reduce((total, part) => total + part.length, 0);
	if (actualBytes !== totalBytes) throw new Error('Cloud image download is incomplete.');

	const combined = new Uint8Array(actualBytes);
	let offset = 0;
	for (const part of parts) {
		combined.set(part, offset);
		offset += part.length;
	}
	return combined;
}
