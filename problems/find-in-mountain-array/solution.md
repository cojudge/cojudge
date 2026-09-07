## Approach

Find the peak with binary search (`arr[mid] < arr[mid+1]` means the peak is
to the right). Then binary-search the increasing left part normally and the
decreasing right part with reversed comparisons. Check the left side first
so the returned index is minimal.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List


class Solution:
    def findInMountainArray(self, arr: List[int], target: int) -> int:
        left, right = 0, len(arr) - 1
        while left < right:
            mid = left + (right - left) // 2
            if arr[mid] < arr[mid + 1]:
                left = mid + 1
            else:
                right = mid
        peak = left

        def search_asc(lo: int, hi: int) -> int:
            while lo <= hi:
                mid = lo + (hi - lo) // 2
                if arr[mid] == target:
                    return mid
                if arr[mid] < target:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return -1

        def search_desc(lo: int, hi: int) -> int:
            while lo <= hi:
                mid = lo + (hi - lo) // 2
                if arr[mid] == target:
                    return mid
                if arr[mid] > target:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return -1

        hit = search_asc(0, peak)
        if hit != -1:
            return hit
        return search_desc(peak + 1, len(arr) - 1)
```
