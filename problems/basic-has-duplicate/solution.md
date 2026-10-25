## Approach

Check every unordered index pair with nested loops. The first equal pair proves a duplicate exists; exhausting all pairs proves none exists.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False
```
