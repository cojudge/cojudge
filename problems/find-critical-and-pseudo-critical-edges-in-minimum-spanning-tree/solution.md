## Approach

Sort edges and compute the base MST weight with Kruskal. An edge is critical if MST without it is heavier. It is pseudo-critical if forcing it still yields the base weight (and it is not critical).

## Complexity Analysis

- **Time Complexity:** O(E^2 α(n))
- **Space Complexity:** O(E)

## Implementation

```python
from typing import List
class Solution:
    def findCriticalAndPseudoCriticalEdges(self, n: int, edges: List[List[int]]) -> List[List[int]]:
        m = len(edges)
        es = [edges[i] + [i] for i in range(m)]
        es.sort(key=lambda e: e[2])
        def mst(exclude=-1, force=-1):
            parent = list(range(n))
            def find(x):
                while parent[x] != x:
                    parent[x] = parent[parent[x]]
                    x = parent[x]
                return x
            def union(a, b):
                a, b = find(a), find(b)
                if a == b:
                    return False
                parent[a] = b
                return True
            w = used = 0
            if force != -1:
                for u, v, wt, i in es:
                    if i == force:
                        union(u, v)
                        w += wt
                        used += 1
                        break
            for u, v, wt, i in es:
                if i == exclude or i == force:
                    continue
                if union(u, v):
                    w += wt
                    used += 1
            return w if used == n - 1 else 10**18
        base = mst()
        crit, pseudo = [], []
        for u, v, wt, i in es:
            if mst(exclude=i) > base:
                crit.append(i)
            elif mst(force=i) == base:
                pseudo.append(i)
        return [crit, pseudo]
```
