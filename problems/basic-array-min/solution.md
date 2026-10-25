## Approach

Seed the answer with the first element. Scan the rest, keeping the smaller value each time a new minimum appears.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def arrayMin(self, nums: List[int]) -> int:
        best = nums[0]
        for x in nums[1:]:
            if x < best:
                best = x
        return best
```
