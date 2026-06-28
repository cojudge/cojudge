## Approach

Dynamic programming with two states: the maximum loot up to the previous house and the maximum loot up to the current house. At each step, either skip the current house or rob it (adding its value to the max from two houses ago).

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of houses.
- **Space Complexity:** O(1), using only constant extra space.

## Implementation

```python
from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        a, b = 0, 0
        for x in nums:
            a, b = b, max(b, a + x)
        return b
```
