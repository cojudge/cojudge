## Approach
Track both the maximum and minimum product ending at each position, since a negative number can flip the minimum into the maximum. At each step, compute the new candidates and update the global result.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation
```python
from typing import List
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = max(nums)
        cur_min = cur_max = 1
        for n in nums:
            tmp = cur_max * n
            cur_max = max(tmp, cur_min * n, n)
            cur_min = min(tmp, cur_min * n, n)
            res = max(res, cur_max)
        return res
```
