## Approach

Mark the mined cells, then sweep the grid four times to count unbroken ones to the left, right, above, and below each cell. The largest plus centered at a cell is limited by the shortest of its four arms, so take that minimum everywhere and keep the global maximum.

## Complexity Analysis

- **Time Complexity:** O(n^2) for the four sweeps and the final scan.
- **Space Complexity:** O(n^2) for the four direction tables (compressible to O(n^2) or O(n)).

## Implementation

```python
from typing import List
class Solution:
    def orderOfLargestPlusSign(self, n: int, mines: List[List[int]]) -> int:
        banned = set(map(tuple, mines))
        left = [[0] * n for _ in range(n)]
        right = [[0] * n for _ in range(n)]
        up = [[0] * n for _ in range(n)]
        down = [[0] * n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                if (r, c) not in banned:
                    left[r][c] = (left[r][c - 1] if c else 0) + 1
            for c in range(n - 1, -1, -1):
                if (r, c) not in banned:
                    right[r][c] = (right[r][c + 1] if c + 1 < n else 0) + 1
        for c in range(n):
            for r in range(n):
                if (r, c) not in banned:
                    up[r][c] = (up[r - 1][c] if r else 0) + 1
            for r in range(n - 1, -1, -1):
                if (r, c) not in banned:
                    down[r][c] = (down[r + 1][c] if r + 1 < n else 0) + 1
        best = 0
        for r in range(n):
            for c in range(n):
                if (r, c) not in banned:
                    best = max(best, min(left[r][c], right[r][c], up[r][c], down[r][c]))
        return best
```
