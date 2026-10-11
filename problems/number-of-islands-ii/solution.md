## Approach

Dynamic union-find: activate each cell, then union it with land neighbours; the island count rises by one per new cell and falls per successful merge.

## Complexity Analysis

- **Time Complexity:** O(k x a(mn))
- **Space Complexity:** O(m x n)

## Implementation

```python
from typing import List
class Solution:
    def numIslands2(self, m: int, n: int, positions: List[List[int]]) -> List[int]:
        parent = {}
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        res, count = [], 0
        for r, c in positions:
            if (r, c) in parent:
                res.append(count)
                continue
            parent[(r, c)] = (r, c)
            count += 1
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nb = (r + dr, c + dc)
                if nb in parent and find((r, c)) != find(nb):
                    parent[find((r, c))] = find(nb)
                    count -= 1
            res.append(count)
        return res
```
