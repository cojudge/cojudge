## Approach

Walk level by level while carrying heap-style indices. Children of index `i` get `2*i` and `2*i+1`, so gaps are preserved. The width of a level is last minus first plus one. Subtracting the first index of each level before expanding keeps values small.

## Complexity Analysis

- **Time Complexity:** O(n) visiting each node once.
- **Space Complexity:** O(n) for the level queues.

## Implementation

```python
from collections import deque
class Solution:
    def widthOfBinaryTree(self, root) -> int:
        if not root:
            return 0
        ans = 1
        q = deque([(root, 0)])
        while q:
            first = q[0][1]
            last = first
            for _ in range(len(q)):
                n, idx = q.popleft()
                idx -= first
                last = first + idx
                if n.left:
                    q.append((n.left, idx * 2))
                if n.right:
                    q.append((n.right, idx * 2 + 1))
            ans = max(ans, last - first + 1)
        return ans
```
