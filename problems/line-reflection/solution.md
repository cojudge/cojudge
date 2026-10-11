## Approach

The extreme x values pin down the only possible mirror: it must lie halfway
between the minimum and maximum x. Collect every point in a hash set, then
verify that each point's partner at `minX + maxX - x` with the same y is also
present.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of points.
- **Space Complexity:** O(n) for the point set.

## Implementation

```python
from typing import List

class Solution:
    def isReflected(self, points: List[List[int]]) -> bool:
        if not points:
            return True
        mn = min(p[0] for p in points)
        mx = max(p[0] for p in points)
        seen = {(x, y) for x, y in points}
        total = mn + mx
        return all((total - x, y) in seen for x, y in points)
```
