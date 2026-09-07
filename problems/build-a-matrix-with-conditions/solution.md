## Approach

Topologically order numbers for rows and for columns. If either has a cycle, return empty. Place number `i` at `(rowIndex[i], colIndex[i])`.

## Complexity Analysis

- **Time Complexity:** O(k + E)
- **Space Complexity:** O(k + E)

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def buildMatrix(self, k: int, rowConditions: List[List[int]], colConditions: List[List[int]]) -> List[List[int]]:
        def topo(cond):
            g = [[] for _ in range(k + 1)]
            indeg = [0] * (k + 1)
            for a, b in cond:
                g[a].append(b)
                indeg[b] += 1
            q = deque([i for i in range(1, k + 1) if indeg[i] == 0])
            order = []
            while q:
                u = q.popleft()
                order.append(u)
                for v in g[u]:
                    indeg[v] -= 1
                    if indeg[v] == 0:
                        q.append(v)
            return order if len(order) == k else None
        ro, co = topo(rowConditions), topo(colConditions)
        if ro is None or co is None:
            return []
        rpos = {v: i for i, v in enumerate(ro)}
        cpos = {v: i for i, v in enumerate(co)}
        mat = [[0] * k for _ in range(k)]
        for num in range(1, k + 1):
            mat[rpos[num]][cpos[num]] = num
        return mat
```
