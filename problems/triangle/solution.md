## Approach

Collapse the triangle from the bottom up. The cheapest cost of reaching the bottom from cell `(i, j)` equals its own value plus the smaller of the two reachable cells below it. Processing rows in reverse turns the bottom row into the initial DP state, then each higher row overwrites it in place.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the number of rows. Each cell is visited once.
- **Space Complexity:** O(n) for the one-dimensional DP array.

## Implementation

```python
from typing import List
class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = [0] * (len(triangle) + 1)
        for i in range(len(triangle) - 1, -1, -1):
            for j in range(len(triangle[i])):
                dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
        return dp[0]
```
