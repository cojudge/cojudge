## Approach

Since houses are arranged in a circle (first and last are adjacent), split into two linear cases: rob houses 0 to n-2 or rob houses 1 to n-1. Use the standard House Robber I DP on each case and take the maximum.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of houses.
- **Space Complexity:** O(1), using only constant extra space.

## Implementation

```python
from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        def helper(arr):
            a, b = 0, 0
            for x in arr:
                a, b = b, max(b, a + x)
            return b
        return max(helper(nums[:-1]), helper(nums[1:]))
```
