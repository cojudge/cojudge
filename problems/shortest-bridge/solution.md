## Approach

Find the first island with depth-first search and load all its cells into a breadth-first queue. Expand layer by layer over water, marking visited cells, until the search reaches a `1` from the second island. The number of layers expanded equals the flips needed.

## Complexity Analysis

- **Time Complexity:** O(n^2) for an n by n grid. Each cell is visited at most once.
- **Space Complexity:** O(n^2) for the visited table and queues.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def shortestBridge(self, grid: List[List[int]]) -> int:
        n = len(grid)
        seen = [[False]*n for _ in range(n)]
        q = deque()
        found = False
        for i in range(n):
            if found:
                break
            for j in range(n):
                if grid[i][j] == 1:
                    st = [(i, j)]
                    seen[i][j] = True
                    while st:
                        x, y = st.pop()
                        q.append((x, y))
                        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                            nx, ny = x+dx, y+dy
                            if 0 <= nx < n and 0 <= ny < n and not seen[nx][ny] and grid[nx][ny] == 1:
                                seen[nx][ny] = True
                                st.append((nx, ny))
                    found = True
                    break
        steps = 0
        while q:
            for _ in range(len(q)):
                x, y = q.popleft()
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = x+dx, y+dy
                    if nx < 0 or nx >= n or ny < 0 or ny >= n or seen[nx][ny]:
                        continue
                    if grid[nx][ny] == 1:
                        return steps
                    seen[nx][ny] = True
                    q.append((nx, ny))
            steps += 1
        return -1
```
