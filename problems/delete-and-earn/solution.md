## Approach

Add up the points per distinct value: choosing `v` earns `v` times its count and forbids `v - 1` and `v + 1`. Sweeping values upward, keep two numbers: the best total using values below `v - 1` (skippable) and the best total ending with a take at the previous value. Taking `v` adds its points to the skippable best; skipping keeps the better of the two.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n is the array length and m the largest value (at most 10000).
- **Space Complexity:** O(m) for the per-value totals.

## Implementation

```python
from typing import List
class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        mx = max(nums)
        pts = [0] * (mx + 1)
        for v in nums:
            pts[v] += v
        take = skip = 0
        for v in range(mx + 1):
            take, skip = skip + pts[v], max(skip, take)
        return max(take, skip)
```
