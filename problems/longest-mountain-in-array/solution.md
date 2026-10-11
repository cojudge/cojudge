## Approach

Scan for peaks higher than both neighbours. From each peak stretch left while values rise strictly and right while they fall strictly, measuring the full span. Keep the best span seen; positions without both sides do not count.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length, since each index is visited at most twice.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def longestMountain(self, arr: List[int]) -> int:
        n, best, i = len(arr), 0, 1
        while i < n - 1:
            if arr[i] > arr[i-1] and arr[i] > arr[i+1]:
                l, r = i - 1, i + 1
                while l > 0 and arr[l] > arr[l-1]:
                    l -= 1
                while r + 1 < n and arr[r] > arr[r+1]:
                    r += 1
                best = max(best, r - l + 1)
                i = r + 1
            else:
                i += 1
        return best
```
