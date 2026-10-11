## Approach

Build a table over playlist length and distinct songs used. Extending a list either introduces a fresh song (`n - used` options) or replays a song already present, which is legal only when at least `k` other songs intervene (`used - k` replayable choices). All operations run modulo 1,000,000,007, and the target cell uses the full length with every song appearing.

## Complexity Analysis

- **Time Complexity:** O(goal * n) table entries, each in O(1).
- **Space Complexity:** O(goal * n), compressible to O(n).

## Implementation

```python
class Solution:
    def numPlaylists(self, n: int, goal: int, k: int) -> int:
        mod = 10 ** 9 + 7
        dp = [[0] * (n + 1) for _ in range(goal + 1)]
        dp[0][0] = 1
        for i in range(1, goal + 1):
            for j in range(1, min(i, n) + 1):
                dp[i][j] = dp[i - 1][j - 1] * (n - j + 1) % mod
                if j > k:
                    dp[i][j] = (dp[i][j] + dp[i - 1][j] * (j - k)) % mod
        return dp[goal][n]
```
