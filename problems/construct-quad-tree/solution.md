## Approach

Recursively build the quad tree on subgrids. If all four children are identical leaves, collapse into one leaf.

Serialize with BFS: each node becomes `[isLeaf, val]`; only internal nodes enqueue four children.

## Complexity Analysis

- **Time Complexity:** O(n^2 log n)
- **Space Complexity:** O(n^2)

## Implementation

```python
from typing import List
class Solution:
    def construct(self, grid: List[List[int]]) -> List[List[int]]:
        class Node:
            def __init__(self, val, isLeaf, tl=None, tr=None, bl=None, br=None):
                self.val = val
                self.isLeaf = isLeaf
                self.topLeft = tl
                self.topRight = tr
                self.bottomLeft = bl
                self.bottomRight = br
        def build(r, c, length):
            if length == 1:
                return Node(grid[r][c] == 1, True)
            h = length // 2
            tl, tr = build(r, c, h), build(r, c + h, h)
            bl, br = build(r + h, c, h), build(r + h, c + h, h)
            if tl.isLeaf and tr.isLeaf and bl.isLeaf and br.isLeaf and tl.val == tr.val == bl.val == br.val:
                return Node(tl.val, True)
            return Node(True, False, tl, tr, bl, br)
        root = build(0, 0, len(grid))
        out = []
        from collections import deque
        q = deque([root])
        while q:
            n = q.popleft()
            out.append([1 if n.isLeaf else 0, 1 if n.val else 0])
            if not n.isLeaf:
                q.extend([n.topLeft, n.topRight, n.bottomLeft, n.bottomRight])
        return out
```
