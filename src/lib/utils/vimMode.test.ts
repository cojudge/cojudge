import { describe, expect, it } from 'vitest';
import {
    findMatchingSymbolPosition,
    getExYankRegister,
    getLinewiseRangeText,
    yankLineRangeToRegister
} from './vimMode';

function createCm(lines: string[], cursor = { line: 0, ch: 0 }) {
    return {
        firstLine: () => 0,
        lastLine: () => lines.length - 1,
        getCursor: () => cursor,
        getLine: (line: number) => lines[line] ?? ''
    };
}

describe('vim mode helpers', () => {
    it('extracts linewise text for Ex yank ranges', () => {
        const cm = createCm(['alpha', 'beta', 'gamma']);

        expect(getLinewiseRangeText(cm, 0, 2)).toBe('alpha\nbeta\ngamma');
    });

    it('passes range and clipboard register through Ex yank', () => {
        const cm = createCm(['alpha', 'beta', 'gamma']);
        const pushed: unknown[][] = [];
        const Vim = {
            defineMotion: () => {},
            defineEx: () => {},
            getRegisterController: () => ({
                pushText: (...args: unknown[]) => pushed.push(args)
            })
        };

        yankLineRangeToRegister(Vim, cm, { line: 0, lineEnd: 2, args: ['+'] });

        expect(pushed).toEqual([['+', 'yank', 'alpha\nbeta\ngamma', true, false]]);
    });

    it('parses compact Ex yank registers', () => {
        expect(getExYankRegister({ args: ['+'] })).toBe('+');
        expect(getExYankRegister({ args: ['a'] })).toBe('a');
        expect(getExYankRegister({})).toBeUndefined();
    });

    it('finds matching symbols in both directions', () => {
        const cm = createCm(['if (a[0]) {', '  return a[0];', '}']);

        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 3 })).toEqual({ line: 0, ch: 8 });
        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 7 })).toEqual({ line: 0, ch: 5 });
        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 10 })).toEqual({ line: 2, ch: 0 });
    });

    it('keeps the cursor position when no match exists', () => {
        const cm = createCm(['const value = 1;']);

        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 0 })).toEqual({ line: 0, ch: 0 });
    });
});
