## Approach

Seed the answer with the first element. Scan the rest of the array, replacing the answer whenever a larger value appears.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def arrayMax(self, nums: List[int]) -> int:
        best = nums[0]
        for x in nums[1:]:
            if x > best:
                best = x
        return best
```
