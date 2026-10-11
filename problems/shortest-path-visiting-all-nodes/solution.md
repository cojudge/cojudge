## Approach

Treat each combination of visited-set plus current node as a search state. Seed a queue with every start node holding only itself, then run breadth-first search: from (mask, u) step to each neighbour v with the updated mask. The first expansion reaching the all-ones mask uses the fewest edges because BFS grows by distance.

## Complexity Analysis

- **Time Complexity:** O(n^2 * 2^n), where n <= 12, for states times edges.
- **Space Complexity:** O(n * 2^n) for visited flags and the queue.

## Implementation

```python
from collections import deque
from typing import List
class Solution:
    def shortestPathLength(self, graph: List[List[int]]) -> int:
        n = len(graph)
        if n == 1:
            return 0
        full = (1 << n) - 1
        seen = [[False] * n for _ in range(1 << n)]
        q = deque()
        for i in range(n):
            m = 1 << i
            seen[m][i] = True
            q.append((m, i, 0))
        while q:
            mask, u, d = q.popleft()
            for v in graph[u]:
                nm = mask | (1 << v)
                if nm == full:
                    return d + 1
                if not seen[nm][v]:
                    seen[nm][v] = True
                    q.append((nm, v, d + 1))
        return -1
```
