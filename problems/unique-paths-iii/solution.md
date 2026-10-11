## Approach

Count all non-blocked cells to know the required walk length. Then run depth-first search with backtracking from the start: temporarily mark each entered open cell as blocked, explore the four neighbors, and restore the mark on return. Reaching the finish cell counts one valid walk only when the visited count equals the total open-cell count, which enforces the exactly-once covering rule.

## Complexity Analysis

- **Time Complexity:** O(3^k), where k is the number of open cells. Each step has at most three fresh neighbors.
- **Space Complexity:** O(k) for recursion depth and the grid copy.

## Implementation

```python
from typing import List
class Solution:
    def uniquePathsIII(self, grid: List[List[int]]) -> int:
        R, C = len(grid), len(grid[0])
        total = sum(1 for i in range(R) for j in range(C) if grid[i][j] != -1)
        sx = sy = -1
        for i in range(R):
            for j in range(C):
                if grid[i][j] == 1:
                    sx, sy = i, j
        self.ans = 0
        def dfs(x, y, vis):
            if not (0 <= x < R and 0 <= y < C) or grid[x][y] == -1:
                return
            if grid[x][y] == 2:
                if vis == total:
                    self.ans += 1
                return
            saved = grid[x][y]
            grid[x][y] = -1
            dfs(x + 1, y, vis + 1)
            dfs(x - 1, y, vis + 1)
            dfs(x, y + 1, vis + 1)
            dfs(x, y - 1, vis + 1)
            grid[x][y] = saved
        dfs(sx, sy, 1)
        return self.ans
```
