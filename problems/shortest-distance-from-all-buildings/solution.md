## Approach

Launch a breadth-first search from each building, travelling only through empty cells. Every time a search reaches an empty cell at distance `d`, add `d` to that cell's running total and bump its reach counter. After all searches, the answer is the smallest total among empty cells whose counter equals the number of buildings; if none qualifies, return -1.

## Complexity Analysis

- **Time Complexity:** O(B * m * n), where B is the building count and m * n is the grid size.
- **Space Complexity:** O(m * n) for the totals, reach counts, and BFS state.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def shortestDistance(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        total = [[0] * n for _ in range(m)]
        reach = [[0] * n for _ in range(m)]
        buildings = 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] != 1:
                    continue
                buildings += 1
                seen = [[False] * n for _ in range(m)]
                q = deque([(r, c)])
                seen[r][c] = True
                dist = 0
                while q:
                    dist += 1
                    for _ in range(len(q)):
                        cr, cc = q.popleft()
                        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                            nr, nc = cr + dr, cc + dc
                            if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] and grid[nr][nc] == 0:
                                seen[nr][nc] = True
                                total[nr][nc] += dist
                                reach[nr][nc] += 1
                                q.append((nr, nc))
        best = min((total[r][c] for r in range(m) for c in range(n)
                    if grid[r][c] == 0 and reach[r][c] == buildings), default=None)
        return -1 if best is None else best
```
