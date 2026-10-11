## Approach

Gather all trees (values above 1) and sort them by height to fix the cutting order. Starting from (0,0), run breadth-first search to each target in turn, skipping blocked zeros. Accumulate the distances; if any search fails, return -1.

## Complexity Analysis

- **Time Complexity:** O(T * m * n) where T is the tree count, for one BFS per tree.
- **Space Complexity:** O(m * n) for the visited set and queue.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def cutOffTree(self, forest: List[List[int]]) -> int:
        m, n = len(forest), len(forest[0])
        trees = sorted([(forest[i][j], i, j) for i in range(m) for j in range(n) if forest[i][j] > 1])
        def bfs(sr, sc, tr, tc):
            if sr == tr and sc == tc:
                return 0
            vis = [[False]*n for _ in range(m)]
            q = deque([(sr, sc)])
            vis[sr][sc] = True
            dist = 0
            while q:
                dist += 1
                for _ in range(len(q)):
                    r, c = q.popleft()
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = r+dr, c+dc
                        if 0 <= nr < m and 0 <= nc < n and not vis[nr][nc] and forest[nr][nc] != 0:
                            if nr == tr and nc == tc:
                                return dist
                            vis[nr][nc] = True
                            q.append((nr, nc))
            return -1
        sr = sc = total = 0
        for _, tr, tc in trees:
            d = bfs(sr, sc, tr, tc)
            if d < 0:
                return -1
            total += d
            sr, sc = tr, tc
        return total
```
