## Approach

Depth-first search colours each vertex as unvisited, currently on the stack, or proven safe. A vertex whose exploration meets a stack vertex lies on or leads to a cycle and is unsafe; otherwise, once all successors are safe, it becomes safe itself. Collecting safe vertices in index order gives the answer.

## Complexity Analysis

- **Time Complexity:** O(V + E), each vertex and edge is processed once.
- **Space Complexity:** O(V) for colours and recursion plus the output.

## Implementation

```python
from typing import List
class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        color = [0] * n
        def safe(u: int) -> bool:
            if color[u] != 0:
                return color[u] == 2
            color[u] = 1
            for v in graph[u]:
                if not safe(v):
                    return False
            color[u] = 2
            return True
        return [i for i in range(n) if safe(i)]
```
