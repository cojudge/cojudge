## Approach

View the matrix as a graph and flood-fill each component with depth-first search. Iterate cities in order; every time an unvisited city appears, explore its whole reachable group and increment the province counter.

## Complexity Analysis

- **Time Complexity:** O(n^2) to scan the matrix.
- **Space Complexity:** O(n) for visited flags and recursion.

## Implementation

```python
from typing import List
class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        vis = [False] * n
        def dfs(u: int):
            vis[u] = True
            for v in range(n):
                if isConnected[u][v] == 1 and not vis[v]:
                    dfs(v)
        cnt = 0
        for i in range(n):
            if not vis[i]:
                cnt += 1
                dfs(i)
        return cnt
```
