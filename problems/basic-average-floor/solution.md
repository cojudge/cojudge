## Approach

Add up all elements, then divide by the count with integer division, which discards any fraction.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def avgFloor(self, nums: List[int]) -> int:
        return sum(nums) // len(nums)
```
