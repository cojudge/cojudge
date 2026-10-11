## Approach

Sort the opponent's positions from weakest to strongest while keeping the cards in a counted multiset. For the strongest remaining opponent, spend the smallest card that still beats it; if no such card exists, sacrifice the weakest card. Working from large to small guarantees every winnable slot is won with minimal waste, which maximizes the total count.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting and multiset operations.
- **Space Complexity:** O(n) for the ordering and answer.

## Implementation

```python
from typing import List
from bisect import bisect_right

class Solution:
    def advantageCount(self, nums1: List[int], nums2: List[int]) -> List[int]:
        import bisect
        n = len(nums1)
        order = sorted(range(n), key=lambda i: nums2[i])
        pool = sorted(nums1)
        ans = [0] * n
        # two-pointer assignment using sorted pool
        for idx in reversed(order):
            opp = nums2[idx]
            pos = bisect.bisect_right(pool, opp)
            if pos < len(pool):
                ans[idx] = pool.pop(pos)
            else:
                ans[idx] = pool.pop(0)
        return ans
```
