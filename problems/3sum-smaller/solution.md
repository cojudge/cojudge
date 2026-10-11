## Approach

Sort the array and fix each first index in turn. With two pointers on the remaining suffix, a triple below the target means every index between the pointers also works with the fixed index, so add that whole block at once and move the left pointer forward. Otherwise move the right pointer inward. Each index is processed once as the fixed choice.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the length of `nums`, for sorting plus the nested two-pointer scan.
- **Space Complexity:** O(1) besides sorting.

## Implementation

```python
from typing import List

class Solution:
    def threeSumSmaller(self, nums: List[int], target: int) -> int:
        a = sorted(nums)
        count = 0
        for i in range(len(a) - 2):
            lo, hi = i + 1, len(a) - 1
            while lo < hi:
                if a[i] + a[lo] + a[hi] < target:
                    count += hi - lo
                    lo += 1
                else:
                    hi -= 1
        return count
```
