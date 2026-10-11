## Approach

A brick is stable exactly when a four-directional brick path reaches the top row. After copying the wall, each hit is applied and a flood fill from the top row recounts stable bricks; the fall count is the shrinkage of that set minus the erased brick itself, floored at zero.

## Complexity Analysis

- **Time Complexity:** O(h * m * n), one flood fill per hit over an m by n wall.
- **Space Complexity:** O(m * n) for the copy and the visited marks.

## Implementation

```python
from collections import deque
from typing import List
class Solution:
    def hitBricks(self, grid: List[List[int]], hits: List[List[int]]) -> List[int]:
        m, n = len(grid), len(grid[0])
        cur = [row[:] for row in grid]
        def stable() -> int:
            vis = [[False] * n for _ in range(m)]
            q = deque()
            for c in range(n):
                if cur[0][c] == 1 and not vis[0][c]:
                    vis[0][c] = True
                    q.append((0, c))
            cnt = 0
            while q:
                r, c = q.popleft()
                cnt += 1
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < m and 0 <= nc < n and cur[nr][nc] == 1 and not vis[nr][nc]:
                        vis[nr][nc] = True
                        q.append((nr, nc))
            return cnt
        before = stable()
        ans = []
        for x, y in hits:
            if not (0 <= x < m and 0 <= y < n) or cur[x][y] == 0:
                ans.append(0)
                continue
            cur[x][y] = 0
            after = stable()
            ans.append(max(0, before - after - 1))
            before = after
        return ans
```
