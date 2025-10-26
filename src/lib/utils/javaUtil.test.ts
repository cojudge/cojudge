import { describe, it, expect } from 'vitest';
import { formatAndSplitJavaString } from './javaUtil';
import { javaGetFullParam } from './javaUtil';

describe('formatAndSplitJavaString', () => {
  it('returns "null" for null and undefined', () => {
    // @ts-ignore
    expect(formatAndSplitJavaString(null)).toBe('null');
    // @ts-ignore
    expect(formatAndSplitJavaString(undefined)).toBe('null');
  });

  it('splits long strings into chunks joined by ,', () => {
    const long = 'a'.repeat(35000);
    const res = formatAndSplitJavaString(long, 16000, "");
    // should contain + between chunks
    expect(res.includes(',')).toBe(true);
    // all chunks should be quoted
    const parts = res.split(',').map(p => p.trim());
    for (const p of parts) {
      expect(p.startsWith('"')).toBe(true);
      expect(p.endsWith('"')).toBe(true);
    }
    // concatenated content length should match escaped length (no extra chars other than escaping)
    const joinedContent = parts.map(p => p.slice(1, -1)).join('');
    expect(joinedContent.length).toBe(long.length);
  });

  it('formats params for javaGetFullParam correctly', () => {
    const params = [
      { name: 's', type: 'string' },
      { name: 'n', type: 'int' },
      { name: 'arr', type: 'int_array' },
    ];

    const tc = {
      s: 'hello "world" \\',
      n: 42,
      arr: '[1, 2, 3]'
    } as any;

    const res = javaGetFullParam(params as any, tc);

    // Expect string to be quoted and escaped
    expect(res.startsWith('"')).toBe(true);
    expect(res.includes('\\"world\\"')).toBe(true);

    // Expect int to appear (after the first comma)
    expect(res.includes(',42,') || res.includes(',42')).toBe(true);

    // Expect int_array to call to_int_array
    expect(res.includes('to_int_array(')).toBe(true);
    expect(res.includes('[1, 2, 3]')).toBe(true);
  });

  it('returns null literal for null/undefined string param', () => {
    const params = [ { name: 's', type: 'string' } ];
    const tc1 = { s: null } as any;
    const tc2 = {} as any;

    const res1 = javaGetFullParam(params as any, tc1);
    const res2 = javaGetFullParam(params as any, tc2);

    expect(res1).toBe('null');
    expect(res2).toBe('null');
  });

  it('formats params for string_array from array', () => {
    const params = [ { name: 'wordDict', type: 'string_array' } ];
    const tc = { wordDict: ['leet', 'code'] } as any;
    const res = javaGetFullParam(params as any, tc);
    expect(res.startsWith('to_string_list(')).toBe(true);
  });

  it('formats params for string_array from raw string', () => {
    const params = [ { name: 'wordDict', type: 'string_array' } ];
    const tc = { wordDict: "['apple','pen']" } as any;
    const res = javaGetFullParam(params as any, tc);
    expect(res.startsWith('to_string_list(')).toBe(true);
  });
});
