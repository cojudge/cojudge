## Approach

Treat every cell on its own: a tower of height `v > 0` exposes `4*v + 2` unit squares (four sides per cube plus a top and a bottom). Adding those overcounts only where two towers stand shoulder to shoulder. A neighbouring pair of heights `a` and `b` conceals `min(a, b)` squares on each of the two touching walls, so subtract `2*min(a,b)` once per adjacent pair by scanning right and down neighbours only.

## Complexity Analysis

- **Time Complexity:** O(n^2) for an n by n board, one pass for towers and one for adjacencies.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def surfaceArea(self, grid: List[List[int]]) -> int:
        n = len(grid)
        ans = 0
        for i in range(n):
            for j in range(len(grid[i])):
                v = grid[i][j]
                if v > 0:
                    ans += 4 * v + 2
        for i in range(n):
            for j in range(len(grid[i])):
                if j + 1 < len(grid[i]):
                    ans -= 2 * min(grid[i][j], grid[i][j + 1])
                if i + 1 < n and j < len(grid[i + 1]):
                    ans -= 2 * min(grid[i][j], grid[i + 1][j])
        return ans
```
