## Approach

Perform DFS from the Pacific (top/left edges) and Atlantic (bottom/right edges) oceans, marking reachable cells by flowing uphill. Cells reachable from both oceans are the answer.

## Complexity Analysis

- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n)

## Implementation

```python
from typing import List
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        m, n = len(heights), len(heights[0])
        pac = [[False] * n for _ in range(m)]
        atl = [[False] * n for _ in range(m)]
        def dfs(i, j, ocean):
            ocean[i][j] = True
            for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and not ocean[ni][nj] and heights[ni][nj] >= heights[i][j]:
                    dfs(ni, nj, ocean)
        for i in range(m):
            dfs(i, 0, pac)
            dfs(i, n - 1, atl)
        for j in range(n):
            dfs(0, j, pac)
            dfs(m - 1, j, atl)
        res = []
        for i in range(m):
            for j in range(n):
                if pac[i][j] and atl[i][j]:
                    res.append([i, j])
        return res
```
