// IndexedDB-backed store for images pasted into markdown documents.
// The markdown source keeps a fake link (cojudge://image/<id>) instead of the
// base64 payload, so the document text stays small and diffable. Renderers
// resolve the fake link back to the stored data URL via resolvePastedImages
// (see markdown.ts).

const DB_NAME = 'cojudge-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export const PASTED_IMAGE_SCHEME = 'cojudge://image/';

// Progress-data key used to carry pasted images inside cloud snapshots and
// local backup exports. Images are only included when referenced by a markdown
// file (cloud) or as a full snapshot (backup export).
export const PASTED_IMAGES_KEY = 'pasted-images';

export function pastedImageLink(id: string): string {
    return PASTED_IMAGE_SCHEME + id;
}

export function parsePastedImageLink(href: string): string | null {
    if (!href.startsWith(PASTED_IMAGE_SCHEME)) return null;
    const id = href.slice(PASTED_IMAGE_SCHEME.length);
    return id || null;
}

// Finds every fake image link embedded in markdown image syntax.
export function findPastedImageLinks(content: string): string[] {
    const links = new Set<string>();
    const regex = /!\[[^\]]*\]\(\s*(cojudge:\/\/image\/[^\s)]+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        links.add(match[1]);
    }
    return [...links];
}

// Validates a PASTED_IMAGES_KEY payload from a cloud snapshot or backup file:
// { [id]: dataUrl }. Returns null when the key is absent or malformed.
export function extractPastedImages(data: Record<string, unknown>): Record<string, string> | null {
    if (!(PASTED_IMAGES_KEY in data)) return null;
    const value = data[PASTED_IMAGES_KEY];
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const record: Record<string, string> = {};
    for (const [id, dataUrl] of Object.entries(value)) {
        if (typeof dataUrl === 'string') record[id] = dataUrl;
    }
    return record;
}

type ImageRecord = { id: string; dataUrl: string; createdAt: number };

// In-memory cache so re-renders (every preview keystroke) don't hit IndexedDB.
const cache = new Map<string, string>();

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;
    const promise = new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB is not available'));
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    });
    dbPromise = promise;
    // Reset the cached promise on failure so a later call retries the open.
    promise.catch(() => { dbPromise = null; });
    return promise;
}

function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return openDb().then((db) =>
        new Promise<T>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, mode);
            const request = fn(tx.objectStore(STORE_NAME));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        })
    );
}

function generateId(): string {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch {
        // fall through
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Stores the pasted image payload and returns the fake link to embed in the
// markdown source.
export async function storePastedImage(dataUrl: string): Promise<string> {
    const id = generateId();
    const record: ImageRecord = { id, dataUrl, createdAt: Date.now() };
    await withStore('readwrite', (store) => store.put(record));
    cache.set(id, dataUrl);
    return pastedImageLink(id);
}

// Resolves a fake link to the stored data URL (null when unknown).
export async function getPastedImage(href: string): Promise<string | null> {
    const id = parsePastedImageLink(href);
    if (!id) return null;
    const cached = cache.get(id);
    if (cached !== undefined) return cached;
    try {
        const record = await withStore<ImageRecord | undefined>('readonly', (store) => store.get(id));
        if (!record) return null;
        cache.set(id, record.dataUrl);
        return record.dataUrl;
    } catch {
        return null;
    }
}

// Removes a stored image. No-op for unknown links (e.g. IndexedDB unavailable).
export async function deletePastedImage(href: string): Promise<void> {
    const id = parsePastedImageLink(href);
    if (!id) return;
    cache.delete(id);
    try {
        await withStore('readwrite', (store) => store.delete(id));
    } catch {
        // ignore
    }
}

// Returns every stored image as { [id]: dataUrl } (empty when IndexedDB is
// unavailable). Used for cloud snapshots and backup exports.
export async function getAllPastedImages(): Promise<Record<string, string>> {
    try {
        const records = await withStore<ImageRecord[]>('readonly', (store) => store.getAll());
        const result: Record<string, string> = {};
        for (const record of records) {
            if (typeof record?.id === 'string' && typeof record.dataUrl === 'string') {
                result[record.id] = record.dataUrl;
                cache.set(record.id, record.dataUrl);
            }
        }
        return result;
    } catch {
        return {};
    }
}

// Writes records ({ [id]: dataUrl }) from a cloud snapshot or backup import
// into the store. Missing entries are left untouched; existing ones are
// overwritten.
export async function importPastedImages(records: Record<string, string>): Promise<void> {
    const entries = Object.entries(records);
    if (entries.length === 0) return;
    try {
        const db = await openDb();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            for (const [id, dataUrl] of entries) {
                cache.set(id, dataUrl);
                store.put({ id, dataUrl, createdAt: Date.now() } as ImageRecord);
            }
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    } catch {
        // ignore
    }
}

// Replaces fake image links in markdown with their stored data URLs. Links
// that cannot be resolved are left as-is.
export async function inlinePastedImageLinks(content: string): Promise<string> {
    const links = findPastedImageLinks(content);
    if (links.length === 0) return content;
    let result = content;
    for (const link of links) {
        const dataUrl = await getPastedImage(link);
        if (dataUrl) result = result.replaceAll(link, dataUrl);
    }
    return result;
}
