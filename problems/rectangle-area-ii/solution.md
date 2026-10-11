## Approach

Gather every rectangle border into sorted unique x and y lists. These borders split the plane into small cells where coverage is uniform: a cell counts exactly when some input rectangle spans it fully. Summing cell areas modulo 1e9+7 yields the union size.

## Complexity Analysis

- **Time Complexity:** O(n^3), where n <= 200, for cells times rectangle checks (at most 400x400 cells).
- **Space Complexity:** O(n) for the compressed coordinate lists.

## Implementation

```python
from typing import List
class Solution:
    def rectangleArea(self, rectangles: List[List[int]]) -> int:
        MOD = 10**9 + 7
        xs = sorted({x for r in rectangles for x in (r[0], r[2])})
        ys = sorted({y for r in rectangles for y in (r[1], r[3])})
        ans = 0
        for i in range(len(xs) - 1):
            for j in range(len(ys) - 1):
                x1, x2, y1, y2 = xs[i], xs[i+1], ys[j], ys[j+1]
                for r in rectangles:
                    if r[0] <= x1 and x2 <= r[2] and r[1] <= y1 and y2 <= r[3]:
                        ans = (ans + (x2 - x1) * (y2 - y1)) % MOD
                        break
        return ans
```
