import { describe, expect, it } from 'vitest';

import { PHP_DEBUG_SUPPORT, generatePhpDebugWrapper, phpOriginalForLint } from './PhpDebugDriver';

describe('PhpDebugDriver', () => {
    it('exposes a debug runtime with init/check/pause/eval', () => {
        expect(PHP_DEBUG_SUPPORT).toContain('function __cjd_init');
        expect(PHP_DEBUG_SUPPORT).toContain('function __cjd_check');
        expect(PHP_DEBUG_SUPPORT).toContain('function __cjd_pause');
        expect(PHP_DEBUG_SUPPORT).toContain('function __cjd_eval');
    });

    it('instruments flat playground code with original line numbers', () => {
        const code = `<?php\n$a = 5;\n$b = 10;\n$c = $a + $b;\necho "sum=$c\\n";\n`;
        const out = generatePhpDebugWrapper(code, [4]);
        expect(out).toContain(`\\__cjd_init('4');`);
        expect(out).toContain(`\\__cjd_check(2, $__cjd_v);`);
        expect(out).toContain(`\\__cjd_check(4, $__cjd_v);`);
        expect(out).toContain(`$__cjd_v["c"] = $c ?? null;`);
    });

    it('keeps tagless solution line numbers stable', () => {
        const code = `class Solution {\n    public function twoSum($nums, $target) {\n        $map = [];\n        return [];\n    }\n}\n`;
        const out = generatePhpDebugWrapper(code, [3]);
        expect(out.startsWith('<?php\n')).toBe(true);
        expect(out).toContain(`\\__cjd_check(3, $__cjd_v);`);
        // Class declaration itself is never instrumented
        expect(out).not.toContain(`\\__cjd_check(1, $__cjd_v);`);
        // Params are captured at method entry
        expect(out).toContain(`$__cjd_v["nums"] = $nums ?? null;`);
    });

    it('never instruments standalone else/catch lines (must follow `}` directly)', () => {
        const code = [
            '<?php',
            'if ($a) {',
            '    foo();',
            '}',
            'else {',
            '    bar();',
            '}',
            'try {',
            '    baz();',
            '}',
            'catch (Exception $e) {',
            '    qux();',
            '}'
        ].join('\n');
        const out = generatePhpDebugWrapper(code, [3, 6, 9, 12]);
        // Standalone `else {` / `catch ... {` must stay pristine...
        expect(out).not.toMatch(/__cjd_check\(5,/);
        expect(out).not.toMatch(/__cjd_check\(11,/);
        // ...while the surrounding bodies are instrumented.
        expect(out).toMatch(/__cjd_check\(3,/);
        expect(out).toMatch(/__cjd_check\(6,/);
        expect(out).toMatch(/__cjd_check\(9,/);
        expect(out).toMatch(/__cjd_check\(12,/);
    });

    it('instruments combined `} else {` lines (check lands inside the block)', () => {
        const code = ['<?php', 'if ($a) {', '    foo();', '} else {', '    bar();', '}'].join('\n');
        const out = generatePhpDebugWrapper(code, [4]);
        expect(out).toMatch(/__cjd_check\(4,/);
    });

    it('handles a leading tag on its own line without shifting numbers', () => {
        const code = `<?php\n$x = 1;\n$y = 2;\n`;
        const out = generatePhpDebugWrapper(code, [2, 3]);
        expect(out).toContain(`\\__cjd_check(2, $__cjd_v);`);
        expect(out).toContain(`\\__cjd_check(3, $__cjd_v);`);
    });

    it('skips continuation lines of multiline statements', () => {
        const code = [
            '<?php',
            '$r = foo($a,',
            '    $b);',
            '$c = 1;'
        ].join('\n');
        const out = generatePhpDebugWrapper(code, [2, 3, 4]);
        // Line 2 starts the statement: instrumented. Line 3 continues it:
        // no Check (would split the expression). Line 4 is fresh code.
        expect(out).toMatch(/__cjd_check\(2,/);
        expect(out).not.toMatch(/__cjd_check\(3,/);
        expect(out).toMatch(/__cjd_check\(4,/);
        // No capture assignments may split the open statement either.
        expect(out).toMatch(/\$r = foo\(\$a,\n    \$b\);/);
    });

    it('collects multiline function signature params', () => {
        const code = [
            '<?php',
            'function add(',
            '    $a,',
            '    $b',
            ') {',
            '    return $a + $b;',
            '}'
        ].join('\n');
        const out = generatePhpDebugWrapper(code, [6]);
        expect(out).toContain(`$__cjd_v["a"] = $a ?? null;`);
        expect(out).toContain(`$__cjd_v["b"] = $b ?? null;`);
        expect(out).toMatch(/__cjd_check\(6,/);
    });

    it('normalizes tagless code for lint without shifting lines', () => {
        expect(phpOriginalForLint('class A {}')).toBe('<?php class A {}');
        expect(phpOriginalForLint("<?php\n$x = ;")).toBe("<?php\n$x = ;");
    });
});
