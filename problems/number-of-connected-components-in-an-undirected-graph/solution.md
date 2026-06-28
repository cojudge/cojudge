## Approach

Use Union-Find with path compression and union by rank to connect nodes. Each successful union decreases the component count, starting from n.

## Complexity Analysis

- **Time Complexity:** O(n * α(n))
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
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
            if union(u, v):
                n -= 1
        return n
```
