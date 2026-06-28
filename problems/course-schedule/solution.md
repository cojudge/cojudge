## Approach

Topological sort (Kahn's algorithm) counting processed nodes; if all courses are processed there is no cycle.

## Complexity Analysis

- **Time Complexity:** O(V+E)
- **Space Complexity:** O(V+E)

## Implementation

```python
from typing import List
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indeg[a] += 1
        q = [i for i in range(numCourses) if indeg[i] == 0]
        cnt = 0
        while q:
            node = q.pop(0)
            cnt += 1
            for nb in adj[node]:
                indeg[nb] -= 1
                if indeg[nb] == 0:
                    q.append(nb)
        return cnt == numCourses
```
