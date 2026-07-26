import { describe, expect, it } from 'vitest';
import { formatAndSplitCSharpString } from './csharpUtil';

describe('formatAndSplitCSharpString', () => {
  it('does not split an escaped quote or backslash across literals', () => {
    const value = '["a\\b","c\\d","e"]';
    const result = formatAndSplitCSharpString(value, 5);
    const body = result.slice(result.indexOf('{') + 1, result.lastIndexOf('}'));
    const parts = body.split(',\n').map((part) => part.trim());

    expect(parts.map((part) => JSON.parse(part)).join('')).toBe(value);
  });
});
