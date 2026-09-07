## Approach

Use two pointers at both ends of the sorted array and shrink the window until `k` elements remain. At each step compare `|arr[left] - x|` and `|arr[right] - x|`; discard the farther end. On ties discard the right end to prefer the smaller value. The remaining window is already sorted.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `arr`. Each step removes one element (O(log n + k) with binary search for the window start).
- **Space Complexity:** O(k) for the returned window, O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        left, right = 0, len(arr) - 1
        while right - left + 1 > k:
            if abs(arr[left] - x) > abs(arr[right] - x):
                left += 1
            else:
                right -= 1
        return arr[left:left + k]
```
