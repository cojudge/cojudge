## Approach

Sort a copy of the array so the two-pointer sweep applies. Fix each index in turn as the first element of the triple and move two pointers inward, keeping whichever total lands nearest the target. Whenever the current sum falls short of the target the left pointer advances, otherwise the right pointer retreats; an exact hit ends the search immediately.

## Complexity Analysis

- **Time Complexity:** O(n^2) from sorting plus one linear sweep per fixed index.
- **Space Complexity:** O(n) for the sorted copy (O(1) besides input storage with in-place sort).

## Implementation

```python
from typing import List
class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        a = sorted(nums)
        best = a[0] + a[1] + a[2]
        for i in range(len(a) - 2):
            l, r = i + 1, len(a) - 1
            while l < r:
                s = a[i] + a[l] + a[r]
                if abs(s - target) < abs(best - target):
                    best = s
                if s < target:
                    l += 1
                elif s > target:
                    r -= 1
                else:
                    return target
        return best
```
