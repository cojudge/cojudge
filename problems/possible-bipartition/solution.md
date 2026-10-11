## Approach

Treat each rivalry as an undirected graph edge and try to paint every person one of two colors so that neighbors always differ. A BFS from each unpainted person assigns forced colors outward; reaching a neighbor that already carries the same color exposes an odd cycle and proves the answer false. If every component paints cleanly, the two color classes form a valid split.

## Complexity Analysis

- **Time Complexity:** O(n + E), where E is the number of rivalry pairs. Each person and edge is processed once.
- **Space Complexity:** O(n + E) for the adjacency lists, colors, and queue.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def possibleBipartition(self, n: int, dislikes: List[List[int]]) -> bool:
        g = [[] for _ in range(n + 1)]
        for a, b in dislikes:
            g[a].append(b)
            g[b].append(a)
        color = [0] * (n + 1)
        for i in range(1, n + 1):
            if color[i] != 0:
                continue
            color[i] = 1
            q = deque([i])
            while q:
                u = q.popleft()
                for v in g[u]:
                    if color[v] == 0:
                        color[v] = -color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return False
        return True
```
