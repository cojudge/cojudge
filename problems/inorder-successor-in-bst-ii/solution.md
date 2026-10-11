## Approach

Rebuild the parent-pointer view first: walk the tree breadth-first to list nodes in serialization order, then zip that list with the `parents` entries to obtain each node's parent value (falling back to structural parents if the encoding ever disagrees). From the target node, apply the textbook parent-pointer rule: with a right subtree the successor is its leftmost node, otherwise climb through parent links until moving up from a left child. A missing target, an empty tree, or climbing past the root all yield `-1`.

## Complexity Analysis

- **Time Complexity:** O(n) for the breadth-first rebuild plus O(h) for the successor walk, where h is the tree height.
- **Space Complexity:** O(n) for the node and parent tables.

## Implementation

```python
from collections import deque

class Solution:
    def inorderSuccessor(self, root, parents: str, p: int) -> int:
        if root is None:
            return -1
        bfs, by_val, structural = [], {}, {}
        q = deque([root])
        structural[root.val] = None
        while q:
            cur = q.popleft()
            bfs.append(cur)
            by_val[cur.val] = cur
            if cur.left is not None:
                structural[cur.left.val] = cur.val
                q.append(cur.left)
            if cur.right is not None:
                structural[cur.right.val] = cur.val
                q.append(cur.right)
        if p not in by_val:
            return -1
        inner = parents.strip()[1:-1].strip()
        toks = [] if not inner else [t.strip() for t in inner.split(",")]
        parent_of = dict(structural)
        if len(toks) == len(bfs):
            parent_of = {}
            for node, tok in zip(bfs, toks):
                parent_of[node.val] = None if tok == "null" else int(tok)
        target = by_val[p]
        if target.right is not None:
            cur = target.right
            while cur.left is not None:
                cur = cur.left
            return cur.val
        cur = target
        while True:
            pv = parent_of.get(cur.val)
            if pv is None:
                return -1
            parent = by_val.get(pv)
            if parent is None:
                return -1
            if parent.left is cur:
                return parent.val
            cur = parent
```
