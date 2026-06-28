## Approach

Bottom-up DP where dp[i] is the minimum coins needed for amount i, iterating over each coin for each amount.

## Complexity Analysis

- **Time Complexity:** O(amount * len(coins))
- **Space Complexity:** O(amount)

## Implementation

```python
from typing import List
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i >= c:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1
```
