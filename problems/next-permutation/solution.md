## Approach

Find the pivot: the rightmost index holding a value smaller than its right neighbor. If none exists the array is fully descending, so reversing everything yields the smallest ordering. Otherwise swap the pivot with the rightmost element larger than it (the minimal viable increase), then reverse the suffix after the pivot to make it ascending.

## Complexity Analysis

- **Time Complexity:** O(n) with a few linear scans.
- **Space Complexity:** O(1) extra space (O(n) here for the returned copy).

## Implementation

```python
from typing import List
class Solution:
    def nextPermutation(self, nums: List[int]) -> List[int]:
        a = list(nums)
        i = len(a) - 2
        while i >= 0 and a[i] >= a[i + 1]:
            i -= 1
        if i >= 0:
            j = len(a) - 1
            while a[j] <= a[i]:
                j -= 1
            a[i], a[j] = a[j], a[i]
        a[i + 1:] = reversed(a[i + 1:])
        return a
```
