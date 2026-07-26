## Approach

Treat each value as a pointer to another index. Because there are `n + 1` entries whose values are in `[1, n]`, this pointer graph contains a cycle, and the cycle entrance is the duplicate value. First use slow and fast pointers to meet inside the cycle, then reset one pointer to `nums[0]` and advance both one step until they meet at the entrance.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = nums[0]
        fast = nums[0]

        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break

        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow
```
