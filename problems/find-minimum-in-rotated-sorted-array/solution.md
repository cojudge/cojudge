## Approach

Binary search on the rotated array. Compare the middle element with the rightmost element to decide which half contains the minimum (pivot point).

## Complexity Analysis

- **Time Complexity:** O(log n), where n is the length of the array.
- **Space Complexity:** O(1), using only constant extra space.

## Implementation

```python
from typing import List
class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums) - 1
        while l < r:
            m = (l + r) // 2
            if nums[m] > nums[r]:
                l = m + 1
            else:
                r = m
        return nums[l]
```
