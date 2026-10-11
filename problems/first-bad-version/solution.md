## Approach

Treat isBadVersion(v) as v >= bad and binary-search the inclusive range [1, n]. When mid is bad, record it and search left; otherwise search right.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def firstBadVersion(self, n: int, bad: int) -> int:
        def isBad(v: int) -> bool:
            return v >= bad
        lo, hi, ans = 1, n, n
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if isBad(mid):
                ans = mid
                hi = mid - 1
            else:
                lo = mid + 1
        return ans
```
