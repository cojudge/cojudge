import type { Param } from "./util";
import type { InteractiveConfig } from "./interactiveUtil";
import { interactiveBudget, isTranscriptKind } from "./interactiveUtil";

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
        # Array of linked lists (list_node_array output): render each head
        # as "[1,2]" so the Java marker can parse it back. Other lists keep
        # their existing rendering.
        if len(x) > 0 and all(v is None or (hasattr(v, 'val') and hasattr(v, 'next') and type(v).__name__ == 'ListNode') for v in x):
            return '[' + ','.join(display_list_node(v) if v is not None else '[]' for v in x) + ']'
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
    for v in int_list:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def add_cycle(head: Optional[ListNode], pos: int) -> Optional[ListNode]:
    if pos < 0 or head is None:
        return head
    cur = head
    cycle_node = None
    i = 0
    while cur:
        if i == pos:
            cycle_node = cur
        if cur.next is None:
            break
        cur = cur.next
        i += 1
    if cycle_node is not None:
        cur.next = cycle_node
    return head

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
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '');
            }
            const escaped = strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`add_cycle(to_list_node('${escaped}'), ${tc.pos !== undefined ? tc.pos : -1})`);
        } else if (param.type === 'list_node_array') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '');
            }
            const escaped = strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`to_list_node_array('${escaped}')`);
        } else if (param.type === 'tree_node') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '');
            }
            const escaped = strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`read_tree_node('${escaped}')`);
        } else if (param.type === 'graph_node') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '');
            }
            const escaped = strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            parts.push(`read_graph_node('${escaped}')`);
        } else if (param.type === 'string_array' || param.type === 'string_list_2d' || param.type === 'string_list') {
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
                    let strVal: string;
                    if (Array.isArray(val)) {
                        try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(val ?? '');
                    }
                    const escaped = strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const varName = `__input${idx}_${i}`;
                    decls.push(`${varName} = read_graph_node('${escaped}')`);
                    args.push(varName);
                } else {
                    args.push(pyGetFullParam([p], tc));
                }
            });
            return [
                ...decls,
                `__t0 = time.perf_counter_ns()`,
                `__res = sol.${functionName}(${args.join(', ')})`,
                `__dt = time.perf_counter_ns() - __t0`,
                `print(':::TIME:::' + str(__dt))`,
                `if ${args[0]} is not None and __res is ${args[0]}:`,
                `    print(':::ERROR:::invalid clone - same object')`,
                `else:`,
                `    print(':::RESULT:::' + display_output(__res))`,
                `print('---')`
            ].join('\n');
        }
        return `__t0 = time.perf_counter_ns()\n__res = sol.${functionName}(${fullParam})\n__dt = time.perf_counter_ns() - __t0\nprint(':::TIME:::' + str(__dt))\nprint(':::RESULT:::' + display_output(__res))\nprint('---')`;
    }).join('\n');

    return `from typing import List, Optional, Any\nimport time\n\n${pythonListNodeClass}\n${pythonTreeNodeClass}\n${pythonGraphNodeClass}\n\n${pythonHelperMethods}\nif __name__ == '__main__':\n    import builtins\n    builtins.ListNode = ListNode\n    builtins.TreeNode = TreeNode\n    builtins.GraphNode = GraphNode\n    from Solution import Solution\n    sol = Solution()\n    ${calls}\n`;
}

export const pythonMasterClass = `
class Master:
    def __init__(self, secret: str, wordlist, max_guesses: int = 10):
        self._secret = secret
        self._wordset = set(wordlist)
        self._max = max_guesses
        self.guess_count = 0
        self.solved = False
        self.history = []
        self.scores = []
    def guess(self, word: str) -> int:
        self.guess_count += 1
        self.history.append(word)
        if word not in self._wordset:
            m = -1
        else:
            m = sum(1 for a, b in zip(word, self._secret) if a == b)
            if word == self._secret:
                self.solved = True
        self.scores.append(m)
        return m
`;

// Judge classes for return-value interactive kinds. The hidden value is only
// visible through the API method; every call increments call_count so the
// runner can enforce the call budget.
export const pythonGuessGameClass = `
class GuessGame:
    def __init__(self, pick: int):
        self._pick = pick
        self.call_count = 0
        self.history = []
    def guess(self, num: int) -> int:
        self.call_count += 1
        self.history.append(num)
        if num > self._pick:
            return -1
        if num < self._pick:
            return 1
        return 0
`;

export const pythonVersionControlClass = `
class VersionControl:
    def __init__(self, bad: int):
        self._bad = bad
        self.call_count = 0
        self.history = []
    def is_bad_version(self, version: int) -> bool:
        self.call_count += 1
        self.history.append(version)
        return version >= self._bad
`;

export const pythonArrayReaderClass = `
class ArrayReader:
    def __init__(self, arr):
        self._arr = list(arr)
        self.call_count = 0
    def get(self, index: int) -> int:
        self.call_count += 1
        if index < 0 or index >= len(self._arr):
            return 2147483647
        return self._arr[index]
`;

export const pythonMountainArrayClass = `
class MountainArray:
    def __init__(self, arr):
        self._arr = list(arr)
        self.call_count = 0
    def get(self, index: int) -> int:
        self.call_count += 1
        return self._arr[index]
    def length(self) -> int:
        return len(self._arr)
`;

export const pythonRelationClass = `
class Relation:
    def __init__(self, graph):
        self._graph = [list(row) for row in graph]
        self.call_count = 0
    def knows(self, a: int, b: int) -> bool:
        self.call_count += 1
        return self._graph[a][b] == 1
`;

export function pythonJudgeClass(kind: string): string {
    switch (kind) {
        case 'guess-word': return pythonMasterClass;
        case 'guess-number': return pythonGuessGameClass;
        case 'first-bad': return pythonVersionControlClass;
        case 'array-reader': return pythonArrayReaderClass;
        case 'mountain-array': return pythonMountainArrayClass;
        case 'celebrity': return pythonRelationClass;
        default: throw new Error(`Unknown interactive kind: ${kind}`);
    }
}

export function pythonJudgeBuiltins(kind: string): string {
    switch (kind) {
        case 'guess-word': return 'Master';
        case 'guess-number': return 'GuessGame';
        case 'first-bad': return 'VersionControl';
        case 'array-reader': return 'ArrayReader';
        case 'mountain-array': return 'MountainArray';
        case 'celebrity': return 'Relation';
        default: throw new Error(`Unknown interactive kind: ${kind}`);
    }
}
export function generatePythonInteractiveRunner(functionName: string, testCases: any[], interactive: InteractiveConfig): string {
    if (!isTranscriptKind(interactive.kind)) {
        return generatePythonJudgeRunner(functionName, testCases, interactive);
    }
    const maxG = interactive.maxGuesses;
    const secretField = interactive.secretField;
    const calls = testCases.map((tc, idx) => {
        const wl = pyGetFullParam([{ name: 'wordlist', type: 'string_array' } as Param], tc);
        const rawSecret = tc[secretField] ?? '';
        const escSecret = String(rawSecret).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `__wl${idx} = ${wl}\n__sec${idx} = '${escSecret}'\n__m${idx} = Master(__sec${idx}, __wl${idx}, ${maxG})\n__t0 = time.perf_counter_ns()\ntry:\n    sol.${functionName}(__wl${idx}, __m${idx})\nexcept Exception as __e:\n    print('ERROR: ' + str(__e))\n__dt = time.perf_counter_ns() - __t0\nprint(':::TIME:::' + str(__dt))\nfor __k${idx}, (__w${idx}, __s${idx}) in enumerate(zip(__m${idx}.history, __m${idx}.scores)):\n    print(f'guess #{__k${idx}+1}: {__w${idx}} -> {__s${idx}}')\n__tr${idx} = ('solved:' + str(__m${idx}.guess_count)) if (__m${idx}.solved and __m${idx}.guess_count <= ${maxG}) else ('failed:' + str(__m${idx}.guess_count))\nprint(':::RESULT:::' + __tr${idx})\nprint('---')`;
    }).join('\n');

    return `from typing import List, Optional, Any\nimport time\nfrom ast import literal_eval\n\n${pythonListNodeClass}\n${pythonTreeNodeClass}\n${pythonGraphNodeClass}\n\n${pythonHelperMethods}\n${pythonMasterClass}\nif __name__ == '__main__':\n    import builtins\n    builtins.ListNode = ListNode\n    builtins.TreeNode = TreeNode\n    builtins.GraphNode = GraphNode\n    builtins.Master = Master\n    from Solution import Solution\n    sol = Solution()\n    ${calls}\n`;
}

function pyJudgeSetup(tc: any, idx: number, interactive: InteractiveConfig): { decls: string; call: string; counter: string; history: string } {
    const kind = interactive.kind;
    const secretField = interactive.secretField;
    const budget = interactiveBudget(interactive, tc);
    if (kind === 'guess-number') {
        const n = tc['n'];
        const pick = tc[secretField];
        return {
            decls: `__n${idx} = ${n}\n__g${idx} = GuessGame(${pick})`,
            call: `sol.${'__FN__'}(__n${idx}, __g${idx})`,
            counter: `__g${idx}.call_count`,
            history: `for __k${idx}, __num${idx} in enumerate(__g${idx}.history):\n    print(f'guess #{__k${idx}+1}: {__num${idx}}')`,
        };
    }
    if (kind === 'first-bad') {
        const n = tc['n'];
        const bad = tc[secretField];
        return {
            decls: `__n${idx} = ${n}\n__vc${idx} = VersionControl(${bad})`,
            call: `sol.${'__FN__'}(__n${idx}, __vc${idx})`,
            counter: `__vc${idx}.call_count`,
            history: `for __k${idx}, __v${idx} in enumerate(__vc${idx}.history):\n    print(f'check #{__k${idx}+1}: {__v${idx}}')`,
        };
    }
    if (kind === 'array-reader') {
        const raw = tc[secretField] ?? '[]';
        const str = Array.isArray(raw) ? JSON.stringify(raw) : String(raw);
        const escaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const target = tc['target'];
        return {
            decls: `__r${idx} = ArrayReader(literal_eval('${escaped}'))\n__t${idx} = ${target}`,
            call: `sol.${'__FN__'}(__r${idx}, __t${idx})`,
            counter: `__r${idx}.call_count`,
            history: ``,
        };
    }
    if (kind === 'mountain-array') {
        const raw = tc[secretField] ?? '[]';
        const str = Array.isArray(raw) ? JSON.stringify(raw) : String(raw);
        const escaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const target = tc['target'];
        return {
            decls: `__mt${idx} = MountainArray(literal_eval('${escaped}'))\n__t${idx} = ${target}`,
            call: `sol.${'__FN__'}(__t${idx}, __mt${idx})`,
            counter: `__mt${idx}.call_count`,
            history: ``,
        };
    }
    if (kind === 'celebrity') {
        const raw = tc[secretField] ?? '[]';
        const str = Array.isArray(raw) ? JSON.stringify(raw) : String(raw);
        const escaped = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return {
            decls: `__rel${idx} = Relation(literal_eval('${escaped}'))\n__n${idx} = len(__rel${idx}._graph)`,
            call: `sol.${'__FN__'}(__n${idx}, __rel${idx})`,
            counter: `__rel${idx}.call_count`,
            history: ``,
        };
    }
    throw new Error(`Unknown interactive kind: ${kind}`);
}

export function generatePythonJudgeRunner(functionName: string, testCases: any[], interactive: InteractiveConfig): string {
    const judgeCls = pythonJudgeBuiltins(interactive.kind);
    const calls = testCases.map((tc, idx) => {
        const budget = interactiveBudget(interactive, tc);
        const setup = pyJudgeSetup(tc, idx, interactive);
        const call = setup.call.replace('__FN__', functionName);
        const hist = setup.history ? setup.history + '\n' : '';
        return `${setup.decls}\n__ts${idx} = time.perf_counter_ns()\n__ok${idx} = True\ntry:\n    __res${idx} = ${call}\nexcept Exception as __e:\n    print('ERROR: ' + str(__e))\n    __ok${idx} = False\n__dt = time.perf_counter_ns() - __ts${idx}\nprint(':::TIME:::' + str(__dt))\n${hist}__calls${idx} = ${setup.counter}\nprint(f'api calls: {__calls${idx}} (budget ${budget})')\nif (not __ok${idx}):\n    print(':::RESULT:::error')\nelif __calls${idx} > ${budget}:\n    print(':::RESULT:::over-budget:' + str(__calls${idx}))\nelse:\n    print(':::RESULT:::' + display_output(__res${idx}))\nprint('---')`;
    }).join('\n');

    return `from typing import List, Optional, Any\nimport time\nfrom ast import literal_eval\n\n${pythonListNodeClass}\n${pythonTreeNodeClass}\n${pythonGraphNodeClass}\n\n${pythonHelperMethods}\n${pythonJudgeClass(interactive.kind)}\nif __name__ == '__main__':\n    import builtins\n    builtins.ListNode = ListNode\n    builtins.TreeNode = TreeNode\n    builtins.GraphNode = GraphNode\n    builtins.${judgeCls} = ${judgeCls}\n    from Solution import Solution\n    sol = Solution()\n    ${calls}\n`;
}
