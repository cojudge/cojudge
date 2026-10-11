## Approach

Squared distances avoid roots. A square yields four equal small values and two equal large ones with the large equal to twice the small; any repeated point gives a zero side and fails.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def validSquare(self, p1: List[int], p2: List[int], p3: List[int], p4: List[int]) -> bool:
        def d2(a, b):
            return (a[0]-b[0])**2 + (a[1]-b[1])**2
        pts = [p1, p2, p3, p4]
        d = sorted(d2(pts[i], pts[j]) for i in range(4) for j in range(i+1, 4))
        return d[0] > 0 and d[0]==d[1]==d[2]==d[3] and d[4]==d[5]==2*d[0]
```
