## Approach

Binary-search the best average value. For a guess `mid`, subtract it from every element and ask whether any block of length at least k sums to zero or more, which is true exactly when `mid` is achievable. The check runs in linear time with prefix sums that remember the smallest prefix at least k positions back. Sixty halvings pin the value far beyond the required tolerance.

## Complexity Analysis

- **Time Complexity:** O(n log precision), with n the array length and about 60 probe rounds.
- **Space Complexity:** O(n) for the prefix sums.

## Implementation

```python
from typing import List

class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> str:
        def ok(mid):
            pre = [0.0]
            for v in nums:
                pre.append(pre[-1] + v - mid)
            best = 0.0
            for i in range(k, len(pre)):
                best = min(best, pre[i - k])
                if pre[i] - best >= 0:
                    return True
            return False
        lo, hi = min(nums), max(nums)
        for _ in range(60):
            mid = (lo + hi) / 2
            if ok(mid):
                lo = mid
            else:
                hi = mid
        return str(lo)
```
