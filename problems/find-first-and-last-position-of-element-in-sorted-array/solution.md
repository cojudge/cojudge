## Approach

Binary-search twice over the sorted array: one pass keeps going left after a hit to pin down the first occurrence, and the other keeps going right to pin down the last. Missing targets naturally leave the answer at -1 on both passes.

## Complexity Analysis

- **Time Complexity:** O(log n) for the two binary searches.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
from typing import List
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def bound(first: bool) -> int:
            lo, hi, ans = 0, len(nums) - 1, -1
            while lo <= hi:
                m = (lo + hi) // 2
                if nums[m] == target:
                    ans = m
                    if first:
                        hi = m - 1
                    else:
                        lo = m + 1
                elif nums[m] < target:
                    lo = m + 1
                else:
                    hi = m - 1
            return ans
        return [bound(True), bound(False)]
```
