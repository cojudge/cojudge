## Approach

Sort the houses and the heaters. For every house, locate where it would slot into the sorted heater list with binary search: only the immediate predecessor and successor can be closest, so compute both distances and keep the smaller one. The required shared radius is the maximum over houses of those nearest distances, because the farthest house dictates the radius.

## Complexity Analysis

- **Time Complexity:** O((H + T) log T) for sorting plus one binary search per house, where H is the house count and T the heater count.
- **Space Complexity:** O(1) extra besides sorting.

## Implementation

```python
import bisect
from typing import List

class Solution:
    def findRadius(self, houses: List[int], heaters: List[int]) -> int:
        houses = sorted(houses)
        heaters = sorted(heaters)
        ans = 0
        for h in houses:
            i = bisect.bisect_left(heaters, h)
            best = float("inf")
            if i < len(heaters):
                best = min(best, heaters[i] - h)
            if i > 0:
                best = min(best, h - heaters[i - 1])
            ans = max(ans, best)
        return ans
```
