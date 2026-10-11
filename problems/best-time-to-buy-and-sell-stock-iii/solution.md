## Approach

Keep the best balance after each of the four actions: first purchase, first sale, second purchase, and second sale. Scanning prices once and updating these states in order lets the second purchase spend profit banked from the first sale. The final second-sale value is the answer.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of days.
- **Space Complexity:** O(1), using four scalar states.

## Implementation

```python
from typing import List
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        buy1 = float("-inf")
        sell1 = 0
        buy2 = float("-inf")
        sell2 = 0
        for p in prices:
            buy1 = max(buy1, -p)
            sell1 = max(sell1, buy1 + p)
            buy2 = max(buy2, sell1 - p)
            sell2 = max(sell2, buy2 + p)
        return sell2
```
