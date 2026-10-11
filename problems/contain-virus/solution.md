## Approach

Simulate day by day. On each day flood-fill all connected groups of infected cells, recording for every group its cells, the distinct healthy neighbours it threatens, and how many wall segments touch healthy cells. Quarantine the group with the largest threatened set by adding its wall count to the total and freezing its cells, then turn every other group's threatened cells infected overnight. Stop when no group touches a healthy cell.

## Complexity Analysis

- **Time Complexity:** O(D * m * n), where D is the number of days simulated and m * n is the floor size, since each day scans the whole grid.
- **Space Complexity:** O(m * n) for the visited flags and the per-group cell lists.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def containVirus(self, isInfected: List[List[int]]) -> int:
        m, n = len(isInfected), len(isInfected[0])
        g = [row[:] for row in isInfected]
        ans = 0
        dirs = [(1,0),(-1,0),(0,1),(0,-1)]
        while True:
            vis = [[False]*n for _ in range(m)]
            areas, bounds, walls = [], [], []
            for i in range(m):
                for j in range(n):
                    if g[i][j] == 1 and not vis[i][j]:
                        area, bound, w = [], set(), 0
                        q = deque([(i,j)])
                        vis[i][j] = True
                        while q:
                            x, y = q.popleft()
                            area.append((x,y))
                            for dx, dy in dirs:
                                nx, ny = x+dx, y+dy
                                if not (0 <= nx < m and 0 <= ny < n) or g[nx][ny] == -1:
                                    continue
                                if g[nx][ny] == 0:
                                    w += 1
                                    bound.add(nx*n+ny)
                                elif g[nx][ny] == 1 and not vis[nx][ny]:
                                    vis[nx][ny] = True
                                    q.append((nx,ny))
                        areas.append(area); bounds.append(bound); walls.append(w)
            if not areas:
                break
            idx = max(range(len(bounds)), key=lambda k: len(bounds[k]))
            if not bounds[idx]:
                break
            ans += walls[idx]
            for k in range(len(areas)):
                if k == idx:
                    for x, y in areas[k]:
                        g[x][y] = -1
                else:
                    for code in bounds[k]:
                        g[code//n][code%n] = 1
        return ans
```
