## Approach

Track dp[i], the probability of ever holding exactly i points: each such probability is the mean of the up to maxPts preceding probabilities that belong to scores below k, because only those scores draw again. A sliding window keeps that running sum so every state costs O(1). Summing dp[k] through dp[n] gives the chance of stopping within the limit, formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the limit.
- **Space Complexity:** O(n) for the probability table.

## Implementation

```python
class Solution:
    def new21Game(self, n: int, k: int, maxPts: int) -> str:
        if k == 0:
            return "1.0"
        if n >= k - 1 + maxPts:
            return "1.0"
        dp = [0.0] * (n + 1)
        dp[0] = 1.0
        window = 1.0
        for i in range(1, n + 1):
            dp[i] = window / maxPts
            if i < k:
                window += dp[i]
            if i - maxPts >= 0:
                window -= dp[i - maxPts]
        return str(sum(dp[k:]))
```
