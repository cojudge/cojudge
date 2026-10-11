## Approach

Because the input is sorted, the largest square must come from one of the two ends: the most negative value or the most positive one. Place two pointers at both ends and repeatedly compare their squares, writing the larger one into the answer from back to front and advancing the winning pointer. This merges the two monotone square sequences without an extra sort.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of nums. Each position is visited once.
- **Space Complexity:** O(n) for the output array (O(1) extra besides it).

## Implementation

```python
from typing import List
class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [0] * n
        lo, hi = 0, n - 1
        for p in range(n - 1, -1, -1):
            lq = nums[lo] * nums[lo]
            hq = nums[hi] * nums[hi]
            if lq > hq:
                ans[p] = lq
                lo += 1
            else:
                ans[p] = hq
                hi -= 1
        return ans
```
