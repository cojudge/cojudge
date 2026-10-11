## Approach

Because the array is sorted, the predicate citations[i] >= n - i becomes true once and stays true. Binary-search the leftmost true index i and return n - i, or 0 when no index qualifies.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def hIndex(self, citations: List[int]) -> int:
        n = len(citations)
        lo, hi = 0, n
        while lo < hi:
            mid = (lo + hi) // 2
            if citations[mid] >= n - mid:
                hi = mid
            else:
                lo = mid + 1
        h = n - lo
        if lo < n and citations[lo] >= h:
            return h
        return 0
```
