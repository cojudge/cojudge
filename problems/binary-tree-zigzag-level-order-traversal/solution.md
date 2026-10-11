## Approach

Breadth-first search visits one depth at a time. Keep a flag that flips after every row: rows on even depths are kept as collected, rows on odd depths are reversed. Each node enters and leaves the queue once, and children are enqueued in natural left-to-right order so reversal alone produces the zigzag.

## Complexity Analysis

- **Time Complexity:** O(n), each node processed once plus linear reversals.
- **Space Complexity:** O(n) for the queue and the answer.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def zigzagLevelOrder(self, root) -> List[List[int]]:
        if not root:
            return []
        ans = []
        q = deque([root])
        ltr = True
        while q:
            level = []
            for _ in range(len(q)):
                n = q.popleft()
                level.append(n.val)
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            if not ltr:
                level.reverse()
            ans.append(level)
            ltr = not ltr
        return ans
```
