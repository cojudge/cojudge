## Approach

Add the whole array once. Then walk left to right keeping the sum seen so far; the right sum is total minus left minus the current value. The first index where both sides match is the answer, otherwise -1.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def pivotIndex(self, nums: List[int]) -> int:
        total = sum(nums)
        left = 0
        for i, v in enumerate(nums):
            if left == total - left - v:
                return i
            left += v
        return -1
```
