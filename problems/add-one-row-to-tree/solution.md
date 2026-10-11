## Approach

Treat depth 1 as a special case that wraps the old tree. For deeper targets, walk down to the parents at depth-1 with a queue, then splice two fresh nodes under each parent while preserving the displaced subtrees (old left under new left, old right under new right). Every host is handled independently, so one level-order pass suffices.

## Complexity Analysis

- **Time Complexity:** O(n), visiting each node at most once.
- **Space Complexity:** O(w) for the queue, where w is the widest level, plus O(n) for the added row.

## Implementation

```python
from collections import deque
class Solution:
    def addOneRow(self, root, val: int, depth: int):
        if depth == 1:
            node = TreeNode(val)
            node.left = root
            return node
        q = deque([root] if root else [])
        cur = 1
        while q and cur < depth - 1:
            for _ in range(len(q)):
                n = q.popleft()
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            cur += 1
        while q:
            n = q.popleft()
            old_l, old_r = n.left, n.right
            nl = type(n)(val)
            nr = type(n)(val)
            nl.left = old_l
            nr.right = old_r
            n.left, n.right = nl, nr
        return root
```
