## Approach

Sort a copy of the array and cut it into a smaller half and a larger half. Reverse both halves and interleave them (small, large, small, large, ...). Reversing keeps equal values apart so that every even position is strictly below its right neighbor and every odd position strictly above, whenever a valid ordering exists.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the length of `nums`, dominated by sorting.
- **Space Complexity:** O(n) for the sorted copy and the result.

## Implementation

```python
from typing import List
class Solution:
    def wiggleSort(self, nums: List[int]) -> List[int]:
        s = sorted(nums)
        n = len(nums)
        mid = (n + 1) // 2
        left = s[:mid][::-1]
        right = s[mid:][::-1]
        res = []
        for i in range(len(right)):
            res.append(left[i])
            res.append(right[i])
        if len(left) > len(right):
            res.append(left[-1])
        return res
```
