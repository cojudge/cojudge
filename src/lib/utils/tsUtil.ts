import type { Param } from "./util";

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
    for (const v of arr) {
        cur.next = new ListNode(v);
        cur = cur.next;
    }
    return dummy.next;
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
            parts.push(`toListNode(${strVal})`);
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
                        decls.push(`const ${varName} = toGraphNode(${JSON.stringify(String(val ?? '[]'))});`);
                        args.push(varName);
                    } else {
                        args.push(tsGetFullParam([p], tc));
                    }
                });
                const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
                return [
                    ...decls,
                    `const __res${idx} = sol.solve(${args.join(', ')});`,
                    `if (${graphNodeArg} !== null && __res${idx} === ${graphNodeArg}) {`,
                    `    console.log(':::ERROR:::invalid clone - same object');`,
                    `} else {`,
                    `    console.log(':::RESULT:::' + displayOutput(__res${idx}));`,
                    `}`,
                    `console.log('---');`
                ].join('\n        ');
            }
            const fullParam = tsGetFullParam(params, tc);
            return `const __res${idx} = sol.solve(${fullParam});\nconsole.log(':::RESULT:::' + displayOutput(__res${idx}));\nconsole.log('---');`;
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
                    decls.push(`const ${varName} = toGraphNode(${JSON.stringify(String(val ?? '[]'))});`);
                    args.push(varName);
                } else {
                    args.push(tsGetFullParam([p], tc));
                }
            });
            const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
            return [
                ...decls,
                `const __res${idx} = ${functionName}(${args.join(', ')});`,
                `if (${graphNodeArg} !== null && __res${idx} === ${graphNodeArg}) {`,
                `    console.log(':::ERROR:::invalid clone - same object');`,
                `} else {`,
                `    console.log(':::RESULT:::' + displayOutput(__res${idx}));`,
                `}`,
                `console.log('---');`
            ].join('\n        ');
        }
        const fullParam = tsGetFullParam(params, tc);
        return `const __res${idx} = ${functionName}(${fullParam});\nconsole.log(':::RESULT:::' + displayOutput(__res${idx}));\nconsole.log('---');`;
    }).join('\n        ');

    return `${imports}
${tsHelperMethods}

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
