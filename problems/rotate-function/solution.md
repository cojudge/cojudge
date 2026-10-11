## Approach

Compute the score of the unrotated array and the plain sum in one pass. Each clockwise step moves every entry one slot forward (gaining the total sum) except the wrapped entry, which drops from weight `n - 1` to weight `0`. That gives the recurrence `F(k) = F(k-1) + total - n * moved`, so all scores follow in linear time while tracking the maximum.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def maxRotateFunction(self, nums: List[int]) -> int:
        n = len(nums)
        total = sum(nums)
        cur = sum(i * v for i, v in enumerate(nums))
        best = cur
        for k in range(1, n):
            cur = cur + total - n * nums[n - k]
            best = max(best, cur)
        return best
```
