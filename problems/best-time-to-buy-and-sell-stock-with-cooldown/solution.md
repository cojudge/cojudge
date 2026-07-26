## Approach

Maintain the best profit after each day in three states: holding a share, having just
sold a share, and resting without a share. Buying is allowed only from the resting
state, which enforces the one-day cooldown after a sale.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the number of days.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        hold = -prices[0]
        sold = rest = 0
        for i in range(1, len(prices)):
            previous_sold = sold
            sold = hold + prices[i]
            hold = max(hold, rest - prices[i])
            rest = max(rest, previous_sold)
        return max(sold, rest)
```
