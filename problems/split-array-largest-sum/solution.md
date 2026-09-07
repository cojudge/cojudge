## Approach

Binary search the minimized largest sum. For a candidate limit, greedily count how many subarrays are needed. Feasible iff that count is at most `k`.

## Complexity Analysis

- **Time Complexity:** O(n log S) where S is the total sum
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        lo, hi = max(nums), sum(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            parts = 1
            cur = 0
            for x in nums:
                if cur + x > mid:
                    parts += 1
                    cur = 0
                cur += x
            if parts <= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
```
