## Approach

Sort the points and build the extreme corners with a monotone chain that drops clockwise turns. Those corners alone miss trees lying flat on an edge, so each hull segment is rescanned and every collinear input point between its endpoints is added as well.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting plus O(h*n) edge scans.
- **Space Complexity:** O(n) for sorted points and the hull.

## Implementation

```python
from typing import List
class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        pts = sorted(map(tuple, trees))
        if len(pts) <= 3:
            return [list(p) for p in pts]
        def cross(a, b, c):
            return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
        lower = []
        for p in pts:
            while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
                lower.pop()
            lower.append(p)
        upper = []
        for p in reversed(pts):
            while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
                upper.pop()
            upper.append(p)
        hull = lower[:-1] + upper[:-1]
        seen = set(hull)
        for i in range(len(hull)):
            a, b = hull[i], hull[(i+1) % len(hull)]
            for p in pts:
                if cross(a, b, p) == 0 and min(a[0],b[0]) <= p[0] <= max(a[0],b[0]) and min(a[1],b[1]) <= p[1] <= max(a[1],b[1]):
                    seen.add(p)
        return [list(p) for p in seen]
```
