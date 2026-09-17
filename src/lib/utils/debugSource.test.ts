import { describe, expect, it } from 'vitest';
import { canInspectToken, isBreakpointCandidate } from './debugSource';

describe('debug source filtering', () => {
    it('uses token boundaries to distinguish code from an inline comment', () => {
        const tokens = [{ offset: 0, type: '' }, { offset: 5, type: 'comment.cpp' }];
        expect(canInspectToken(tokens, 1)).toBe(true);
        expect(canInspectToken(tokens, 5)).toBe(false);
        expect(isBreakpointCandidate('x++; // x', tokens, 'cpp')).toBe(true);
    });

    it('rejects comments and whitespace-separated structural punctuation', () => {
        expect(isBreakpointCandidate(' remove ', [{ offset: 0, type: 'comment.cpp' }], 'cpp')).toBe(false);
        expect(isBreakpointCandidate(' } ; ', [{ offset: 0, type: '' }], 'cpp')).toBe(false);
    });

    it('does not inspect string contents or mistake them for declarations', () => {
        const tokens = [{ offset: 0, type: 'string.python' }];
        expect(canInspectToken(tokens, 2)).toBe(false);
        expect(isBreakpointCandidate('"class"', tokens, 'python')).toBe(true);
    });

    it('preserves executable C# using statements', () => {
        const tokens = [{ offset: 0, type: '' }];
        expect(isBreakpointCandidate('using System.IO;', tokens, 'csharp')).toBe(false);
        expect(isBreakpointCandidate('using var file = Open();', tokens, 'csharp')).toBe(true);
        expect(isBreakpointCandidate('using (var file = Open()) {', tokens, 'csharp')).toBe(true);
    });
});
