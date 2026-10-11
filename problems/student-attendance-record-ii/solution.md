## Approach

Dynamic programming over six states combining absence usage with trailing-late count. Each new day appends P, A (when still allowed), or L (when fewer than two trail), accumulating counts modulo 1e9+7.

## Complexity Analysis

- **Time Complexity:** O(n) with constant states.
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def checkRecord(self, n: int) -> int:
        MOD = 10 ** 9 + 7
        dp = [[0] * 3 for _ in range(2)]
        dp[0][0] = 1
        for _ in range(n):
            ndp = [[0] * 3 for _ in range(2)]
            for a in range(2):
                for l in range(3):
                    v = dp[a][l]
                    if not v:
                        continue
                    ndp[a][0] = (ndp[a][0] + v) % MOD
                    if a == 0:
                        ndp[1][0] = (ndp[1][0] + v) % MOD
                    if l < 2:
                        ndp[a][l + 1] = (ndp[a][l + 1] + v) % MOD
            dp = ndp
        return sum(sum(row) for row in dp) % MOD
```
