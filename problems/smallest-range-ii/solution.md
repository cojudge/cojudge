## Approach

Sort the values. In an optimal assignment there is a dividing line: smaller elements are raised and larger ones are lowered (any interleaving can be uncrossed without hurting the spread). For each possible dividing line the spread is determined by the largest of the two group maxima minus the smallest of the two group minima. Checking every line plus the untouched spread gives the optimum.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting, then O(n) for the scan.
- **Space Complexity:** O(n) for the sorted copy (O(1) extra besides sorting).

## Implementation

```python
from typing import List
class Solution:
    def smallestRangeII(self, nums: List[int], k: int) -> int:
        a = sorted(nums)
        ans = a[-1] - a[0]
        for i in range(1, len(a)):
            hi = max(a[i - 1] + k, a[-1] - k)
            lo = min(a[0] + k, a[i] - k)
            ans = min(ans, hi - lo)
        return ans
```
