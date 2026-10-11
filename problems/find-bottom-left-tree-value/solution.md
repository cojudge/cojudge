## Approach

Scan the tree breadth-first, one row at a time, and remember the first value seen in each row. Because rows are processed from top to bottom, the stored value after the final row is exactly the leftmost entry of the deepest level.

## Complexity Analysis

- **Time Complexity:** O(n), each node enters and leaves the queue once.
- **Space Complexity:** O(w), where w is the widest row held in the queue.

## Implementation

```python
from collections import deque

class Solution:
    def findBottomLeftValue(self, root) -> int:
        q = deque([root])
        ans = root.val
        while q:
            ans = q[0].val
            for _ in range(len(q)):
                cur = q.popleft()
                if cur.left is not None:
                    q.append(cur.left)
                if cur.right is not None:
                    q.append(cur.right)
        return ans
```
