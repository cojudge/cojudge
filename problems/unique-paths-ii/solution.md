## Approach

Use 2D dynamic programming. Let `dp[i][j]` be the number of unique paths to reach cell `(i, j)`. Since the robot can only move down or right, `dp[i][j] = dp[i][j - 1] + dp[i - 1][j]`. If a cell is an obstacle (`obstacleGrid[i][j] == 1`), set `dp[i][j] = 0`. If the start cell itself is an obstacle, the answer is 0.

## Complexity Analysis

- **Time Complexity:** O(m * n), visiting each cell once.
- **Space Complexity:** O(m * n) for the dp table (can be reduced to O(n) with a single row).

## Implementation

```python
from typing import List
class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        if obstacleGrid[0][0] == 1:
            return 0
        dp = [[0] * n for _ in range(m)]
        dp[0][0] = 1
        for i in range(m):
            for j in range(n):
                if i == 0 and j == 0:
                    continue
                if obstacleGrid[i][j] == 1:
                    dp[i][j] = 0
                else:
                    dp[i][j] = (dp[i - 1][j] if i > 0 else 0) + (dp[i][j - 1] if j > 0 else 0)
        return dp[m - 1][n - 1]
```