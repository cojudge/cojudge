## Approach

Scan once to build suffix minimums, then sweep from the left tracking the running prefix maximum. The first position where the prefix maximum is at most the suffix minimum starting just after it gives the shortest valid left piece, because any valid cut must satisfy exactly this condition.

## Complexity Analysis

- **Time Complexity:** O(n) for the two linear passes.
- **Space Complexity:** O(n) for the suffix minima (reducible to O(1) with a two-pass variant).

## Implementation

```python
from typing import List
class Solution:
    def partitionDisjoint(self, nums: List[int]) -> int:
        n = len(nums)
        suf = [0] * n
        suf[-1] = nums[-1]
        for i in range(n - 2, -1, -1):
            suf[i] = min(suf[i + 1], nums[i])
        pre = nums[0]
        for i in range(n - 1):
            pre = max(pre, nums[i])
            if pre <= suf[i + 1]:
                return i + 1
        return n
```
