## Approach

Find the overall maximum in one pass. In a second pass track the largest value that is still smaller than that maximum.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def secondLargest(self, nums: List[int]) -> int:
        mx = max(nums)
        return max(x for x in nums if x < mx)
```
