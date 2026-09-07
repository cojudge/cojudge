## Approach

Repeatedly peel leaves until one or two nodes remain. Those centroids are the MHT roots.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        if n == 1:
            return [0]
        g = [set() for _ in range(n)]
        for a, b in edges:
            g[a].add(b)
            g[b].add(a)
        leaves = [i for i in range(n) if len(g[i]) == 1]
        remain = n
        while remain > 2:
            remain -= len(leaves)
            nxt = []
            for leaf in leaves:
                nb = g[leaf].pop()
                g[nb].remove(leaf)
                if len(g[nb]) == 1:
                    nxt.append(nb)
            leaves = nxt
        return leaves
```
