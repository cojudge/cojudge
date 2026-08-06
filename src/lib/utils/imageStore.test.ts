import { describe, it, expect } from 'vitest';
import {
    PASTED_IMAGE_SCHEME,
    PASTED_IMAGES_KEY,
    pastedImageLink,
    parsePastedImageLink,
    findPastedImageLinks,
    extractPastedImages
} from './imageStore';

describe('imageStore fake links', () => {
    it('builds fake links from ids', () => {
        expect(pastedImageLink('abc-123')).toBe('cojudge://image/abc-123');
        expect(PASTED_IMAGE_SCHEME).toBe('cojudge://image/');
    });

    it('parses ids out of fake links', () => {
        expect(parsePastedImageLink('cojudge://image/abc-123')).toBe('abc-123');
        expect(parsePastedImageLink('cojudge://image/')).toBe(null);
        expect(parsePastedImageLink('https://example.com/x.png')).toBe(null);
        expect(parsePastedImageLink('data:image/png;base64,iVBORw0KGgo=')).toBe(null);
        expect(parsePastedImageLink('')).toBe(null);
    });
});

describe('findPastedImageLinks', () => {
    it('finds fake links in markdown image syntax, deduplicated', () => {
        const content = [
            '# Notes',
            '',
            '![image](cojudge://image/abc-1)',
            '',
            '![diagram](cojudge://image/def-2 "title")',
            '',
            'Reused: ![image](cojudge://image/abc-1)',
            '',
            '[link](https://example.com) ![remote](https://example.com/a.png)'
        ].join('\n');
        expect(findPastedImageLinks(content).sort()).toEqual(['cojudge://image/abc-1', 'cojudge://image/def-2']);
    });

    it('returns nothing for plain markdown', () => {
        expect(findPastedImageLinks('hello **world** [x](https://example.com)')).toEqual([]);
        expect(findPastedImageLinks('')).toEqual([]);
    });
});

describe('extractPastedImages', () => {
    it('returns null when the key is absent', () => {
        expect(extractPastedImages({ files: '{}' })).toBe(null);
    });

    it('normalizes valid payloads to id → dataUrl records', () => {
        const record = extractPastedImages({
            [PASTED_IMAGES_KEY]: {
                'abc-1': 'data:image/png;base64,AAA=',
                'def-2': 'data:image/png;base64,BBB=',
                bad: 42
            }
        });
        expect(record).toEqual({
            'abc-1': 'data:image/png;base64,AAA=',
            'def-2': 'data:image/png;base64,BBB='
        });
    });

    it('returns null for malformed payloads', () => {
        expect(extractPastedImages({ [PASTED_IMAGES_KEY]: 'not-an-object' })).toBe(null);
        expect(extractPastedImages({ [PASTED_IMAGES_KEY]: null })).toBe(null);
        expect(extractPastedImages({ [PASTED_IMAGES_KEY]: [1, 2] })).toBe(null);
    });
});
