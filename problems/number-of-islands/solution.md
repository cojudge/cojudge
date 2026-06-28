## Approach

Iterate through the grid and whenever a land cell (1) is found, increment the island count and use DFS to sink the entire connected component by marking visited cells as 0.

## Complexity Analysis

- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n) worst-case recursion depth

## Implementation

```python
from typing import List
class Solution:
    def numIslands(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != 1:
                return
            grid[i][j] = 0
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        cnt = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    cnt += 1
                    dfs(i, j)
        return cnt
```
