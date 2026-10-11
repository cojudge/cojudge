## Approach

Walk the tree in level order while remembering whether a missing child slot has been seen. Enqueue both children of every node (including nulls). The first null marks the point after which no real node may appear; encountering a real node afterwards proves the tree is incomplete. An empty tree passes trivially.

## Complexity Analysis

- **Time Complexity:** O(n) for n nodes, each visited once.
- **Space Complexity:** O(n) for the breadth-first queue in the worst case.

## Implementation

```python
from collections import deque

class Solution:
    def isCompleteTree(self, root) -> bool:
        if root is None:
            return True
        q = deque([root])
        gap_seen = False
        while q:
            cur = q.popleft()
            if cur is None:
                gap_seen = True
            else:
                if gap_seen:
                    return False
                q.append(cur.left)
                q.append(cur.right)
        return True
```
