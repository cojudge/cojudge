## Approach

Use binary search on the slope. Compare the middle element with its right neighbour: when it climbs upward, a peak must exist on the right side, so discard the left half; otherwise a peak sits at the middle or to its left, so discard the right half. The remaining index is a peak because the array edges only need one neighbour.

## Complexity Analysis

- **Time Complexity:** O(log n), halving the search range each step.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < nums[mid + 1]:
                lo = mid + 1
            else:
                hi = mid
        return lo
```
