## Approach

Run a depth-first search that carries the path from the start vertex. Each time the final vertex is reached, store a copy of the current path; otherwise extend the path with each outgoing neighbour and backtrack after the recursive call.

## Complexity Analysis

- **Time Complexity:** O(2^n * n) in the worst case, proportional to the number of paths times path length.
- **Space Complexity:** O(n) for the recursion stack plus the output storage.

## Implementation

```python
from typing import List
class Solution:
    def allPathsSourceTarget(self, graph: List[List[int]]) -> List[List[int]]:
        res = []
        path = [0]
        def dfs(u: int):
            if u == len(graph) - 1:
                res.append(list(path))
                return
            for v in graph[u]:
                path.append(v)
                dfs(v)
                path.pop()
        dfs(0)
        return res
```
