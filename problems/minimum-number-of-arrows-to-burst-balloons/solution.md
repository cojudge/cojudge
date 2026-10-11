## Approach

Sort all spans by right endpoint. Shoot the first arrow at the earliest finishing end, which hits every balloon starting at or before it. Move to the first unhit balloon and repeat. This greedy choice leaves maximal room for the rest, so it uses the fewest arrows.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting, plus O(n) scanning.
- **Space Complexity:** O(1) extra beyond sorting.

## Implementation

```python
from typing import List
class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        if not points:
            return 0
        points = sorted(points, key=lambda p: p[1])
        arrows = 1
        end = points[0][1]
        for s, e in points[1:]:
            if s > end:
                arrows += 1
                end = e
        return arrows
```
