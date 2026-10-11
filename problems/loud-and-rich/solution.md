## Approach

Flip each richer edge so it runs from the poorer person to the richer one. A memoized depth-first search then answers each node: start with yourself, recurse into every richer neighbour, and keep whichever candidate has the smallest quiet score. Memoization guarantees each node resolves once.

## Complexity Analysis

- **Time Complexity:** O(n + E), where n is the person count and E the richer pair count.
- **Space Complexity:** O(n + E) for the reversed graph plus recursion state.

## Implementation

```python
from typing import List
class Solution:
    def loudAndRich(self, richer: List[List[int]], quiet: List[int]) -> List[int]:
        n = len(quiet)
        g = [[] for _ in range(n)]
        for a, b in richer:
            g[b].append(a)
        ans = [-1] * n
        def dfs(x):
            if ans[x] >= 0:
                return ans[x]
            ans[x] = x
            for y in g[x]:
                c = dfs(y)
                if quiet[c] < quiet[ans[x]]:
                    ans[x] = c
            return ans[x]
        for i in range(n):
            dfs(i)
        return ans
```
