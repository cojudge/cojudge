## Approach

Root the tree at node 0 and run a post-order pass that counts each subtree's size and sums distances inside it: a parent's total is the children's totals plus one extra edge per descendant. Then run a pre-order pass that reroots across each edge — moving the root from parent to child shortens every path into the child's subtree by one and lengthens every other path by one, giving childAnswer = parentAnswer - size[child] + (n - size[child]). Both passes are linear.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the node count; each edge is traversed twice.
- **Space Complexity:** O(n) for the adjacency list, counts, and answers (plus recursion depth).

## Implementation

```python
from typing import List

class Solution:
    def sumOfDistancesInTree(self, n: int, edges: List[List[int]]) -> List[int]:
        import sys
        sys.setrecursionlimit(100000)
        g = [[] for _ in range(n)]
        for a, b in edges:
            g[a].append(b)
            g[b].append(a)
        cnt = [0] * n
        ans = [0] * n

        def dfs1(u, p):
            cnt[u] = 1
            for v in g[u]:
                if v == p:
                    continue
                dfs1(v, u)
                cnt[u] += cnt[v]
                ans[u] += ans[v] + cnt[v]

        def dfs2(u, p):
            for v in g[u]:
                if v == p:
                    continue
                ans[v] = ans[u] - cnt[v] + (n - cnt[v])
                dfs2(v, u)

        dfs1(0, -1)
        dfs2(0, -1)
        return ans
```
