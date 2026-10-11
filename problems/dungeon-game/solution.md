## Approach

Compute backwards from the goal. For each cell, look at the health needed upon entering the right and down neighbours and take the cheaper one; the current cell must then supply enough to survive its own value plus that future need, but never less than 1. Filling the table from bottom-right to top-left yields the starting requirement.

## Complexity Analysis

- **Time Complexity:** O(m * n) for the grid size.
- **Space Complexity:** O(m * n) for the table (reducible to O(n) with one row).

## Implementation

```python
from typing import List
class Solution:
    def calculateMinimumHP(self, dungeon: List[List[int]]) -> int:
        m, n = len(dungeon), len(dungeon[0])
        INF = float("inf")
        dp = [[INF] * (n + 1) for _ in range(m + 1)]
        dp[m][n - 1] = 1
        dp[m - 1][n] = 1
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                need = min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j]
                dp[i][j] = max(1, need)
        return dp[0][0]
```
