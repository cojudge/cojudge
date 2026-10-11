## Approach

Because the visible array is sorted, halving the search interval quickly homes in on the goal. Compare the middle entry with the target and discard the half that cannot contain it. An exponential probe to discover a tight window mirrors the original unknown-length technique, but a direct binary search over the whole supplied array meets the same bounds and is simpler.

## Complexity Analysis

- **Time Complexity:** O(log n) comparisons.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def search(self, arr: List[int], target: int) -> int:
        lo, hi = 0, len(arr) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1
```
