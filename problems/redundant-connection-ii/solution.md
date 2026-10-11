## Approach

Look for a node with two incoming edges. If none exists, the extra edge is the one that closes an undirected cycle, found with union-find. If a conflict exists, test the two candidate edges by skipping each and checking for a cycle; prefer the later edge when it also resolves the cycle.

## Complexity Analysis

- **Time Complexity:** O(n alpha(n)) with path compression.
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List
class Solution:
    def findRedundantDirectedConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        parent = {}
        candA = candB = -1
        for i, (u, v) in enumerate(edges):
            if v not in parent:
                parent[v] = i
            else:
                candA, candB = parent[v], i
                break
        def find(ds, x):
            while ds[x] != x:
                ds[x] = ds[ds[x]]
                x = ds[x]
            return x
        def has_cycle(skip):
            ds = list(range(n + 1))
            for i, (u, v) in enumerate(edges):
                if i == skip:
                    continue
                pu, pv = find(ds, u), find(ds, v)
                if pu == pv:
                    return True
                ds[pu] = pv
            return False
        if candA == -1:
            ds = list(range(n + 1))
            for u, v in edges:
                pu, pv = find(ds, u), find(ds, v)
                if pu == pv:
                    return [u, v]
                ds[pu] = pv
        else:
            if not has_cycle(candB):
                return edges[candB]
            return edges[candA]
        return []
```
