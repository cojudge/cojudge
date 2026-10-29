You start with a complete binary tree (every level full except possibly the last, filled left to right), given as `root`.

Instead of building the usual inserter class, implement `runCbtInserter(root, operations, values)`, which replays a trace: each entry of `operations` is `"insert"` or `"getRoot"`, with the aligned entry of `values` holding the value for `"insert"` (ignored for `"getRoot"`). For `"insert"`, add the new node so the tree stays complete and report the parent's value; for `"getRoot"`, report the current root's value. Return all reported values in order.

**Constraints:**
- The node count starts at `>= 1` and stays `<= 10^4`
- Node values fit in a 32-bit signed integer
- `1 <= operations.length <= 10^4`, each entry is `"insert"` or `"getRoot"`
