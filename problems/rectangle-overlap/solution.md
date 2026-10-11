## Approach

Two rectangles share area exactly when their x-intervals overlap with positive length and their y-intervals do too. That is four strict inequalities: each rectangle's left edge must sit left of the other's right edge on both axes. Edge or corner contact fails a strict check, which is precisely the required behaviour.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def isRectangleOverlap(self, rec1: List[int], rec2: List[int]) -> bool:
        return rec1[0] < rec2[2] and rec2[0] < rec1[2] and rec1[1] < rec2[3] and rec2[1] < rec1[3]
```
