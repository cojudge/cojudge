## Approach

Sum the areas of all small blocks and track the extreme coordinates of their union. Insert each block corner into a set, removing it when seen again, so shared interior corners cancel and only unmatched corners survive. A perfect tiling leaves exactly the four bounding-box corners and has total area equal to the bounding-box area; any gap, overlap, or stray corner breaks one of those checks.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the number of rectangles.
- **Space Complexity:** O(m) for the corner set.

## Implementation

```python
from typing import List

class Solution:
    def isRectangleCover(self, rectangles: List[List[int]]) -> bool:
        area = 0
        min_x = min_y = 10 ** 9
        max_x = max_y = -10 ** 9
        corners = set()
        for x1, y1, x2, y2 in rectangles:
            area += (x2 - x1) * (y2 - y1)
            min_x = min(min_x, x1); min_y = min(min_y, y1)
            max_x = max(max_x, x2); max_y = max(max_y, y2)
            for p in ((x1, y1), (x1, y2), (x2, y1), (x2, y2)):
                if p in corners:
                    corners.remove(p)
                else:
                    corners.add(p)
        if len(corners) != 4:
            return False
        if {(min_x, min_y), (min_x, max_y), (max_x, min_y), (max_x, max_y)} != corners:
            return False
        return area == (max_x - min_x) * (max_y - min_y)
```
