## Approach

Compute prefix products left-to-right, storing intermediate results in the output array. Then multiply by suffix products right-to-left to get the final result.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) excluding output

## Implementation

```python
from typing import List
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        prefix = 1
        for i in range(n):
            res[i] = prefix
            prefix *= nums[i]
        suffix = 1
        for i in range(n - 1, -1, -1):
            res[i] *= suffix
            suffix *= nums[i]
        return res
```
