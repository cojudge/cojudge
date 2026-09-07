## Approach

Use 2D dynamic programming. Let `dp[i][j]` be the minimum path sum to reach cell `(i, j)`. Because movement is only down or right, `dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])`. Initialize the first row and first column with cumulative sums since only one direction is possible along the borders, then fill the rest in row-major order.

## Complexity Analysis

- **Time Complexity:** O(m * n), visiting each cell once.
- **Space Complexity:** O(m * n) for the dp table (can be reduced to O(n) by updating in place).

## Implementation

```python
from typing import List
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for _ in range(m)]
        dp[0][0] = grid[0][0]
        for j in range(1, n):
            dp[0][j] = dp[0][j - 1] + grid[0][j]
        for i in range(1, m):
            dp[i][0] = dp[i - 1][0] + grid[i][0]
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
        return dp[m - 1][n - 1]
```