import { describe, expect, it, vi } from 'vitest';

// @ts-expect-error SvelteKit's virtual module is not present in plain Vitest.
vi.mock('$env/dynamic/private', () => ({ env: {} }), { virtual: true });

import { goGetFullParam } from './goUtil';

describe('goGetFullParam', () => {
  it('serializes int arrays without changing their elements', () => {
    const params = [{ name: 'nums', type: 'int_array' }];
    const result = goGetFullParam(params as any, {
      nums: [100, 4, 200, 1, 3, 2]
    });

    expect(result).toBe('toIntArray("[100,4,200,1,3,2]")');
  });

  it('preserves preformatted int array strings', () => {
    const params = [{ name: 'nums', type: 'int_array' }];
    const result = goGetFullParam(params as any, { nums: '[1, 2, 3]' });

    expect(result).toBe('toIntArray("[1, 2, 3]")');
  });
});
