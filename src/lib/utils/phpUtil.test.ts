import { describe, expect, it } from 'vitest';

import {
    generatePhpRunner,
    generatePhpStarterCode,
    phpGetFullParam,
    phpGetTypeImports,
    phpImage
} from './phpUtil';

describe('phpUtil', () => {
    it('exposes the expected Docker image', () => {
        expect(phpImage).toBe('php:8.3-cli');
    });

    it('serializes int params and arrays as PHP literals', () => {
        const params = [
            { name: 'nums', type: 'int_array' },
            { name: 'target', type: 'int' }
        ];
        expect(phpGetFullParam(params as any, { nums: '[2,7,11,15]', target: 9 })).toBe(
            '[2,7,11,15], 9'
        );
        expect(phpGetFullParam(params as any, { nums: [2, 7, 11, 15], target: 9 })).toBe(
            '[2,7,11,15], 9'
        );
    });

    it('escapes string params as single-quoted PHP strings', () => {
        const params = [{ name: 's', type: 'string' }];
        expect(phpGetFullParam(params as any, { s: "o'clock" })).toBe("'o\\'clock'");
    });

    it('wraps node params in converter calls', () => {
        expect(
            phpGetFullParam([{ name: 'l1', type: 'list_node' }] as any, { l1: '[2,4,3]' })
        ).toBe("add_cycle(to_list_node('[2,4,3]'), -1)");
        expect(
            phpGetFullParam([{ name: 'root', type: 'tree_node' }] as any, {
                root: '[1,null,2]'
            })
        ).toBe("to_tree_node('[1,null,2]')");
    });

    it('imports node classes only when needed', () => {
        expect(phpGetTypeImports([{ name: 'nums', type: 'int_array' }], 'int_array')).toBe('');
        expect(phpGetTypeImports([{ name: 'root', type: 'tree_node' }], 'tree_node')).toContain(
            "require_once 'TreeNode.php';"
        );
    });

    it('generates a runner that invokes the Solution method per test case', () => {
        const code = generatePhpRunner(
            'twoSum',
            [
                { name: 'nums', type: 'int_array' },
                { name: 'target', type: 'int' }
            ],
            [{ nums: '[2,7,11,15]', target: 9 }],
            'int_array'
        );
        expect(code).toContain('$sol->twoSum([2,7,11,15], 9)');
        expect(code).toContain(':::RESULT:::');
        expect(code).toContain("require_once 'Solution.php';");
    });

    it('generates starter code with the solution method signature', () => {
        const starter = generatePhpStarterCode(
            'twoSum',
            [
                { name: 'nums', type: 'int_array' },
                { name: 'target', type: 'int' }
            ],
            'int_array'
        );
        expect(starter).toContain('class Solution');
        expect(starter).toContain('public function twoSum($nums, $target)');
    });

    it('generates class-problem starters for user classes', () => {
        const starter = generatePhpStarterCode(
            'solve',
            [
                { name: 'operations', type: 'string_array' },
                { name: 'values', type: 'string_array' }
            ],
            'string_list',
            { userClassName: 'Trie' }
        );
        expect(starter).toContain('class Trie');
        expect(starter).toContain('public function insert($word)');
    });
});
