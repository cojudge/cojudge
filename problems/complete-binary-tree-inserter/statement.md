You start with a complete binary tree (every level full except possibly the last, filled left to right), given as `root`.

Instead of building the usual inserter class, implement `runCbtInserter(root, operations, values)`, which replays a trace: each entry of `operations` is `"insert"` or `"getRoot"`, with the aligned entry of `values` holding the value for `"insert"` (ignored for `"getRoot"`). For `"insert"`, add the new node so the tree stays complete and report the parent's value; for `"getRoot"`, report the current root's value. Return all reported values in order.

**Example 1:**
```
Input: root = [1,2], operations = ["insert","insert","getRoot"], values = [3,4,0]
Output: [1,2,1]
```

**Example 2:**
```
Input: root = [1], operations = ["insert","getRoot","insert"], values = [2,0,3]
Output: [1,1,1]
```

**Example 3:**
```
Input: root = [1,2,3,4,5,6], operations = ["insert","insert","getRoot"], values = [7,8,0]
Output: [3,4,1]
```

**Constraints:**
- The node count starts at `>= 1` and stays `<= 10^4`
- Node values fit in a 32-bit signed integer
- `1 <= operations.length <= 10^4`, each entry is `"insert"` or `"getRoot"`
