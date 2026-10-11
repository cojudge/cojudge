## Approach

Count trees with dynamic programming over the Catalan recurrence. With one node fixed as root, left and right subtree counts multiply; summing over every root choice builds larger answers from smaller ones, starting from dp[0] = dp[1] = 1.

## Complexity Analysis

- **Time Complexity:** O(n^2) for the nested root loop.
- **Space Complexity:** O(n) for the dp table.

## Implementation

```python
class Solution:
    def numTrees(self, n: int) -> int:
        dp = [0] * (n + 1)
        dp[0] = 1
        if n >= 1:
            dp[1] = 1
        for i in range(2, n + 1):
            total = 0
            for r in range(1, i + 1):
                total += dp[r - 1] * dp[i - r]
            dp[i] = total
        return dp[n]
```
