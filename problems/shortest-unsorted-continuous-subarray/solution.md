## Approach

Sort a copy of the array and scan both versions together. The leftmost disagreement and the rightmost disagreement delimit the region that is out of place; everything outside already matches its sorted position. The window length is `right - left + 1`, or zero when the two versions agree everywhere.

## Complexity Analysis

- **Time Complexity:** O(n log n) dominated by sorting.
- **Space Complexity:** O(n) for the sorted copy.

## Implementation

```python
from typing import List

class Solution:
    def findUnsortedSubarray(self, nums: List[int]) -> int:
        s = sorted(nums)
        l = next((i for i, (a, b) in enumerate(zip(nums, s)) if a != b), None)
        if l is None:
            return 0
        r = next((i for i in range(len(nums) - 1, -1, -1) if nums[i] != s[i]), None)
        return r - l + 1
```
