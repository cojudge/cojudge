## Approach

For any cap, the number of subarrays with all values at most the cap is found in one pass by extending the current valid run. Subtracting the count for `left - 1` from the count for `right` leaves exactly those subarrays whose maximum reaches `left` yet never exceeds `right`.

## Complexity Analysis

- **Time Complexity:** O(n), two linear scans over `nums`.
- **Space Complexity:** O(1), only counters are kept.

## Implementation

```python
from typing import List
class Solution:
    def numSubarrayBoundedMax(self, nums: List[int], left: int, right: int) -> int:
        def capped(cap: int) -> int:
            ans = cur = 0
            for v in nums:
                if v <= cap:
                    cur += 1
                    ans += cur
                else:
                    cur = 0
            return ans
        return capped(right) - capped(left - 1)
```
