## Approach

Sweep once while tracking the current increasing run. If the new value exceeds its predecessor, grow the run; otherwise restart it at length one. Record the largest run observed. Empty input gives zero.

## Complexity Analysis

- **Time Complexity:** O(n), single pass.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def findLengthOfLCIS(self, nums: List[int]) -> int:
        if not nums:
            return 0
        best = cur = 1
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                cur += 1
            else:
                cur = 1
            best = max(best, cur)
        return best
```
