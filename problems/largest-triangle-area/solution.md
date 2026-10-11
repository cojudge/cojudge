## Approach

Enumerate every unordered triple of points and evaluate its area with the shoelace formula, keeping the maximum. With at most 50 points the cubic scan is easily fast enough. Degenerate collinear triples naturally yield zero and never beat a positive area. Format the best value as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n^3) for n points, one constant-time area per triple.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def largestTriangleArea(self, points: List[List[int]]) -> str:
        best = 0.0
        n = len(points)
        for i in range(n):
            x1, y1 = points[i]
            for j in range(i + 1, n):
                x2, y2 = points[j]
                for k in range(j + 1, n):
                    x3, y3 = points[k]
                    a = abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0
                    if a > best:
                        best = a
        return str(best)
```
