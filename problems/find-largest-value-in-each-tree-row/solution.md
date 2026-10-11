## Approach

Traverse level by level with a queue. For each row, scan all its nodes to find the largest value, append that maximum to the answer, and enqueue the children for the next round. An empty tree skips the loop and returns an empty list.

## Complexity Analysis

- **Time Complexity:** O(n), one visit per node.
- **Space Complexity:** O(w), where w is the maximum row width.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def largestValues(self, root) -> List[int]:
        if root is None:
            return []
        ans = []
        q = deque([root])
        while q:
            mx = max(node.val for node in q)
            ans.append(mx)
            for _ in range(len(q)):
                cur = q.popleft()
                if cur.left is not None:
                    q.append(cur.left)
                if cur.right is not None:
                    q.append(cur.right)
        return ans
```
