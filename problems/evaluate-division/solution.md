## Approach

Build a weighted bidirectional graph. For each query DFS/BFS from the source, multiplying edge weights until the destination is reached.

## Complexity Analysis

- **Time Complexity:** O((N+Q) * V) where V is number of variables
- **Space Complexity:** O(V^2)

## Implementation

```python
from typing import List
class Solution:
    def calcEquation(self, equations: List[List[str]], values: List[str], queries: List[List[str]]) -> List[str]:
        from collections import defaultdict
        g = defaultdict(dict)
        for i, eq in enumerate(equations):
            a, b = eq[0], eq[1]
            v = float(values[i])
            g[a][b] = v
            g[b][a] = 1.0 / v
        def dfs(src, dst, seen):
            if src not in g or dst not in g:
                return -1.0
            if src == dst:
                return 1.0
            seen.add(src)
            for nb, w in g[src].items():
                if nb in seen:
                    continue
                sub = dfs(nb, dst, seen)
                if sub != -1.0:
                    return w * sub
            return -1.0
        def fmt(x):
            if x < 0:
                return "-1.00000"
            return f"{x:.5f}"
        return [fmt(dfs(q[0], q[1], set())) for q in queries]
```
