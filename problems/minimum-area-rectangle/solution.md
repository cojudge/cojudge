## Approach

Store every point in a hash set for O(1) lookups. Treat each pair as a potential diagonal: it defines a rectangle exactly when the other two corners exist in the set. Track the minimum width-times-height over all valid diagonals.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the number of points. Each pair is checked once.
- **Space Complexity:** O(n) for the point set.

## Implementation

```python
from typing import List
class Solution:
    def minAreaRect(self, points: List[List[int]]) -> int:
        s = {(x, y) for x, y in points}
        best = float('inf')
        n = len(points)
        for i in range(n):
            x1, y1 = points[i]
            for j in range(i + 1, n):
                x2, y2 = points[j]
                if x1 == x2 or y1 == y2:
                    continue
                if (x1, y2) in s and (x2, y1) in s:
                    best = min(best, abs(x1 - x2) * abs(y1 - y2))
                    if best == 1:
                        return 1
        return 0 if best == float('inf') else best
```
