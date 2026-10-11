## Approach

Anchor each point in turn and group the remaining points by reduced slope. Dividing `(dx, dy)` by their gcd and fixing the sign gives a canonical key, with flat and vertical lines handled separately. The largest bucket plus the anchor is the best line through that anchor; the global maximum over anchors is the answer.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the number of points. Each anchor scans all later points with gcd work.
- **Space Complexity:** O(n) for the slope map of one anchor.

## Implementation

```python
from typing import List
import math
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n <= 2:
            return n
        best = 0
        for i in range(n):
            slopes = {}
            cur_best = 0
            xi, yi = points[i]
            for j in range(i + 1, n):
                dx = points[j][0] - xi
                dy = points[j][1] - yi
                if dx == 0 and dy == 0:
                    continue
                if dx == 0:
                    key = ("v",)
                elif dy == 0:
                    key = ("h",)
                else:
                    g = math.gcd(abs(dx), abs(dy))
                    dx //= g
                    dy //= g
                    if dx < 0:
                        dx, dy = -dx, -dy
                    key = (dx, dy)
                slopes[key] = slopes.get(key, 0) + 1
                cur_best = max(cur_best, slopes[key])
            best = max(best, cur_best + 1)
        return best
```
