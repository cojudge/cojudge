## Approach

Let `dp[i]` count the full tilings of a `2 x i` board. The rightmost strip
can end with a vertical domino, two horizontal dominoes, or one of the two
tromino pairs, which together yield `dp[i] = 2 * dp[i-1] + dp[i-3]`. Start
from `dp[0]=1, dp[1]=1, dp[2]=2` and iterate upward, reducing modulo
`1_000_000_007` at each step.

## Complexity Analysis

- **Time Complexity:** O(n) for the linear pass.
- **Space Complexity:** O(n), reducible to O(1) by keeping only the last three values.

## Implementation

```python
class Solution:
    def numTilings(self, n: int) -> int:
        MOD = 1_000_000_007
        if n == 0:
            return 1
        if n == 1:
            return 1
        if n == 2:
            return 2
        dp = [0] * (n + 1)
        dp[0], dp[1], dp[2] = 1, 1, 2
        for i in range(3, n + 1):
            dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD
        return dp[n]
```
