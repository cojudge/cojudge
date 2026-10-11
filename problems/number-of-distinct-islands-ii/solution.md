## Approach

Flood-fill every island to gather its cells. For each island, apply the eight rotation/reflection maps, shift every variant so its minimum lands at the origin, sort the points and encode them. The smallest encoding is the canonical key; equal keys mean equal shapes under the allowed motions. Counting keys gives the answer.

## Complexity Analysis

- **Time Complexity:** O(m*n*log(k)), where the grid has m*n cells and k is the largest island size.
- **Space Complexity:** O(m*n) for visited flags and point lists.

## Implementation

```python
from typing import List
class Solution:
    def numDistinctIslands2(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        vis = [[False]*n for _ in range(m)]
        shapes = set()
        for r in range(m):
            for c in range(n):
                if grid[r][c] == 1 and not vis[r][c]:
                    pts = []
                    stack = [(r, c)]
                    vis[r][c] = True
                    while stack:
                        x, y = stack.pop()
                        pts.append((x, y))
                        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                            nx, ny = x+dx, y+dy
                            if 0 <= nx < m and 0 <= ny < n and not vis[nx][ny] and grid[nx][ny] == 1:
                                vis[nx][ny] = True
                                stack.append((nx, ny))
                    best = None
                    for t in range(8):
                        tr = []
                        for x, y in pts:
                            if t == 0: tr.append((x, y))
                            elif t == 1: tr.append((x, -y))
                            elif t == 2: tr.append((-x, y))
                            elif t == 3: tr.append((-x, -y))
                            elif t == 4: tr.append((y, x))
                            elif t == 5: tr.append((y, -x))
                            elif t == 6: tr.append((-y, x))
                            else: tr.append((-y, -x))
                        mx = min(p[0] for p in tr); my = min(p[1] for p in tr)
                        tr = sorted((x-mx, y-my) for x, y in tr)
                        s = ';'.join(f"{x},{y}" for x, y in tr)
                        if best is None or s < best:
                            best = s
                    shapes.add(best)
        return len(shapes)
```
