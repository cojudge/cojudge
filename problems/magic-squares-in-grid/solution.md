## Approach

Slide every 3 by 3 window across the grid. For each window first confirm it contains 1 through 9 exactly once, then confirm the three rows, three columns, and two diagonals each total 15. Count windows passing both screens.

## Complexity Analysis

- **Time Complexity:** O(R * C), where R and C are grid dimensions, with constant work per window.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def numMagicSquaresInside(self, grid: List[List[int]]) -> int:
        R, C = len(grid), len(grid[0]) if grid else 0
        if R < 3 or C < 3:
            return 0
        def magic(r, c):
            vals = [grid[r+i][c+j] for i in range(3) for j in range(3)]
            if sorted(vals) != list(range(1, 10)):
                return False
            for i in range(3):
                if sum(grid[r+i][c:c+3]) != 15:
                    return False
                if grid[r][c+i] + grid[r+1][c+i] + grid[r+2][c+i] != 15:
                    return False
            if grid[r][c] + grid[r+1][c+1] + grid[r+2][c+2] != 15:
                return False
            if grid[r][c+2] + grid[r+1][c+1] + grid[r+2][c] != 15:
                return False
            return True
        ans = 0
        for i in range(R - 2):
            for j in range(C - 2):
                if magic(i, j):
                    ans += 1
        return ans
```
