## Approach

For a candidate speed, compute the required hours by summing `ceil(pile / speed)` over all piles. Feasibility is monotonic: once a speed is fast enough, every larger speed is also fast enough. Binary-search the first feasible speed between `1` and the largest pile.

## Complexity Analysis

- **Time Complexity:** O(n log M), where `n` is the number of piles and `M` is the largest pile.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        left, right = 1, max(piles)
        while left < right:
            speed = left + (right - left) // 2
            hours = 0
            for pile in piles:
                hours += (pile + speed - 1) // speed
                if hours > h:
                    break
            if hours <= h:
                right = speed
            else:
                left = speed + 1
        return left
```
