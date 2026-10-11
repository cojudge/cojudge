## Approach

Scan triples from left to right while remembering how many arithmetic slices end at the previous position. When the current gap matches the prior gap, each slice ending before extends by one element plus the new length-3 window, so the running count grows by one and adds to the total; a mismatched gap resets the streak.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        if len(nums) < 3:
            return 0
        total = cur = 0
        for i in range(2, len(nums)):
            if nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]:
                cur += 1
                total += cur
            else:
                cur = 0
        return total
```
