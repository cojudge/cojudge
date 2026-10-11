## Approach

All updates cover the origin, so the cells incremented every time are the rectangle bounded by the smallest a and smallest b. Its area is the number of maxima; with no operations the whole grid ties.

## Complexity Analysis

- **Time Complexity:** O(k) for k operations.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def maxCount(self, m: int, n: int, ops: List[List[int]]) -> int:
        if not ops:
            return m * n
        return min(a for a, _ in ops) * min(b for _, b in ops)
```
