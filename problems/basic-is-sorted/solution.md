## Approach

Scan adjacent pairs from left to right. Any drop proves the array is unsorted; surviving the whole scan proves it is sorted.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def isSorted(self, nums: List[int]) -> bool:
        for i in range(1, len(nums)):
            if nums[i] < nums[i - 1]:
                return False
        return True
```
