## Approach

Color the network with two labels using breadth-first search. Start each
unvisited component with label zero, then force every neighbor to carry the
opposite label. If an edge ever connects two equally labeled vertices, the
graph cannot be split as required. Surviving all components without a clash
confirms two-colorability.

## Complexity Analysis

- **Time Complexity:** O(n + e), where n is the vertex count and e the edge count.
- **Space Complexity:** O(n) for colors and the queue.

## Implementation

```python
from typing import List
from collections import deque


class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        n = len(graph)
        color = [-1] * n
        for start in range(n):
            if color[start] != -1:
                continue
            color[start] = 0
            queue = deque([start])
            while queue:
                u = queue.popleft()
                for v in graph[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        queue.append(v)
                    elif color[v] == color[u]:
                        return False
        return True
```
