## Approach

Breadth-first search carries each node's column alongside it in the queue, starting the root at column 0. Values are appended to per-column buckets, so BFS visit order naturally yields top-to-bottom, left-to-right placement within a column. Emitting the buckets sorted by column gives the final ordering.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the number of nodes, due to sorting the column keys (O(n) with min/max tracking).
- **Space Complexity:** O(n) for the queue and the buckets.

## Implementation

```python
from typing import List
from collections import defaultdict, deque
class Solution:
    def verticalOrder(self, root) -> List[List[int]]:
        if not root:
            return []
        cols = defaultdict(list)
        q = deque([(root, 0)])
        while q:
            node, c = q.popleft()
            cols[c].append(node.val)
            if node.left:
                q.append((node.left, c - 1))
            if node.right:
                q.append((node.right, c + 1))
        return [cols[c] for c in sorted(cols)]
```
