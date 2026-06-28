## Approach

A graph is a valid tree if it has exactly n-1 edges and contains no cycles. Use Union-Find with path compression and union by rank to detect cycles efficiently.

## Complexity Analysis

- **Time Complexity:** O(n * α(n)), where α is the inverse Ackermann function (near-constant).
- **Space Complexity:** O(n) for the parent and rank arrays.

## Implementation

```python
from typing import List
class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        parent = list(range(n))
        rank = [0] * n
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        def union(x, y):
            rx, ry = find(x), find(y)
            if rx == ry:
                return False
            if rank[rx] < rank[ry]:
                parent[rx] = ry
            elif rank[rx] > rank[ry]:
                parent[ry] = rx
            else:
                parent[ry] = rx
                rank[rx] += 1
            return True
        for u, v in edges:
            if not union(u, v):
                return False
        return True
```
