## Approach

Define dp[i] as the most characters reachable in i presses. Pressing plain A extends the previous best by one. Otherwise pick a breakpoint j where typing stops: two presses select and copy dp[j], and the remaining i-j-2 presses paste, multiplying to dp[j]*(i-j-1). Maximizing over valid breakpoints fills the table bottom-up.

## Complexity Analysis

- **Time Complexity:** O(n^2) for n up to 50.
- **Space Complexity:** O(n) for the table.

## Implementation

```python
class Solution:
    def maxA(self, n: int) -> int:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i - 1] + 1
            for j in range(1, i - 2):
                dp[i] = max(dp[i], dp[j] * (i - j - 1))
        return dp[n]
```
