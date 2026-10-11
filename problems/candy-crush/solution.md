## Approach

Loop crush-then-drop until no run qualifies. Each crush pass scans rows and columns for 3+ equal non-zero runs and marks them first so crosses vanish together, then zeroes them. Gravity compacts every column bottom-up. When a pass marks nothing, encode each row of digits as one string.

## Complexity Analysis

- **Time Complexity:** O((m*n)^2) worst case, but each crush removes at least three cells so passes are few; each pass is O(m*n).
- **Space Complexity:** O(m*n) for the integer copy and mark grid.

## Implementation

```python
from typing import List
class Solution:
    def candyCrush(self, board: List[List[str]]) -> List[str]:
        m, n = len(board), len(board[0])
        g = [[ord(board[r][c]) - 48 for c in range(n)] for r in range(m)]
        while True:
            crush = [[False]*n for _ in range(m)]
            any_crush = False
            for r in range(m):
                c = 0
                while c < n:
                    if g[r][c] == 0:
                        c += 1
                        continue
                    nc = c
                    while nc < n and g[r][nc] == g[r][c]:
                        nc += 1
                    if nc - c >= 3:
                        for k in range(c, nc):
                            crush[r][k] = True
                        any_crush = True
                    c = nc
            for c in range(n):
                r = 0
                while r < m:
                    if g[r][c] == 0:
                        r += 1
                        continue
                    nr = r
                    while nr < m and g[nr][c] == g[r][c]:
                        nr += 1
                    if nr - r >= 3:
                        for k in range(r, nr):
                            crush[k][c] = True
                        any_crush = True
                    r = nr
            if not any_crush:
                break
            for r in range(m):
                for c in range(n):
                    if crush[r][c]:
                        g[r][c] = 0
            for c in range(n):
                w = m - 1
                for r in range(m - 1, -1, -1):
                    if g[r][c] != 0:
                        g[w][c] = g[r][c]
                        w -= 1
                for r in range(w, -1, -1):
                    g[r][c] = 0
        return [''.join(str(g[r][c]) for c in range(n)) for r in range(m)]
```
