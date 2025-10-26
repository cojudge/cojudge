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

def display_output(x: Any) -> str:
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, list):
        return str(x)
    # Duck-typing for ListNode / TreeNode to avoid module identity issues
    if x is None:
        return 'null'
    if hasattr(x, 'val') and hasattr(x, 'next') and type(x).__name__ == 'ListNode':
        return display_list_node(x)  # type: ignore
    if hasattr(x, 'val') and hasattr(x, 'left') and hasattr(x, 'right') and type(x).__name__ == 'TreeNode':
        return display_tree_node(x)  # type: ignore
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
            parts.push(`${val}`); // value is like "[1,2,3]"
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
        } else {
            // default: pass as string literal
            const escaped = String(val ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`'${escaped}'`);
        }
    }
    return parts.join(', ');
}

export function generatePythonRunner(functionName: string, params: Param[], testCases: any[]): string {
    const calls = testCases.map(tc => {
        const fullParam = pyGetFullParam(params, tc);
        // Capture final result separately to avoid mixing with user prints
        return `__res = sol.${functionName}(${fullParam})\nprint(':::RESULT:::' + display_output(__res))\nprint('---')`;
    }).join('\n');

    return `from typing import List, Optional, Any\n\n${pythonListNodeClass}\n${pythonTreeNodeClass}\n\n${pythonHelperMethods}\nif __name__ == '__main__':\n    from Solution import Solution\n    sol = Solution()\n    ${calls}\n`;
}
