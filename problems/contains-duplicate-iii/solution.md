## Approach

Sweep the array while holding the last `indexDiff` values in a sorted container. For each new value, its only possible partners are the closest stored values above and below it, so checking the ceiling and the floor against `valueDiff` is sufficient. Then insert the value and evict the one sliding out of the window. Using 64-bit integers keeps extreme inputs from overflowing.

## Complexity Analysis

- **Time Complexity:** O(n log k), where k is `indexDiff`, for the ordered window operations.
- **Space Complexity:** O(k) for the window.

## Implementation

```python
import bisect
from typing import List

class Solution:
    def containsNearbyAlmostDuplicate(self, nums: List[int], indexDiff: int, valueDiff: int) -> bool:
        if indexDiff < 0 or valueDiff < 0:
            return False
        window: List[int] = []
        for i, v in enumerate(nums):
            pos = bisect.bisect_left(window, v)
            if pos < len(window) and window[pos] - v <= valueDiff:
                return True
            if pos > 0 and v - window[pos - 1] <= valueDiff:
                return True
            bisect.insort(window, v)
            if len(window) > indexDiff:
                window.pop(bisect.bisect_left(window, nums[i - indexDiff]))
        return False
```
