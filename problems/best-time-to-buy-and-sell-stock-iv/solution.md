## Approach

When `k` covers half the days, any profitable day-to-day step can be banked, so the answer is the sum of positive differences. Otherwise keep two small tables over the trade count: the best balance while holding a share and while holding nothing. Each price either improves a buy (`sell[j-1] - price`) or a sell (`buy[j] + price`), which captures the optimal set of at most `k` round trips in one pass.

## Complexity Analysis

- **Time Complexity:** O(n * k), one update per day per allowed trade.
- **Space Complexity:** O(k) for the buy/sell tables.

## Implementation

```python
from typing import List

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        n = len(prices)
        if n <= 1 or k <= 0:
            return 0
        if k >= n // 2:
            return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))
        buy = [float("-inf")] * (k + 1)
        sell = [0] * (k + 1)
        for p in prices:
            for j in range(1, k + 1):
                buy[j] = max(buy[j], sell[j - 1] - p)
                sell[j] = max(sell[j], buy[j] + p)
        return sell[k]
```
