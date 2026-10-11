## Approach

Sweep the sorted array while remembering where the current consecutive run began. Extend the run while each next value is exactly one more than the previous; when the run breaks, emit the start alone for a single value or `start->end` for a longer run. Widening to 64-bit arithmetic before adding one keeps the extreme 32-bit values safe.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass.
- **Space Complexity:** O(1) besides the output labels.

## Implementation

```python
from typing import List

class Solution:
    def summaryRanges(self, nums: List[int]) -> List[str]:
        res: List[str] = []
        i = 0
        while i < len(nums):
            start = nums[i]
            while i + 1 < len(nums) and nums[i + 1] == nums[i] + 1:
                i += 1
            end = nums[i]
            if start == end:
                res.append(str(start))
            else:
                res.append(f"{start}->{end}")
            i += 1
        return res
```
