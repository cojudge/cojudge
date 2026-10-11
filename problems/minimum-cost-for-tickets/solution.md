## Approach

Mark the travel days on a 365-day calendar and sweep forward with dynamic programming. Days without travel inherit the previous cost. On travel days, compare buying a 1-day pass from yesterday, a 7-day pass from seven days back, and a 30-day pass from thirty days back, keeping the cheapest. The table entry at day 365 is the optimum.

## Complexity Analysis

- **Time Complexity:** O(365) = O(1) bounded calendar work plus O(days) to mark travel.
- **Space Complexity:** O(365) = O(1) for the calendar and DP arrays.

## Implementation

```python
from typing import List
class Solution:
    def mincostTickets(self, days: List[int], costs: List[int]) -> int:
        travel = [False] * 366
        for d in days:
            travel[d] = True
        dp = [0] * 366
        for d in range(1, 366):
            if not travel[d]:
                dp[d] = dp[d - 1]
            else:
                dp[d] = min(dp[d - 1] + costs[0], dp[max(0, d - 7)] + costs[1], dp[max(0, d - 30)] + costs[2])
        return dp[365]
```
