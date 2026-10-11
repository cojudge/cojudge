## Approach

Cut every row and column at walls into segments, count enemies inside each
segment, and record those counts in two tables. An empty cell then scores its
row count plus its column count; the maximum over all empty cells is the
answer.

## Complexity Analysis

- **Time Complexity:** O(mn) for an m x n board.
- **Space Complexity:** O(mn) for the two count tables.

## Implementation

```python
from typing import List

class Solution:
    def maxKilledEnemies(self, grid: List[List[str]]) -> int:
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        rh = [[0] * n for _ in range(m)]
        ch = [[0] * n for _ in range(m)]
        for i in range(m):
            j = 0
            while j < n:
                if grid[i][j] == "W":
                    j += 1
                    continue
                k, c = j, 0
                while k < n and grid[i][k] != "W":
                    if grid[i][k] == "E":
                        c += 1
                    k += 1
                for t in range(j, k):
                    rh[i][t] = c
                j = k
        for j in range(n):
            i = 0
            while i < m:
                if grid[i][j] == "W":
                    i += 1
                    continue
                k, c = i, 0
                while k < m and grid[k][j] != "W":
                    if grid[k][j] == "E":
                        c += 1
                    k += 1
                for t in range(i, k):
                    ch[t][j] = c
                i = k
        best = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == "0":
                    best = max(best, rh[i][j] + ch[i][j])
        return best
```
