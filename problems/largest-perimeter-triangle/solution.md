## Approach

Sort the lengths increasingly. In a sorted array the best triangle using a given longest side always uses its two immediate predecessors, because they give the largest possible sum against it. Scanning triples from the largest end downward, the first triple satisfying small + middle > large is therefore optimal; if none qualifies, no triangle exists.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting, where n is the number of sticks.
- **Space Complexity:** O(1) extra besides sorting.

## Implementation

```python
from typing import List
class Solution:
    def largestPerimeter(self, nums: List[int]) -> int:
        nums.sort()
        for i in range(len(nums) - 1, 1, -1):
            if nums[i - 2] + nums[i - 1] > nums[i]:
                return nums[i - 2] + nums[i - 1] + nums[i]
        return 0
```
