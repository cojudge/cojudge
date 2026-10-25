## Approach

Walk through the array once, adding each element to a running total that starts at zero.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def arraySum(self, nums: List[int]) -> int:
        total = 0
        for x in nums:
            total += x
        return total
```
