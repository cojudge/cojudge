## Approach

Walk the array from left to right checking each element. Return the current index at the first match, or -1 when the loop finishes without one.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def findIndex(self, nums: List[int], target: int) -> int:
        for i in range(len(nums)):
            if nums[i] == target:
                return i
        return -1
```
