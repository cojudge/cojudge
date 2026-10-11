## Approach

Simulate the pouring level by level with a small table that only needs rows up to the queried one. Each glass keeps at most one cup and forwards half its surplus to each of its two children. The queried entry capped at one is formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(r^2), where r is `query_row` (at most 100).
- **Space Complexity:** O(r^2) for the simulated triangle.

## Implementation

```python
class Solution:
    def champagneTower(self, poured: int, query_row: int, query_glass: int) -> str:
        dp = [[0.0] * (query_row + 2) for _ in range(query_row + 2)]
        dp[0][0] = float(poured)
        for r in range(query_row + 1):
            for c in range(r + 1):
                excess = (dp[r][c] - 1.0) / 2.0
                if excess > 0:
                    dp[r + 1][c] += excess
                    dp[r + 1][c + 1] += excess
        return str(min(1.0, dp[query_row][query_glass]))
```
