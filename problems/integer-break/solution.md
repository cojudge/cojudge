## Approach

Use 1D dynamic programming. Let `dp[i]` be the maximum product obtainable by breaking `i` into a sum of at least two positive integers. Base case: `dp[1] = 1`. For each `i` from 2 to `n`, pick a first part `j` (1 <= j < i). The remaining value `i - j` can either be kept whole or broken further, so the best product using part `j` is `max(j, dp[j]) * (i - j)`. Take the maximum over all `j`.

## Complexity Analysis

- **Time Complexity:** O(n^2), as for each of the n values we try up to n candidate first parts.
- **Space Complexity:** O(n) for the dp array.

## Implementation

```python
class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [0] * (n + 1)
        dp[1] = 1
        for i in range(2, n + 1):
            for j in range(1, i):
                dp[i] = max(dp[i], max(j, dp[j]) * (i - j))
        return dp[n]
```