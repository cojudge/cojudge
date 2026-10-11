## Approach

Flood-fill the grid once, stamping every connected group of ones with its own id while storing each group's cell count. Then examine each zero cell, collect the distinct island ids touching it on four sides, and compute one plus the sum of those islands' sizes. The maximum over all zeros (or the full grid area when no zero exists) is the answer.

## Complexity Analysis

- **Time Complexity:** O(n^2) where n is the grid side length; each cell is visited a constant number of times.
- **Space Complexity:** O(n^2) for the id grid and the explicit stack.

## Implementation

```python
from typing import List
from collections import deque

class Solution:
    def largestIsland(self, grid: List[List[int]]) -> int:
        n = len(grid)
        comp = [[0] * n for _ in range(n)]
        size = {}
        cur = 2
        best = 0
        dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
        for i in range(n):
            for j in range(n):
                if grid[i][j] == 1 and comp[i][j] == 0:
                    q = deque([(i, j)])
                    comp[i][j] = cur
                    s = 0
                    while q:
                        x, y = q.popleft()
                        s += 1
                        for dx, dy in dirs:
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < n and 0 <= ny < n and grid[nx][ny] == 1 and comp[nx][ny] == 0:
                                comp[nx][ny] = cur
                                q.append((nx, ny))
                    size[cur] = s
                    best = max(best, s)
                    cur += 1
        has_zero = False
        for i in range(n):
            for j in range(n):
                if grid[i][j] == 0:
                    has_zero = True
                    seen = set()
                    for dx, dy in dirs:
                        ni, nj = i + dx, j + dy
                        if 0 <= ni < n and 0 <= nj < n and comp[ni][nj] != 0:
                            seen.add(comp[ni][nj])
                    best = max(best, 1 + sum(size[k] for k in seen))
        return best if has_zero else n * n
```
