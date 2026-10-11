## Approach

Scan neighbours once, tracking two flags: one stays true while no drop has been seen (rising candidate) and the other while no climb has been seen (falling candidate). A climb clears the falling flag and a drop clears the rising flag. If at least one flag survives, the list is monotone.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def isMonotonic(self, nums: List[int]) -> bool:
        inc = True
        dec = True
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                dec = False
            if nums[i] < nums[i - 1]:
                inc = False
        return inc or dec
```
