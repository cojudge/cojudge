import type { Param } from "./util";
import type { InteractiveConfig } from "./interactiveUtil";
import { interactiveBudget, isTranscriptKind, judgeClassForKind } from "./interactiveUtil";

export const tsImage = 'node:22-alpine';

export const tsListNodeClass = `
export class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val ?? 0;
        this.next = next ?? null;
    }
}
`;

export const tsTreeNodeClass = `
export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val ?? 0;
        this.left = left ?? null;
        this.right = right ?? null;
    }
}
`;

export const tsGraphNodeClass = `
export class GraphNode {
    val: number;
    neighbors: GraphNode[];
    constructor(val?: number, neighbors?: GraphNode[]) {
        this.val = val ?? 0;
        this.neighbors = neighbors ?? [];
    }
}
`;

export const tsHelperMethods = `
function displayOutput(x: any): string {
    if (x === null || x === undefined) return "[]";
    if (typeof x === 'boolean') return x ? 'true' : 'false';
    if (typeof x === 'number') return x.toString();
    if (typeof x === 'string') return x;
    if (Array.isArray(x)) {
        if (x.length === 0) return "[]";
        if (typeof x[0] === 'string') {
            return '[' + x.map((s: string) => '"' + s + '"').join(',') + ']';
        }
        return '[' + x.map((item: any) => displayOutput(item)).join(',') + ']';
    }
    if (x instanceof ListNode) {
        const res: number[] = [];
        let cur: ListNode | null = x;
        while (cur) {
            res.push(cur.val);
            cur = cur.next;
        }
        return '[' + res.join(',') + ']';
    }
    if (x instanceof TreeNode) {
        const out: (number | null)[] = [];
        const queue: (TreeNode | null)[] = [x];
        while (queue.length > 0) {
            const node = queue.shift()!;
            if (node === null) {
                out.push(null);
            } else {
                out.push(node.val);
                queue.push(node.left);
                queue.push(node.right);
            }
        }
        while (out.length > 0 && out[out.length - 1] === null) out.pop();
        return '[' + out.map(v => v === null ? 'null' : v.toString()).join(',') + ']';
    }
    if (x instanceof GraphNode) {
        const adj: Map<number, number[]> = new Map();
        const visited: Set<GraphNode> = new Set();
        const queue: GraphNode[] = [x];
        visited.add(x);
        while (queue.length > 0) {
            const cur = queue.shift()!;
            const neighbors: number[] = [];
            for (const n of cur.neighbors) {
                neighbors.push(n.val);
                if (!visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                }
            }
            adj.set(cur.val, neighbors);
        }
        const keys = Array.from(adj.keys()).sort((a, b) => a - b);
        return '[' + keys.map(k => '[' + adj.get(k)!.join(',') + ']').join(',') + ']';
    }
    return JSON.stringify(x);
}

function toIntArray(s: string): number[] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toIntArray2d(s: string): number[][] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toStringArray(s: string): string[] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toStringList2d(s: string): string[][] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toCharArray(s: string): string[] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toCharArray2d(s: string): string[][] {
    if (!s || s === '[]') return [];
    return JSON.parse(s);
}

function toListNode(s: any): ListNode | null {
    const arr = Array.isArray(s) ? s : toIntArray(s);
    if (!arr || arr.length === 0) return null;
    const dummy = new ListNode(0);
    let cur: ListNode = dummy;
    for (let i = 0; i < arr.length; i++) {
        cur.next = new ListNode(arr[i]);
        cur = cur.next;
    }
    return dummy.next;
}

function addCycle(head: ListNode | null, pos: number): ListNode | null {
    if (pos < 0 || head === null) return head;
    let cur: ListNode | null = head;
    let cycleNode: ListNode | null = null;
    let i = 0;
    while (cur !== null) {
        if (i === pos) cycleNode = cur;
        if (cur.next === null) break;
        cur = cur.next;
        i++;
    }
    if (cycleNode !== null && cur !== null) {
        cur.next = cycleNode;
    }
    return head;
}

function toListNodeArray(s: any): (ListNode | null)[] {
    if (!s) return [];
    if (Array.isArray(s)) return s.map((item: string) => toListNode(item));
    if (s === '[]') return [];
    const arr = JSON.parse(s);
    return arr.map((item: string) => toListNode(item));
}

function toTreeNode(s: any): TreeNode | null {
    if (!s) return null;
    const arr = Array.isArray(s) ? s : (s === '[]' ? [] : JSON.parse(s));
    if (arr.length === 0 || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue: (TreeNode | null)[] = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift()!;
        if (arr[i] !== null && arr[i] !== undefined) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i >= arr.length) break;
        if (arr[i] !== null && arr[i] !== undefined) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function toGraphNode(s: any): GraphNode | null {
    const adj = Array.isArray(s) ? s : toIntArray2d(s);
    if (!adj || adj.length === 0) return null;
    const nodes: GraphNode[] = adj.map((_, i) => new GraphNode(i + 1));
    for (let i = 0; i < adj.length; i++) {
        for (const nb of adj[i]) {
            nodes[i].neighbors.push(nodes[nb - 1]);
        }
    }
    return nodes[0];
}
`;

function tsEscapeString(str: string): string {
    if (str === null || str === undefined) return "''";
    const escaped = String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    return `'${escaped}'`;
}

export function tsGetFullParam(params: Param[], tc: any): string {
    const parts: string[] = [];
    for (const p of params) {
        const val = tc[p.name];
        if (p.type === 'string') {
            parts.push(tsEscapeString(val));
        } else if (p.type === 'int') {
            parts.push(`${val}`);
        } else if (p.type === 'boolean') {
            parts.push(String(val) === 'true' ? 'true' : 'false');
        } else if (p.type === 'int_array' || p.type === 'int_list') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(strVal);
        } else if (p.type === 'int_array_2d' || p.type === 'int_matrix') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(strVal);
        } else if (p.type === 'string_array' || p.type === 'string_list') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]').replace(/\\/g, '\\\\');
            }
            parts.push(strVal);
        } else if (p.type === 'string_list_2d') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(strVal);
        } else if (p.type === 'char_array_2d') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(strVal);
        } else if (p.type === 'list_node') {
            let strVal: string;
            if (Array.isArray(val)) {
                strVal = JSON.stringify(val);
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`addCycle(toListNode(${strVal}), ${tc.pos !== undefined ? tc.pos : -1})`);
        } else if (p.type === 'list_node_array') {
            let strVal: string;
            if (Array.isArray(val)) {
                strVal = JSON.stringify(val);
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toListNodeArray(${strVal})`);
        } else if (p.type === 'tree_node') {
            let strVal: string;
            if (Array.isArray(val)) {
                strVal = JSON.stringify(val);
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toTreeNode(${strVal})`);
        } else if (p.type === 'graph_node') {
            let strVal: string;
            if (Array.isArray(val)) {
                strVal = JSON.stringify(val);
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toGraphNode(${strVal})`);
        } else {
            parts.push(tsEscapeString(String(val ?? '')));
        }
    }
    return parts.join(', ');
}

const TS_IMPORTS = `import { ListNode } from './ListNode';
import { TreeNode } from './TreeNode';
import { GraphNode } from './GraphNode';
`;

export function tsGetTypeImports(params: Param[], outputType?: string): string {
    const types = new Set<string>();
    for (const p of params) types.add(p.type);
    if (outputType) types.add(outputType);
    const imports: string[] = [];
    if (types.has('list_node') || types.has('list_node_array')) imports.push("import { ListNode } from './ListNode';");
    if (types.has('tree_node')) imports.push("import { TreeNode } from './TreeNode';");
    if (types.has('graph_node')) imports.push("import { GraphNode } from './GraphNode';");
    return imports.join('\n');
}

export function generateTypeScriptRunner(functionName: string, params: Param[], testCases: any[], outputType: string, checkGraphClone?: boolean, className?: string): string {
    const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');
    const imports = TS_IMPORTS;

    if (className) {
        const calls = testCases.map((tc, idx) => {
            if (hasGraphNode) {
                const decls: string[] = [];
                const args: string[] = [];
                params.forEach((p, i) => {
                    const val = tc[p.name];
                    const varName = `__input${idx}_${i}`;
                    if (p.type === 'graph_node') {
                        let gVal: string;
                        if (Array.isArray(val)) {
                            gVal = JSON.stringify(val);
                        } else {
                            gVal = JSON.stringify(String(val ?? '[]'));
                        }
                        decls.push(`const ${varName} = toGraphNode(${gVal});`);
                        args.push(varName);
                    } else {
                        args.push(tsGetFullParam([p], tc));
                    }
                });
                const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
                return [
                    ...decls,
                    `const __t0${idx} = process.hrtime.bigint();`,
                    `const __res${idx} = sol.solve(${args.join(', ')});`,
                    `const __t1${idx} = process.hrtime.bigint();`,
                    `console.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());`,
                    `if (${graphNodeArg} !== null && __res${idx} === ${graphNodeArg}) {`,
                    `    console.log(':::ERROR:::invalid clone - same object');`,
                    `} else {`,
                    `    console.log(':::RESULT:::' + displayOutput(__res${idx}));`,
                    `}`,
                    `console.log('---');`
                ].join('\n        ');
            }
            const fullParam = tsGetFullParam(params, tc);
            return `const __t0${idx} = process.hrtime.bigint();\nconst __res${idx} = sol.solve(${fullParam});\nconst __t1${idx} = process.hrtime.bigint();\nconsole.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());\nconsole.log(':::RESULT:::' + displayOutput(__res${idx}));\nconsole.log('---');`;
        }).join('\n        ');

        return `${imports}
${tsHelperMethods}

import { Solution } from './Solution';

const sol = new Solution();
${calls}
 `;
    }

    const calls = testCases.map((tc, idx) => {
        if (hasGraphNode) {
            const decls: string[] = [];
            const args: string[] = [];
            params.forEach((p, i) => {
                const val = tc[p.name];
                const varName = `__input${idx}_${i}`;
                if (p.type === 'graph_node') {
                    let gVal: string;
                    if (Array.isArray(val)) {
                        gVal = JSON.stringify(val);
                    } else {
                        gVal = JSON.stringify(String(val ?? '[]'));
                    }
                    decls.push(`const ${varName} = toGraphNode(${gVal});`);
                    args.push(varName);
                } else {
                    args.push(tsGetFullParam([p], tc));
                }
            });
            const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
            return [
                ...decls,
                `const __t0${idx} = process.hrtime.bigint();`,
                `const __res${idx} = ${functionName}(${args.join(', ')});`,
                `const __t1${idx} = process.hrtime.bigint();`,
                `console.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());`,
                `if (${graphNodeArg} !== null && __res${idx} === ${graphNodeArg}) {`,
                `    console.log(':::ERROR:::invalid clone - same object');`,
                `} else {`,
                `    console.log(':::RESULT:::' + displayOutput(__res${idx}));`,
                `}`,
                `console.log('---');`
            ].join('\n        ');
        }
        const fullParam = tsGetFullParam(params, tc);
        return `const __t0${idx} = process.hrtime.bigint();\nconst __res${idx} = ${functionName}(${fullParam});\nconst __t1${idx} = process.hrtime.bigint();\nconsole.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());\nconsole.log(':::RESULT:::' + displayOutput(__res${idx}));\nconsole.log('---');`;
    }).join('\n        ');

    return `${imports}
${tsHelperMethods}

import { ${functionName} } from './Solution';

${calls}
`;
}

export const tsMasterClass = `export class Master {
    private secret: string;
    private wordSet: Set<string>;
    private maxGuesses: number;
    guessCount = 0;
    solved = false;
    history: string[] = [];
    scores: number[] = [];
    constructor(secret: string, wordlist: string[], maxGuesses = 10) {
        this.secret = secret;
        this.wordSet = new Set(wordlist);
        this.maxGuesses = maxGuesses;
    }
    guess(word: string): number {
        this.guessCount++;
        this.history.push(word);
        let m: number;
        if (!this.wordSet.has(word)) {
            m = -1;
        } else {
            m = 0;
            const n = Math.min(word.length, this.secret.length);
            for (let i = 0; i < n; i++) if (word[i] === this.secret[i]) m++;
            if (word === this.secret) this.solved = true;
        }
        this.scores.push(m);
        return m;
    }
}
`;

export function generateTypeScriptInteractiveRunner(functionName: string, testCases: any[], interactive: InteractiveConfig): string {
    if (!isTranscriptKind(interactive.kind)) {
        return generateTypeScriptJudgeRunner(functionName, testCases, interactive);
    }
    const maxG = interactive.maxGuesses;
    const secretField = interactive.secretField;
    const calls = testCases.map((tc, idx) => {
        const rawWl = (tc as any)['wordlist'];
        let wlStr: string;
        if (Array.isArray(rawWl)) {
            try { wlStr = JSON.stringify(rawWl); } catch { wlStr = '[]'; }
        } else {
            wlStr = String(rawWl ?? '[]');
        }
        const rawSec = String((tc as any)[secretField] ?? '');
        const escSec = rawSec.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `const __wl${idx}: string[] = ${wlStr};
const __sec${idx} = '${escSec}';
const __m${idx} = new Master(__sec${idx}, __wl${idx}, ${maxG});
const __t0${idx} = process.hrtime.bigint();
try { ${functionName}(__wl${idx}, __m${idx}); } catch (__e: any) { console.log('ERROR: ' + (__e?.message ?? __e)); }
const __t1${idx} = process.hrtime.bigint();
console.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());
for (let __k${idx} = 0; __k${idx} < __m${idx}.history.length; __k${idx}++) {
    console.log('guess #' + (__k${idx}+1) + ': ' + __m${idx}.history[__k${idx}] + ' -> ' + __m${idx}.scores[__k${idx}]);
}
const __tr${idx} = (__m${idx}.solved && __m${idx}.guessCount <= ${maxG}) ? ('solved:' + __m${idx}.guessCount) : ('failed:' + __m${idx}.guessCount);
console.log(':::RESULT:::' + __tr${idx});
console.log('---');`;
    }).join('\n');

    return `${tsHelperMethods}

import { Master } from './Master';
import { ${functionName} } from './Solution';

${calls}
`;
}

export function generateTypeScriptStarterCode(functionName: string, params: Param[], outputType: string, classProblem?: any): string {
    const typeImports = tsGetTypeImports(params, outputType);

    if (classProblem) {
        const className = classProblem.userClassName || 'MedianFinder';
        if (params && params.length > 0 && params[0]?.type === 'tree_node') {
            return `${typeImports}
export class ${className} {
    serialize(root: TreeNode | null): string {
        
    }

    deserialize(data: string): TreeNode | null {
        
    }
}`;
        }
        if (params && params.length === 1 && params[0]?.type === 'string_array') {
            return `${typeImports}
export class ${className} {
    encode(strs: string[]): string {
        
    }

    decode(s: string): string[] {
        
    }
}`;
        }
        return `${typeImports}
export class ${className} {
    addNum(num: number): void {
        
    }

    findMedian(): number {
        return 0;
    }
}`;
    }

    function tsType(t: string): string {
        switch (t) {
            case 'int': return 'number';
            case 'string': return 'string';
            case 'boolean': return 'boolean';
            case 'int_array': return 'number[]';
            case 'int_array_2d':
            case 'int_matrix': return 'number[][]';
            case 'string_array':
            case 'string_list': return 'string[]';
            case 'string_list_2d': return 'string[][]';
            case 'char_array_2d': return 'string[][]';
            case 'list_node': return 'ListNode | null';
            case 'list_node_array': return '(ListNode | null)[]';
            case 'tree_node': return 'TreeNode | null';
            case 'graph_node': return 'GraphNode | null';
            default: return 'any';
        }
    }

    const paramStrs = params.map(p => `${p.name}: ${tsType(p.type)}`);
    const returnType = tsType(outputType);

    const header = typeImports ? `${typeImports}\n` : '';
    return `${header}export function ${functionName}(${paramStrs.join(', ')}): ${returnType} {
    
}`;
}

export const tsGuessGameClass = `export class GuessGame {
    private pick: number;
    callCount = 0;
    history: number[] = [];
    scores: number[] = [];
    constructor(pick: number) { this.pick = pick; }
    guess(num: number): number {
        this.callCount++;
        this.history.push(num);
        let r: number;
        if (num > this.pick) r = -1;
        else if (num < this.pick) r = 1;
        else r = 0;
        this.scores.push(r);
        return r;
    }
}
`;

export const tsVersionControlClass = `export class VersionControl {
    private bad: number;
    callCount = 0;
    history: number[] = [];
    scores: boolean[] = [];
    constructor(bad: number) { this.bad = bad; }
    isBadVersion(version: number): boolean {
        this.callCount++;
        this.history.push(version);
        const r = version >= this.bad;
        this.scores.push(r);
        return r;
    }
}
`;

export const tsArrayReaderClass = `export class ArrayReader {
    private arr: number[];
    callCount = 0;
    constructor(arr: number[]) { this.arr = [...arr]; }
    get(index: number): number {
        this.callCount++;
        if (index < 0 || index >= this.arr.length) return 2147483647;
        return this.arr[index];
    }
}
`;

export const tsMountainArrayClass = `export class MountainArray {
    private arr: number[];
    callCount = 0;
    constructor(arr: number[]) { this.arr = [...arr]; }
    get(index: number): number {
        this.callCount++;
        return this.arr[index];
    }
    length(): number { return this.arr.length; }
}
`;

export const tsRelationClass = `export class Relation {
    private graph: number[][];
    callCount = 0;
    constructor(graph: number[][]) { this.graph = graph.map(r => [...r]); }
    knows(a: number, b: number): boolean {
        this.callCount++;
        return this.graph[a][b] === 1;
    }
    size(): number { return this.graph.length; }
}
`;

export function tsJudgeClass(kind: string): string {
    switch (kind) {
        case 'guess-word': return tsMasterClass;
        case 'guess-number': return tsGuessGameClass;
        case 'first-bad': return tsVersionControlClass;
        case 'array-reader': return tsArrayReaderClass;
        case 'mountain-array': return tsMountainArrayClass;
        case 'celebrity': return tsRelationClass;
        default: throw new Error(`Unknown interactive kind: ${kind}`);
    }
}

function tsJudgeSetup(tc: any, idx: number, interactive: InteractiveConfig): { decls: string; call: string; counter: string; history: string } {
    const kind = interactive.kind;
    const secretField = interactive.secretField;
    const arrStr = (field: string) => {
        const raw = tc[field];
        if (Array.isArray(raw)) { try { return JSON.stringify(raw); } catch { return '[]'; } }
        return String(raw ?? '[]');
    };
    if (kind === 'guess-number') {
        return {
            decls: `const __n${idx} = ${tc['n']};\nconst __g${idx} = new GuessGame(${tc[secretField]});`,
            call: `__FN__(__n${idx}, __g${idx})`,
            counter: `__g${idx}.callCount`,
            history: `for (let __k${idx} = 0; __k${idx} < __g${idx}.history.length; __k${idx}++) {\n    console.log('guess #' + (__k${idx}+1) + ': ' + __g${idx}.history[__k${idx}] + ' -> ' + __g${idx}.scores[__k${idx}]);\n}`,
        };
    }
    if (kind === 'first-bad') {
        return {
            decls: `const __n${idx} = ${tc['n']};\nconst __vc${idx} = new VersionControl(${tc[secretField]});`,
            call: `__FN__(__n${idx}, __vc${idx})`,
            counter: `__vc${idx}.callCount`,
            history: `for (let __k${idx} = 0; __k${idx} < __vc${idx}.history.length; __k${idx}++) {\n    console.log('check #' + (__k${idx}+1) + ': ' + __vc${idx}.history[__k${idx}] + ' -> ' + __vc${idx}.scores[__k${idx}]);\n}`,
        };
    }
    if (kind === 'array-reader') {
        return {
            decls: `const __r${idx} = new ArrayReader(${arrStr(secretField)});\nconst __tgt${idx} = ${tc['target']};`,
            call: `__FN__(__r${idx}, __tgt${idx})`,
            counter: `__r${idx}.callCount`,
            history: ``,
        };
    }
    if (kind === 'mountain-array') {
        return {
            decls: `const __mt${idx} = new MountainArray(${arrStr(secretField)});\nconst __tgt${idx} = ${tc['target']};`,
            call: `__FN__(__tgt${idx}, __mt${idx})`,
            counter: `__mt${idx}.callCount`,
            history: ``,
        };
    }
    if (kind === 'celebrity') {
        return {
            decls: `const __rel${idx} = new Relation(${arrStr(secretField)});\nconst __n${idx} = __rel${idx}.size();`,
            call: `__FN__(__n${idx}, __rel${idx})`,
            counter: `__rel${idx}.callCount`,
            history: ``,
        };
    }
    throw new Error(`Unknown interactive kind: ${kind}`);
}

export function generateTypeScriptJudgeRunner(functionName: string, testCases: any[], interactive: InteractiveConfig): string {
    const judgeCls = judgeClassForKind(interactive.kind);
    const calls = testCases.map((tc, idx) => {
        const budget = interactiveBudget(interactive, tc);
        const setup = tsJudgeSetup(tc, idx, interactive);
        const call = setup.call.replace('__FN__', functionName);
        const hist = setup.history ? `\n${setup.history}` : '';
        return `${setup.decls.split('\n').join('\n')}
const __t0${idx} = process.hrtime.bigint();
let __res${idx} = 0;
let __ok${idx} = true;
try { __res${idx} = ${call}; } catch (__e: any) { __ok${idx} = false; console.log('ERROR: ' + (__e?.message ?? __e)); }
const __t1${idx} = process.hrtime.bigint();
console.log(':::TIME:::' + (__t1${idx} - __t0${idx}).toString());${hist}
const __calls${idx} = ${setup.counter};
console.log('api calls: ' + __calls${idx} + ' (budget ${budget})');
const __tr${idx} = (!__ok${idx}) ? 'error' : ((__calls${idx} > ${budget}) ? ('over-budget:' + __calls${idx}) : ('' + __res${idx}));
console.log(':::RESULT:::' + __tr${idx});
console.log('---');`;
    }).join('\n');

    return `${tsHelperMethods}

import { ${judgeCls} } from './${judgeCls}';
import { ${functionName} } from './Solution';

${calls}
`;
}
