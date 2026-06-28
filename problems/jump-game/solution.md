## Approach

Greedily track the farthest reachable index while iterating through the array. If the current index exceeds the farthest reachable position, it is impossible to proceed further.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array.
- **Space Complexity:** O(1), using only constant extra space.

## Implementation

```python
from typing import List
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0
        for i, n in enumerate(nums):
            if i > reach:
                return False
            reach = max(reach, i + n)
        return True
```
