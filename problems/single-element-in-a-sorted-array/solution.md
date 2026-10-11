## Approach

Because pairs start at even positions before the lone element and at odd positions after it, binary search can locate the disruption. Force each midpoint to be even: when it matches its right neighbour the single lies further right, otherwise it lies at or left of the midpoint.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if mid % 2 == 1:
                mid -= 1
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2
            else:
                hi = mid
        return nums[lo]
```
