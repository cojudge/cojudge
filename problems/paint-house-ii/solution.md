## Approach

Only the best and second-best totals from the previous house are needed. Each color adds its painting cost to the best previous total unless that best used the same color, in which case it uses the second best. Scanning all houses this way keeps the work linear in houses times colors with constant extra state per color count.

## Complexity Analysis

- **Time Complexity:** O(n * k), where n is the number of houses and k is the number of colors.
- **Space Complexity:** O(k) for one row of totals.

## Implementation

```python
from typing import List

class Solution:
    def minCostII(self, costs: List[List[int]]) -> int:
        if not costs:
            return 0
        dp = costs[0][:]
        for row in costs[1:]:
            m1 = m2 = float("inf")
            i1 = -1
            for j, v in enumerate(dp):
                if v < m1:
                    m2, m1, i1 = m1, v, j
                elif v < m2:
                    m2 = v
            dp = [c + (m2 if j == i1 else m1) for j, c in enumerate(row)]
        return min(dp)
```
