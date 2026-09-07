## Approach

Binary-search the answer between `max(weights)` and `sum(weights)`.
For a candidate capacity, greedily pack packages in order and count the
days needed; this test is monotone, so the smallest feasible capacity is
the lower bound of the feasible suffix.

## Complexity Analysis

- **Time Complexity:** O(n log(sum - max))
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List


class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        def can_ship(capacity: int) -> bool:
            used, load = 1, 0
            for w in weights:
                if load + w > capacity:
                    used += 1
                    load = w
                else:
                    load += w
            return used <= days

        low, high = max(weights), sum(weights)
        while low < high:
            mid = low + (high - low) // 2
            if can_ship(mid):
                high = mid
            else:
                low = mid + 1
        return low
```
