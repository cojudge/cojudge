## Approach

Compare each middle index with its right neighbour: an upward slope means the summit is further right, a downward slope means it is at or left of centre. Halving the interval on this test homes in on the unique peak.

## Complexity Analysis

- **Time Complexity:** O(log n), where n is the array length.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def peakIndexInMountainArray(self, arr: List[int]) -> int:
        lo, hi = 0, len(arr) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] < arr[mid + 1]:
                lo = mid + 1
            else:
                hi = mid
        return lo
```
