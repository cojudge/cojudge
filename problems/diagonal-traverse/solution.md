## Approach

Walk the grid with a row, column and upward flag. Emit the current cell, then compute the next step: moving up-right increases column and decreases row, moving down-left does the opposite. Border checks for the last row/column or first row/column trigger a sidestep and direction flip. This visits each cell exactly once.

## Complexity Analysis

- **Time Complexity:** O(m * n) for the single walk.
- **Space Complexity:** O(1) besides the output array.

## Implementation

```python
from typing import List

class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        if not mat or not mat[0]:
            return []
        m, n = len(mat), len(mat[0])
        ans: List[int] = []
        r = c = 0
        up = True
        while len(ans) < m * n:
            ans.append(mat[r][c])
            if up:
                if c == n - 1:
                    r += 1
                    up = False
                elif r == 0:
                    c += 1
                    up = False
                else:
                    r -= 1
                    c += 1
            else:
                if r == m - 1:
                    c += 1
                    up = True
                elif c == 0:
                    r += 1
                    up = True
                else:
                    r += 1
                    c -= 1
        return ans
```
