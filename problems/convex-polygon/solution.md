## Approach

For each triple of consecutive vertices (wrapping around), compute the cross product of the two edge vectors: its sign reports a left or right turn. Collinear triples give zero and are ignored. If all non-zero turns share one sign, the polygon is convex; the first sign disagreement proves a dent.

## Complexity Analysis

- **Time Complexity:** O(n) for the single pass over the vertices.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def isConvex(self, polygon: List[List[int]]) -> bool:
        n = len(polygon)
        sign = 0
        for i in range(n):
            ax, ay = polygon[i]
            bx, by = polygon[(i + 1) % n]
            cx, cy = polygon[(i + 2) % n]
            cross = (bx - ax) * (cy - by) - (by - ay) * (cx - bx)
            if cross != 0:
                s = 1 if cross > 0 else -1
                if sign == 0:
                    sign = s
                elif sign != s:
                    return False
        return True
```
