## Approach

Run a breadth-first walk starting at the root. For each depth, drain exactly the current queue size, accumulate the node values, push any children, and record the quotient as a decimal string. Levels are naturally emitted from top to bottom.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count. Each node is dequeued once.
- **Space Complexity:** O(w) for the queue holding the widest level.

## Implementation

```python
from typing import List
from collections import deque

class Solution:
    def averageOfLevels(self, root) -> List[str]:
        if not root:
            return []
        q = deque([root])
        ans = []
        while q:
            total = 0
            n = len(q)
            for _ in range(n):
                node = q.popleft()
                total += node.val
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            ans.append(str(total / n))
        return ans
```
