## Approach

Binary search on a rotated array with duplicates. When `nums[lo] == nums[mid] == nums[hi]`, shrink both ends. Otherwise decide which half is sorted and narrow the search.

## Complexity Analysis

- **Time Complexity:** O(n) worst case with many duplicates, O(log n) average
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def search(self, nums: List[int], target: int) -> bool:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return True
            if nums[lo] == nums[mid] == nums[hi]:
                lo += 1
                hi -= 1
                continue
            if nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return False
```
