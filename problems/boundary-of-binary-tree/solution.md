## Approach

Emit the root unless the tree is empty or a lone leaf. Then walk the left edge preferring left moves while skipping leaves, gather every leaf left to right with DFS, and walk the right edge preferring right moves, appending that edge in reverse so the whole order runs counter-clockwise without duplicates.

## Complexity Analysis

- **Time Complexity:** O(n), three linear walks.
- **Space Complexity:** O(h) recursion depth plus O(n) output.

## Implementation

```python
from typing import List
class Solution:
    def boundaryOfBinaryTree(self, root) -> List[int]:
        if not root:
            return []
        if not root.left and not root.right:
            return [root.val]
        res = [root.val]
        cur = root.left
        while cur:
            if cur.left or cur.right:
                res.append(cur.val)
            cur = cur.left if cur.left else cur.right
        def leaves(node):
            if not node:
                return
            if not node.left and not node.right:
                res.append(node.val)
                return
            leaves(node.left)
            leaves(node.right)
        leaves(root)
        tmp = []
        cur = root.right
        while cur:
            if cur.left or cur.right:
                tmp.append(cur.val)
            cur = cur.right if cur.right else cur.left
        res.extend(reversed(tmp))
        return res
```
