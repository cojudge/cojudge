## Approach

This is a two-dimensional knapsack: `dp[j][p]` counts the plans that use exactly `j` members and bank profit `p`, where every profit above the target is folded down into the target column so the table stays compact. Each scheme is considered once, updating the table backwards over members and profit so no scheme is reused within its own step. The answer sums the target-profit column over all feasible member counts, modulo `10^9 + 7`.

## Complexity Analysis

- **Time Complexity:** O(m * n * minProfit), where m is the number of schemes.
- **Space Complexity:** O(n * minProfit) for the counting table.

## Implementation

```python
from typing import List

class Solution:
    def profitableSchemes(self, n: int, minProfit: int, group: List[int], profit: List[int]) -> int:
        MOD = 1000000007
        dp = [[0] * (minProfit + 1) for _ in range(n + 1)]
        dp[0][0] = 1
        for g, p in zip(group, profit):
            for j in range(n, g - 1, -1):
                for k in range(minProfit, -1, -1):
                    nk = min(minProfit, k + p)
                    dp[j][nk] = (dp[j][nk] + dp[j - g][k]) % MOD
        return sum(dp[j][minProfit] for j in range(n + 1)) % MOD
```
