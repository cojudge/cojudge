import { describe, expect, it } from 'vitest';
import { canInspectToken, isBreakpointCandidate, phpHoverVariable } from './debugSource';

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

    it('rejects PHP lines the debug driver never instruments', () => {
        const tokens = [{ offset: 0, type: '' }];
        expect(isBreakpointCandidate("require_once 'ListNode.php';", tokens, 'phpcode')).toBe(false);
        expect(isBreakpointCandidate('use Foo\\Bar;', tokens, 'phpcode')).toBe(false);
        expect(isBreakpointCandidate('namespace Foo;', tokens, 'php')).toBe(false);
        expect(isBreakpointCandidate('public function twoSum($nums) {', tokens, 'phpcode')).toBe(false);
        expect(isBreakpointCandidate('$f = function ($x) { return $x; };', tokens, 'phpcode')).toBe(false);
        expect(isBreakpointCandidate('$map = [];', tokens, 'phpcode')).toBe(true);
        expect(isBreakpointCandidate('if (isset($m[$k])) return 1;', tokens, 'php')).toBe(true);
    });

    it('expands hovered PHP words back to valid expressions', () => {
        // `getWordAtPosition` on `$nums` yields `nums` at columns 2-6.
        expect(phpHoverVariable('    $nums = [1];', 6, 10, 'nums')).toBe('$nums');
        // Hovering `val` in `$root->val` yields the property chain.
        expect(phpHoverVariable('    return $root->val;', 19, 22, 'val')).toBe('$root->val');
        // No `$` in scope: fall back to the word itself.
        expect(phpHoverVariable('    return count;', 12, 17, 'count')).toBe('count');
    });
});
