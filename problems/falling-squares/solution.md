## Approach

Keep every landed square as a triple of left edge, right edge, and top height. For each newcomer, scan earlier squares and keep the greatest top among those whose horizontal ranges strictly overlap; the newcomer then rises from that base by its own side length. Append its top to the placed list and update the running global maximum, which is recorded after each drop.

## Complexity Analysis

- **Time Complexity:** O(n^2) pairwise overlap checks.
- **Space Complexity:** O(n) for placed squares.

## Implementation

```python
from typing import List
class Solution:
    def fallingSquares(self, positions: List[List[int]]) -> List[int]:
        placed = []
        ans = []
        cur_max = 0
        for l, s in positions:
            r = l + s
            base = 0
            for pl, pr, top in placed:
                if l < pr and r > pl:
                    base = max(base, top)
            top = base + s
            placed.append((l, r, top))
            cur_max = max(cur_max, top)
            ans.append(cur_max)
        return ans
```
