## Approach

Scan every cell once, tracking the extreme black rows and columns; the enclosing area is height times width of that bounding box.

## Complexity Analysis

- **Time Complexity:** O(m x n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def minArea(self, image: List[List[str]], x: int, y: int) -> int:
        top = bottom = x
        left = right = y
        for i, row in enumerate(image):
            for j, c in enumerate(row):
                if c == '1':
                    top, bottom = min(top, i), max(bottom, i)
                    left, right = min(left, j), max(right, j)
        return (bottom - top + 1) * (right - left + 1)
```
