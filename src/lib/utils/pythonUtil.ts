import type { Param } from "./util";

export const pythonImage = 'python:3.11-slim';

export const pythonListNodeClass = `
class ListNode:
    def __init__(self, val: int = 0, next: 'Optional[ListNode]' = None):
        self.val = val
        self.next = next
`;

export const pythonTreeNodeClass = `
class TreeNode:
    def __init__(self, val: int = 0, left: 'Optional[TreeNode]' = None, right: 'Optional[TreeNode]' = None):
        self.val = val
        self.left = left
        self.right = right
`;

export const pythonGraphNodeClass = `
from typing import List
class GraphNode:
    def __init__(self, val: int = 0, neighbors: 'Optional[List[GraphNode]]' = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
`;

export const pythonHelperMethods = `# helper display to normalize outputs
from typing import Any, Optional, List
from ast import literal_eval

def display_list_node(node: ListNode) -> str:
    cur = node
    nums = []
    while cur != None:
        nums.append(cur.val)
        cur = cur.next
    return str(nums)

def display_tree_node(root: Optional[TreeNode]) -> str:
    if root is None:
        return '[]'
    from collections import deque
    q = deque([root])
    out: List[Any] = []
    while q:
        node = q.popleft()
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        q.append(node.left)
        q.append(node.right)
    # trim trailing Nones
    i = len(out) - 1
    while i >= 0 and out[i] is None:
        i -= 1
    out = out[:i+1]
    # convert to leetcode-like string with nulls
    return '[' + ','.join('null' if v is None else str(v) for v in out) + ']'

def display_graph_node(node: Optional['GraphNode']) -> str:
    if node is None:
        return '[]'
    adj = {}
    visited = set()
    from collections import deque
    q = deque([node])
    visited.add(node)
    while q:
        cur = q.popleft()
        neighbors = []
        for n in cur.neighbors:
            neighbors.append(n.val)
            if n not in visited:
                visited.add(n)
                q.append(n)
        adj[cur.val] = neighbors
    result = []
    for k in sorted(adj):
        result.append(adj[k])
    return str(result)

def display_output(x: Any) -> str:
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, list):
        return str(x)
    # Duck-typing for ListNode / TreeNode / GraphNode to avoid module identity issues
    if hasattr(x, 'val') and hasattr(x, 'next') and type(x).__name__ == 'ListNode':
        return display_list_node(x)  # type: ignore
    if hasattr(x, 'val') and hasattr(x, 'left') and hasattr(x, 'right') and type(x).__name__ == 'TreeNode':
        return display_tree_node(x)  # type: ignore
    if hasattr(x, 'val') and hasattr(x, 'neighbors') and type(x).__name__ == 'GraphNode':
        return display_graph_node(x)  # type: ignore
    if x is None:
        return '[]'
    return str(x)

def to_list_node_array(x: str) -> List[Optional[ListNode]]:
    if not x or not len(x):
        return []
    nested_int_list = literal_eval(x)
    res = []
    for int_list in nested_int_list:
        res.append(to_list_node(str(int_list)))
    return res

def to_list_node(x: str) -> Optional[ListNode]:
    int_list = literal_eval(x)
    dummy = ListNode(-1)
    cur = dummy
    for x in int_list:
        cur.next = ListNode(x)
        cur = cur.next
    return dummy.next

def read_graph_node(x: str) -> Optional['GraphNode']:
    if not x or x.strip() == '[]':
        return None
    adj = literal_eval(x)
    if not isinstance(adj, list) or not adj:
        return None
    nodes = [GraphNode(i + 1) for i in range(len(adj))]
    for i, neighbors in enumerate(adj):
        for nb in neighbors:
            nodes[i].neighbors.append(nodes[nb - 1])
    return nodes[0]

def read_tree_node(x: str) -> Optional[TreeNode]:
    if not x or x.strip() == '[]':
        return None
    # normalize null to None for literal_eval
    xs = x.replace('null', 'None')
    arr = literal_eval(xs)
    if not isinstance(arr, list) or not arr:
        return None
    from collections import deque
    it = iter(arr)
    first = next(it)
    if first is None:
        return None
    root = TreeNode(first)
    q = deque([root])
    while q:
        node = q.popleft()
        try:
            l = next(it)
        except StopIteration:
            break
        if l is not None:
            node.left = TreeNode(l)
            q.append(node.left)
        try:
            r = next(it)
        except StopIteration:
            break
        if r is not None:
            node.right = TreeNode(r)
            q.append(node.right)
    return root

`;

export function pyGetFullParam(params: Param[], tc: any): string {
    let parts: string[] = [];
    for (const param of params) {
        const val = tc[param.name];
        if (param.type === 'string') {
            // preserve as Python string literal
            const escaped = (val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`'${escaped}'`);
        } else if (param.type === 'int_array') {
            const raw = val ?? '[]';
            const str = Array.isArray(raw) ? JSON.stringify(raw) : `${raw}`;
            parts.push(str);
        } else if (param.type === 'int') {
            parts.push(`${val}`);
        } else if (param.type === 'boolean') {
            parts.push(String(val) === 'true' ? 'True' : 'False');
        } else if (param.type === 'list_node') {
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`to_list_node('${escaped}')`);
        } else if (param.type === 'list_node_array') {
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`to_list_node_array('${escaped}')`);
        } else if (param.type === 'tree_node') {
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`read_tree_node('${escaped}')`);
        } else if (param.type === 'graph_node') {
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`read_graph_node('${escaped}')`);
        } else if (param.type === 'string_array') {
            const raw = val ?? '[]';
            const str = Array.isArray(raw) ? JSON.stringify(raw): String(raw);
            const escaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`literal_eval('${escaped}')`);
        } else if (param.type === 'int_array_2d' || param.type === 'int_matrix' || param.type === 'char_array_2d') {
            const raw = val ?? '[]';
            const str = Array.isArray(raw) ? JSON.stringify(raw): String(raw);
            const escaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`literal_eval('${escaped}')`);
        } else {
            // default: pass as string literal
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`'${escaped}'`);
        }
    }
    return parts.join(', ');
}

const pythonStringOpMap: Record<string, { void: boolean, code: string }> = {
    addWord: { void: true, code: 'obj.addWord(values[i])' },
    insert: { void: true, code: 'obj.insert(values[i])' },
    search: { void: false, code: 'str(obj.search(values[i])).lower()' },
    startsWith: { void: false, code: 'str(obj.startsWith(values[i])).lower()' },
};

function generatePythonBranches(operations: string[], isInt: boolean): string {
    return operations.map((op, i) => {
        const cond = i === 0 ? 'if' : 'elif';
        if (isInt) {
            if (op === 'addNum') {
                return `            ${cond} op == "addNum":\n                obj.addNum(values[i][0])\n                result.append("null")`;
            } else if (op === 'findMedian') {
                return `            ${cond} op == "findMedian":\n                med = obj.findMedian()\n                if med == int(med):\n                    result.append(str(int(med)) + ".0")\n                else:\n                    result.append(str(med))`;
            }
            return '';
        }
        const entry = pythonStringOpMap[op];
        if (!entry) return '';
        if (entry.void) {
            return `            ${cond} op == "${op}":\n                ${entry.code}\n                result.append("null")`;
        } else {
            return `            ${cond} op == "${op}":\n                result.append(${entry.code})`;
        }
    }).join('\n');
}

export function generatePythonClassSolution(className: string, params?: Param[], outputType?: string, operations?: string[]): string {
    if (params && params.length > 0 && params[0]?.type === 'tree_node') {
        return `
from typing import List, Optional
from TreeNode import TreeNode
from ${className} import ${className}

class Solution:
    def solve(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        ser = ${className}()
        deser = ${className}()
        return deser.deserialize(ser.serialize(root))
`;
    }
    if (params && params.length === 1 && params[0]?.type === 'string_array') {
        return `
from typing import List
from ${className} import ${className}

class Solution:
    def solve(self, strs: List[str]) -> List[str]:
        codec = ${className}()
        encoded = codec.encode(strs)
        return codec.decode(encoded)
`;
    }
    if (params && params.length > 1 && params[1]?.type === 'string_array') {
        const ops = operations || ['addWord', 'insert', 'search', 'startsWith'];
        const branches = generatePythonBranches(ops, false);
        return `
from typing import List
from ${className} import ${className}

class Solution:
    def solve(self, operations: List[str], values: List[str]) -> List[str]:
        result = []
        obj = None
        for i, op in enumerate(operations):
            if op == "${className}":
                obj = ${className}()
                result.append("null")
${branches}
        return result
`;
    }
    const ops = operations || ['addNum', 'findMedian'];
    const branches = generatePythonBranches(ops, true);
    return `
from typing import List
from ${className} import ${className}

class Solution:
    def solve(self, operations: List[str], values: List[List[int]]) -> List[str]:
        result = []
        obj = None
        for i, op in enumerate(operations):
            if op == "${className}":
                obj = ${className}()
                result.append("null")
${branches}
        return result
`;
}

export function generatePythonRunner(functionName: string, params: Param[], testCases: any[], checkGraphClone?: boolean): string {
    const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');
    const calls = testCases.map((tc, idx) => {
        const fullParam = pyGetFullParam(params, tc);
        if (hasGraphNode) {
            const decls: string[] = [];
            const args: string[] = [];
            params.forEach((p, i) => {
                if (p.type === 'graph_node') {
                    const val = tc[p.name];
                    const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const varName = `__input${idx}_${i}`;
                    decls.push(`${varName} = read_graph_node('${escaped}')`);
                    args.push(varName);
                } else {
                    args.push(pyGetFullParam([p], tc));
                }
            });
            return [
                ...decls,
                `__res = sol.${functionName}(${args.join(', ')})`,
                `if ${args[0]} is not None and __res is ${args[0]}:`,
                `    print(':::ERROR:::invalid clone - same object')`,
                `else:`,
                `    print(':::RESULT:::' + display_output(__res))`,
                `print('---')`
            ].join('\n');
        }
        return `__res = sol.${functionName}(${fullParam})\nprint(':::RESULT:::' + display_output(__res))\nprint('---')`;
    }).join('\n');

    return `from typing import List, Optional, Any\n\n${pythonListNodeClass}\n${pythonTreeNodeClass}\n${pythonGraphNodeClass}\n\n${pythonHelperMethods}\nif __name__ == '__main__':\n    import builtins\n    builtins.ListNode = ListNode\n    builtins.TreeNode = TreeNode\n    builtins.GraphNode = GraphNode\n    from Solution import Solution\n    sol = Solution()\n    ${calls}\n`;
}
