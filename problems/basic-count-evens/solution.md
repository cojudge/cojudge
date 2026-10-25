## Approach

Scan the array with a counter starting at zero. Bump the counter for each element divisible by two.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def countEvens(self, nums: List[int]) -> int:
        count = 0
        for x in nums:
            if x % 2 == 0:
                count += 1
        return count
```
