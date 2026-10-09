import type { Param } from "./util";

export const phpImage = 'php:8.3-cli';

export const phpListNodeClass = `<?php
class ListNode {
    public $val = 0;
    public $next = null;
    public function __construct($val = 0, $next = null) {
        $this->val = $val;
        $this->next = $next;
    }
}
`;

export const phpTreeNodeClass = `<?php
class TreeNode {
    public $val = 0;
    public $left = null;
    public $right = null;
    public function __construct($val = 0, $left = null, $right = null) {
        $this->val = $val;
        $this->left = $left;
        $this->right = $right;
    }
}
`;

export const phpGraphNodeClass = `<?php
class GraphNode {
    public $val = 0;
    public $neighbors = [];
    public function __construct($val = 0, $neighbors = []) {
        $this->val = $val;
        $this->neighbors = $neighbors;
    }
}
`;

export const phpHelperMethods = `function display_output($x) {
    if ($x === null) return '[]';
    if (is_bool($x)) return $x ? 'true' : 'false';
    if (is_int($x)) return (string)$x;
    if (is_float($x)) {
        if (floor($x) == $x) return sprintf('%.1f', $x);
        return (string)$x;
    }
    if (is_string($x)) return $x;
    if (is_array($x)) {
        if (count($x) === 0) return '[]';
        // NOTE: strings are emitted raw (no quoting/escaping), matching the
        // Java reference display. The marker parses display output with a
        // quote-stripping splitter (no unescaping), so escaping here would
        // corrupt values containing backslashes/unicode/newlines.
        // The only exception is the empty (or whitespace-padded) string,
        // which needs double quotes to survive trimming/splitting.
        $parts = array_map('display_string_element', array_values($x));
        return '[' . implode(',', $parts) . ']';
    }
    if ($x instanceof ListNode) {
        $res = [];
        $cur = $x;
        while ($cur !== null) {
            $res[] = $cur->val;
            $cur = $cur->next;
        }
        return '[' . implode(',', $res) . ']';
    }
    if ($x instanceof TreeNode) {
        $out = [];
        $queue = [$x];
        while (count($queue) > 0) {
            $node = array_shift($queue);
            if ($node === null) {
                $out[] = null;
            } else {
                $out[] = $node->val;
                $queue[] = $node->left;
                $queue[] = $node->right;
            }
        }
        while (count($out) > 0 && end($out) === null) array_pop($out);
        $parts = array_map(function ($v) { return $v === null ? 'null' : (string)$v; }, $out);
        return '[' . implode(',', $parts) . ']';
    }
    if ($x instanceof GraphNode) {
        $adj = [];
        $visited = [];
        $queue = [$x];
        $visited[spl_object_id($x)] = true;
        while (count($queue) > 0) {
            $cur = array_shift($queue);
            $neighbors = [];
            foreach ($cur->neighbors as $n) {
                $neighbors[] = $n->val;
                if (!isset($visited[spl_object_id($n)])) {
                    $visited[spl_object_id($n)] = true;
                    $queue[] = $n;
                }
            }
            $adj[$cur->val] = $neighbors;
        }
        ksort($adj);
        $parts = [];
        foreach ($adj as $list) {
            $parts[] = '[' . implode(',', $list) . ']';
        }
        return '[' . implode(',', $parts) . ']';
    }
    return (string)$x;
}

function display_string_element($v) {
    if (is_string($v) && ($v === '' || $v !== trim($v))) {
        return '"' . $v . '"';
    }
    return display_output($v);
}

function to_int_array($s) {    if (is_array($s)) return array_values($s);
    $s = trim((string)$s);
    if ($s === '' || $s === '[]') return [];
    $dec = json_decode($s, true);
    if (is_array($dec)) return array_values($dec);
    $inner = trim($s, '[]');
    if ($inner === '') return [];
    return array_map('intval', array_map('trim', explode(',', $inner)));
}

function to_list_node($s) {
    $arr = to_int_array($s);
    if (count($arr) === 0) return null;
    $dummy = new ListNode(0);
    $cur = $dummy;
    foreach ($arr as $v) {
        $cur->next = new ListNode((int)$v);
        $cur = $cur->next;
    }
    return $dummy->next;
}

function add_cycle($head, $pos) {
    if ($pos < 0 || $head === null) return $head;
    $cur = $head;
    $cycleNode = null;
    $i = 0;
    while ($cur !== null) {
        if ($i == $pos) $cycleNode = $cur;
        if ($cur->next === null) break;
        $cur = $cur->next;
        $i++;
    }
    if ($cycleNode !== null) $cur->next = $cycleNode;
    return $head;
}

function to_list_node_array($s) {
    if (is_array($s)) {
        return array_map('to_list_node', $s);
    }
    $s = trim((string)$s);
    if ($s === '' || $s === '[]') return [];
    $dec = json_decode($s, true);
    if (!is_array($dec)) return [];
    return array_map('to_list_node', $dec);
}

function to_tree_node($s) {
    if (is_array($s)) {
        $arr = array_values($s);
    } else {
        $t = trim((string)$s);
        if ($t === '' || $t === '[]') return null;
        $arr = json_decode($t, true);
        if (!is_array($arr) || count($arr) === 0 || $arr[0] === null) return null;
        $arr = array_values($arr);
    }
    if (count($arr) === 0 || $arr[0] === null) return null;
    $root = new TreeNode($arr[0]);
    $queue = [$root];
    $i = 1;
    $n = count($arr);
    while (count($queue) > 0 && $i < $n) {
        $node = array_shift($queue);
        if ($arr[$i] !== null) {
            $node->left = new TreeNode($arr[$i]);
            $queue[] = $node->left;
        }
        $i++;
        if ($i >= $n) break;
        if ($arr[$i] !== null) {
            $node->right = new TreeNode($arr[$i]);
            $queue[] = $node->right;
        }
        $i++;
    }
    return $root;
}

function to_graph_node($s) {
    $adj = to_int_array_2d($s);
    if (count($adj) === 0) return null;
    $nodes = [];
    foreach ($adj as $i => $_) {
        $nodes[$i] = new GraphNode($i + 1);
    }
    foreach ($adj as $i => $neighbors) {
        foreach ($neighbors as $nb) {
            $nodes[$i]->neighbors[] = $nodes[$nb - 1];
        }
    }
    return $nodes[0];
}

function to_int_array_2d($s) {
    if (is_array($s)) {
        return array_map(function ($row) { return array_values((array)$row); }, array_values($s));
    }
    $s = trim((string)$s);
    if ($s === '' || $s === '[]') return [];
    $dec = json_decode($s, true);
    if (is_array($dec)) {
        return array_map(function ($row) { return array_values((array)$row); }, array_values($dec));
    }
    return [];
}

function to_string_array_inner($s) {
    if (is_array($s)) return array_values($s);
    $s = trim((string)$s);
    if ($s === '' || $s === '[]') return [];
    $dec = json_decode($s, true);
    if (is_array($dec)) return array_values($dec);
    return [];
}

// Faithful port of the marker's to_string_list (javaUtil.ts): strips outer
// brackets, splits top-level commas quote-aware, trims tokens, strips ONE
// wrapping quote pair. Critically it performs NO unescaping, so inputs must
// be passed verbatim (see phpVerbatim) to match the marker's transformation.
function to_string_list_exact($s) {
    if (is_array($s)) return array_values($s);
    $t = trim((string)$s);
    if ($t === '' || $t === '[]') return [];
    if (strlen($t) > 0 && $t[0] === '[') $t = substr($t, 1);
    if (strlen($t) > 0 && $t[strlen($t) - 1] === ']') $t = substr($t, 0, -1);
    $res = [];
    $cur = '';
    $depth = 0;
    $inDQ = false;
    $inSQ = false;
    $n = strlen($t);
    for ($i = 0; $i < $n; $i++) {
        $c = $t[$i];
        if ($c === '"' && !$inSQ) { $inDQ = !$inDQ; continue; }
        if ($c === "'" && !$inDQ) { $inSQ = !$inSQ; continue; }
        if ($c === '[') $depth++;
        elseif ($c === ']') $depth--;
        if ($c === ',' && !$inDQ && !$inSQ && $depth === 0) {
            $res[] = trim($cur);
            $cur = '';
        } else {
            $cur .= $c;
        }
    }
    $res[] = trim($cur);
    foreach ($res as $k => $x) {
        if (strlen($x) >= 2 && (($x[0] === '"' && $x[strlen($x) - 1] === '"') || ($x[0] === "'" && $x[strlen($x) - 1] === "'"))) {
            $res[$k] = substr($x, 1, -1);
        }
    }
    return array_values($res);
}

// Faithful port of the marker's to_string_list_2d.
function to_string_list_2d_exact($s) {
    if (is_array($s)) {
        return array_map(function ($row) { return to_string_list_exact(is_array($row) ? $row : (string)$row); }, array_values($s));
    }
    $t = trim((string)$s);
    if ($t === '' || $t === '[]') return [];
    if (strlen($t) > 0 && $t[0] === '[') $t = substr($t, 1);
    if (strlen($t) > 0 && $t[strlen($t) - 1] === ']') $t = substr($t, 0, -1);
    $res = [];
    $depth = 0;
    $start = 0;
    $n = strlen($t);
    for ($i = 0; $i < $n; $i++) {
        $c = $t[$i];
        if ($c === '[') $depth++;
        if ($c === ']') $depth--;
        if ($depth === 0 && $c === ',') {
            $part = trim(substr($t, $start, $i - $start));
            if ($part !== '') $res[] = to_string_list_exact($part);
            $start = $i + 1;
        }
    }
    $last = trim(substr($t, $start));
    if ($last !== '') $res[] = to_string_list_exact($last);
    return $res;
}

// Faithful port of the marker's to_char_array_2d (via to_string_list).
function to_char_array_2d_exact($s) {
    $rows = to_string_list_2d_exact($s);
    $out = [];
    foreach ($rows as $row) {
        $chars = [];
        foreach ($row as $tok) {
            $chars[] = $tok !== '' ? $tok[0] : "\0";
        }
        $out[] = $chars;
    }
    return $out;
}
`;

function phpEscapeString(str: any): string {
    if (str === null || str === undefined) return "''";
    const escaped = String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
    return `'${escaped}'`;
}

/** Normalize a test-case value that should be an array literal into a valid PHP expression.
 *  Only safe for int/null data (no backslash semantics); string data must use
 *  phpVerbatim + the exact-splitter runtime helpers instead. */
function phpArrayLiteral(val: any): string {
    if (Array.isArray(val)) {
        try { return JSON.stringify(val); } catch { return '[]'; }
    }
    const s = String(val ?? '[]');
    try {
        const parsed = JSON.parse(s);
        return JSON.stringify(parsed);
    } catch {
        return s;
    }
}

/** Pass test-case text through verbatim (no JSON normalization): the marker's
 *  string parsers perform no unescaping, so removing a JSON level here would
 *  corrupt values containing backslashes. Emitted single-quoted, which only
 *  treats backslash and single-quote specially. */
function phpVerbatim(val: any): string {
    if (Array.isArray(val)) {
        try { return JSON.stringify(val); } catch { return '[]'; }
    }
    return String(val ?? '');
}

export function phpGetFullParam(params: Param[], tc: any): string {
    const parts: string[] = [];
    for (const p of params) {
        const val = tc[p.name];
        if (p.type === 'string') {
            parts.push(phpEscapeString(val));
        } else if (p.type === 'int') {
            parts.push(`${val}`);
        } else if (p.type === 'boolean') {
            parts.push(String(val) === 'true' ? 'true' : 'false');
        } else if (
            p.type === 'int_array' || p.type === 'int_list' ||
            p.type === 'int_array_2d' || p.type === 'int_matrix' || p.type === 'int_list_2d'
        ) {
            parts.push(phpArrayLiteral(val));
        } else if (p.type === 'string_array' || p.type === 'string_list') {
            parts.push(`to_string_list_exact(${phpEscapeString(phpVerbatim(val))})`);
        } else if (p.type === 'string_list_2d') {
            parts.push(`to_string_list_2d_exact(${phpEscapeString(phpVerbatim(val))})`);
        } else if (p.type === 'char_array_2d') {
            parts.push(`to_char_array_2d_exact(${phpEscapeString(phpVerbatim(val))})`);
        } else if (p.type === 'list_node') {
            parts.push(`add_cycle(to_list_node(${phpEscapeString(typeof val === 'string' ? val : JSON.stringify(val ?? '[]'))}), ${tc.pos !== undefined ? tc.pos : -1})`);
        } else if (p.type === 'list_node_array') {
            parts.push(`to_list_node_array(${phpEscapeString(typeof val === 'string' ? val : JSON.stringify(val ?? '[]'))})`);
        } else if (p.type === 'tree_node') {
            parts.push(`to_tree_node(${phpEscapeString(typeof val === 'string' ? val : JSON.stringify(val ?? '[]'))})`);
        } else if (p.type === 'graph_node') {
            parts.push(`to_graph_node(${phpEscapeString(typeof val === 'string' ? val : JSON.stringify(val ?? '[]'))})`);
        } else {
            parts.push(phpEscapeString(String(val ?? '')));
        }
    }
    return parts.join(', ');
}

export function phpGetTypeImports(params: Param[], outputType?: string): string {
    const types = new Set<string>();
    for (const p of params) types.add(p.type);
    if (outputType) types.add(outputType);
    const imports: string[] = [];
    if (types.has('list_node') || types.has('list_node_array')) imports.push("require_once 'ListNode.php';");
    if (types.has('tree_node')) imports.push("require_once 'TreeNode.php';");
    if (types.has('graph_node')) imports.push("require_once 'GraphNode.php';");
    return imports.join('\n');
}

export function generatePhpRunner(functionName: string, params: Param[], testCases: any[], outputType: string, checkGraphClone?: boolean, className?: string): string {
    const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');

    const buildCall = (tc: any, idx: number, invoke: (args: string) => string) => {
        if (hasGraphNode) {
            const decls: string[] = [];
            const args: string[] = [];
            params.forEach((p, i) => {
                const val = tc[p.name];
                const varName = `$__input${idx}_${i}`;
                if (p.type === 'graph_node') {
                    decls.push(`${varName} = to_graph_node(${phpEscapeString(typeof val === 'string' ? val : JSON.stringify(val ?? '[]'))});`);
                    args.push(varName);
                } else {
                    args.push(phpGetFullParam([p], tc));
                }
            });
            const graphArgIdx = params.findIndex(p => p.type === 'graph_node');
            const graphArg = args[graphArgIdx];
            return [
                ...decls,
                `$__t0 = hrtime(true);`,
                `$__res = ${invoke(args.join(', '))};`,
                `$__dt = hrtime(true) - $__t0;`,
                `echo ':::TIME:::' . $__dt . "\\n";`,
                `if (${graphArg} !== null && $__res === ${graphArg}) {`,
                `    echo ":::ERROR:::invalid clone - same object\\n";`,
                `} else {`,
                `    echo ':::RESULT:::' . display_output($__res) . "\\n";`,
                `}`,
                `echo "---\\n";`
            ].join('\n');
        }
        const fullParam = phpGetFullParam(params, tc);
        return `$__t0 = hrtime(true);\n$__res = ${invoke(fullParam)};\n$__dt = hrtime(true) - $__t0;\necho ':::TIME:::' . $__dt . "\\n";\necho ':::RESULT:::' . display_output($__res) . "\\n";\necho "---\\n";`;
    };

    if (className) {
        const calls = testCases.map((tc, idx) => buildCall(tc, idx, (args) => `$sol->solve(${args})`)).join('\n');
        return `<?php
require_once 'ListNode.php';
require_once 'TreeNode.php';
require_once 'GraphNode.php';
require_once 'Solution.php';

${phpHelperMethods}
$sol = new Solution();
${calls}
`;
    }

    const calls = testCases.map((tc, idx) => buildCall(tc, idx, (args) => `$sol->${functionName}(${args})`)).join('\n');
    return `<?php
require_once 'ListNode.php';
require_once 'TreeNode.php';
require_once 'GraphNode.php';
require_once 'Solution.php';

${phpHelperMethods}
$sol = new Solution();
${calls}
`;
}

export function generatePhpClassSolution(className: string, params?: Param[], outputType?: string): string {
    if (params && params.length > 0 && params[0]?.type === 'tree_node') {
        return `<?php
require_once 'TreeNode.php';
require_once '${className}.php';

class Solution {
    public function solve($root) {
        $ser = new ${className}();
        $deser = new ${className}();
        return $deser->deserialize($ser->serialize($root));
    }
}
`;
    }
    if (params && params.length === 1 && params[0]?.type === 'string_array') {
        return `<?php
require_once '${className}.php';

class Solution {
    public function solve($strs) {
        $codec = new ${className}();
        $encoded = $codec->encode($strs);
        return $codec->decode($encoded);
    }
}
`;
    }
    if (params && params.length > 1 && params[1]?.type === 'string_array') {
        return `<?php
require_once '${className}.php';

class Solution {
    public function solve($operations, $values) {
        $result = [];
        $obj = null;
        foreach ($operations as $i => $op) {
            if ($op === '${className}') {
                $obj = new ${className}();
                $result[] = 'null';
            } elseif ($op === 'addWord') {
                $obj->addWord($values[$i]);
                $result[] = 'null';
            } elseif ($op === 'insert') {
                $obj->insert($values[$i]);
                $result[] = 'null';
            } elseif ($op === 'search') {
                $result[] = $obj->search($values[$i]) ? 'true' : 'false';
            } elseif ($op === 'startsWith') {
                $result[] = $obj->startsWith($values[$i]) ? 'true' : 'false';
            }
        }
        return $result;
    }
}
`;
    }
    return `<?php
require_once '${className}.php';

class Solution {
    public function solve($operations, $values) {
        $result = [];
        $obj = null;
        foreach ($operations as $i => $op) {
            if ($op === '${className}') {
                $obj = new ${className}();
                $result[] = 'null';
            } elseif ($op === 'addNum') {
                $obj->addNum($values[$i][0]);
                $result[] = 'null';
            } elseif ($op === 'findMedian') {
                $med = $obj->findMedian();
                if (floor($med) == $med) {
                    $result[] = sprintf('%.1f', $med);
                } else {
                    $result[] = (string)$med;
                }
            }
        }
        return $result;
    }
}
`;
}

function phpDocType(t: string): string {
    switch (t) {
        case 'int': return 'int';
        case 'string': return 'string';
        case 'boolean': return 'bool';
        case 'int_array':
        case 'int_list': return 'int[]';
        case 'int_array_2d':
        case 'int_matrix':
        case 'int_list_2d': return 'int[][]';
        case 'string_array':
        case 'string_list': return 'string[]';
        case 'string_list_2d': return 'string[][]';
        case 'char_array_2d': return 'string[][]';
        case 'list_node': return 'ListNode|null';
        case 'list_node_array': return 'array';
        case 'tree_node': return 'TreeNode|null';
        case 'graph_node': return 'GraphNode|null';
        default: return 'mixed';
    }
}

export function generatePhpStarterCode(functionName: string, params: Param[], outputType: string, classProblem?: any): string {
    if (classProblem) {
        const className = classProblem.userClassName || 'MedianFinder';
        if (params && params.length > 0 && params[0]?.type === 'tree_node') {
            return `<?php
class ${className} {
    /**
     * @param TreeNode|null $root
     * @return string
     */
    public function serialize($root) {

    }

    /**
     * @param string $data
     * @return TreeNode|null
     */
    public function deserialize($data) {

    }
}`;
        }
        if (params && params.length === 1 && params[0]?.type === 'string_array') {
            return `<?php
class ${className} {
    /**
     * @param string[] $strs
     * @return string
     */
    public function encode($strs) {

    }

    /**
     * @param string $s
     * @return string[]
     */
    public function decode($s) {

    }
}`;
        }
        if (params && params.length > 1 && params[1]?.type === 'string_array') {
            // Trie / WordDictionary shape
            const isWordDictionary = className === 'WordDictionary';
            const addMethod = isWordDictionary ? 'addWord' : 'insert';
            return `<?php
class ${className} {
    public function ${addMethod}($word) {

    }

    public function search($word) {

    }

    public function startsWith($prefix) {

    }
}`;
        }
        return `<?php
class ${className} {
    public function addNum($num) {

    }

    public function findMedian() {

    }
}`;
    }

    const docParams = params.map(p => `     * @param ${phpDocType(p.type)} $${p.name}`).join('\n');
    const signatureParams = params.map(p => `$${p.name}`).join(', ');
    // NOTE: the leading <?php tag is required for Monaco syntax highlighting
    // (PHP is only tokenized inside <?php blocks). PhpRunner strips it
    // server-side before prefixing its own requires.
    return `<?php
class Solution {
    /**
${docParams}
     * @return ${phpDocType(outputType)}
     */
    public function ${functionName}(${signatureParams}) {

    }
}`;
}
