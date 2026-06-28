## Approach
Kadane's algorithm: maintain a running sum, resetting it to the current element if the running sum becomes smaller. Track the maximum running sum encountered.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation
```python
from typing import List
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        res = cur = nums[0]
        for n in nums[1:]:
            cur = max(n, cur + n)
            res = max(res, cur)
        return res
```
