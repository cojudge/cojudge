## Approach

Binary-search the lower bound: keep an inclusive interval and move past the middle whenever it is smaller than the target. When the loop ends, `left` is the first index with value `>= target`, which is either the target's index or its insertion position.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List


class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            middle = left + (right - left) // 2
            if nums[middle] == target:
                return middle
            if nums[middle] < target:
                left = middle + 1
            else:
                right = middle - 1
        return left
```
