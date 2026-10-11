## Approach

Two groups share a mean exactly when some proper subset of size `k` sums to `total * k / n`. Maintain for each cardinality the set of reachable sums by scanning numbers backwards, then test each `k` up to half the length for the divisibility condition and membership of the target sum.

## Complexity Analysis

- **Time Complexity:** O(n^2 * S), where S is the total sum, bounded by small n (at most 30) and values.
- **Space Complexity:** O(n * S) for the per-cardinality reachable sets.

## Implementation

```python
from typing import List
class Solution:
    def splitArraySameAverage(self, nums: List[int]) -> bool:
        n = len(nums)
        if n == 1:
            return False
        total = sum(nums)
        dp = [set() for _ in range(n // 2 + 1)]
        dp[0].add(0)
        for v in nums:
            for k in range(n // 2, 0, -1):
                for s in list(dp[k - 1]):
                    dp[k].add(s + v)
        for k in range(1, n // 2 + 1):
            if (total * k) % n == 0 and (total * k // n) in dp[k]:
                return True
        return False
```
