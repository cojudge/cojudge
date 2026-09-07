## Approach

Use 1D dynamic programming. Let `dp[i]` be the minimum number of perfect squares that sum to `i`. Base case: `dp[0] = 0`. For each `i` from 1 to `n`, try every perfect square `j*j <= i` and update `dp[i] = min(dp[i], dp[i - j*j] + 1)`.

## Complexity Analysis

- **Time Complexity:** O(n * sqrt(n)), as for each of the n values we try up to sqrt(n) perfect squares.
- **Space Complexity:** O(n) for the dp array.

## Implementation

```python
class Solution:
    def numSquares(self, n: int) -> int:
        dp = [n + 1] * (n + 1)
        dp[0] = 0
        for i in range(1, n + 1):
            j = 1
            while j * j <= i:
                dp[i] = min(dp[i], dp[i - j * j] + 1)
                j += 1
        return dp[n]
```
