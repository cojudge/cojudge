## Approach

Standard breadth-first search gathers one list per depth from top to bottom. Reversing the outer list converts that order to bottom-up while preserving left-to-right order inside each row. An empty tree short-circuits to an empty answer.

## Complexity Analysis

- **Time Complexity:** O(n), each node enqueued once plus a linear reversal.
- **Space Complexity:** O(n) for the queue and stored rows.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def levelOrderBottom(self, root) -> List[List[int]]:
        if not root:
            return []
        ans = []
        q = deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                n = q.popleft()
                level.append(n.val)
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            ans.append(level)
        ans.reverse()
        return ans
```
