## Approach

Scan from the third element onward with a write pointer starting at index 2. Copy the current value forward only when it differs from the value two slots behind the write position, which guarantees no value appears more than twice. Arrays shorter than three elements are already valid.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass.
- **Space Complexity:** O(1), in-place writes.

## Implementation

```python
from typing import List
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if len(nums) <= 2:
            return len(nums)
        k = 2
        for i in range(2, len(nums)):
            if nums[i] != nums[k - 2]:
                nums[k] = nums[i]
                k += 1
        return k
```
