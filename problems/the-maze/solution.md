## Approach

Search only over cells where the ball can halt. From each halted cell simulate rolling in the four directions until the step before a wall or border, and treat that stopping cell as a neighbor. Breadth-first search marks halts visited so each is expanded once; reaching the destination halt means success.

## Complexity Analysis

- **Time Complexity:** O(m * n * (m + n)) in the worst case, since each of the m*n halts rolls up to m+n steps.
- **Space Complexity:** O(m * n) for the visited table and queue.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def hasPath(self, maze: List[List[int]], start: List[int], destination: List[int]) -> bool:
        m, n = len(maze), len(maze[0])
        vis = [[False] * n for _ in range(m)]
        q = deque([(start[0], start[1])])
        vis[start[0]][start[1]] = True
        while q:
            x, y = q.popleft()
            if x == destination[0] and y == destination[1]:
                return True
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nx, ny = x, y
                while 0 <= nx + dx < m and 0 <= ny + dy < n and maze[nx + dx][ny + dy] == 0:
                    nx += dx
                    ny += dy
                if not vis[nx][ny]:
                    vis[nx][ny] = True
                    q.append((nx, ny))
        return False
```
