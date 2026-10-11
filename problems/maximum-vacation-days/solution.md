## Approach

Keep one DP row across cities: after processing each week, `dp[j]` holds the best vacation total for being in city `j` that week. The first week is seeded from city 0 through flights or staying; every later week relaxes each destination over all origins that can reach it. Impossible states carry negative infinity, and the maximum over the final row is the answer.

## Complexity Analysis

- **Time Complexity:** O(k * n^2) for k weeks over all origin-destination pairs.
- **Space Complexity:** O(n) for the two rolling rows.

## Implementation

```python
from typing import List

class Solution:
    def maxVacationDays(self, flights: List[List[int]], days: List[List[int]]) -> int:
        n, k = len(flights), len(days[0])
        NEG = float("-inf")
        dp = [NEG] * n
        for j in range(n):
            if j == 0 or flights[0][j] == 1:
                dp[j] = days[j][0]
        for week in range(1, k):
            nd = [NEG] * n
            for j in range(n):
                for i in range(n):
                    if dp[i] != NEG and (i == j or flights[i][j] == 1):
                        nd[j] = max(nd[j], dp[i] + days[j][week])
            dp = nd
        return max(dp)
```
