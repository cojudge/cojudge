## Approach

Binary search between the ends. If the middle value exceeds the right value, the minimum lies to the right; if it is smaller, it lies at or left of middle. On equality the right end is a duplicate that reveals nothing, so shrink it by one and continue.

## Complexity Analysis

- **Time Complexity:** O(log n) on average, O(n) worst case when many duplicates force linear shrinking.
- **Space Complexity:** O(1), using two indices.

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
            elif nums[m] < nums[r]:
                r = m
            else:
                r -= 1
        return nums[l]
```
