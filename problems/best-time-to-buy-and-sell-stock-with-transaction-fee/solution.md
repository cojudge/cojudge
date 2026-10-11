## Approach

Keep two running balances: `hold` for ending the day with a share and `cash` for ending with no share. Each new price lets hold improve by buying from cash, and lets cash improve by selling from hold minus the fee. Both start from day zero and roll forward.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of prices.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def maxProfit(self, prices: List[int], fee: int) -> int:
        hold = -prices[0]
        cash = 0
        for p in prices[1:]:
            hold = max(hold, cash - p)
            cash = max(cash, hold + p - fee)
        return cash
```
