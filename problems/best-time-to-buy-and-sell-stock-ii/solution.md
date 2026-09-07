## Approach

Sum every positive adjacent difference. Since unlimited transactions are allowed, each uphill step `prices[i] - prices[i-1] > 0` can be captured as its own buy-sell pair, and the sum of those steps equals the optimal profit.

## Complexity Analysis

- **Time Complexity:** O(n), single pass over `prices`.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
```
