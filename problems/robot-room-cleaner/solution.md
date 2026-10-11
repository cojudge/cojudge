## Approach

The reachable region is exactly the connected component of free cells containing the start. A queue-based flood fill explores the four neighbors of each visited free cell, skipping walls and already seen positions, and counts every dequeued cell. The count is the number of cells a complete cleaning would cover.

## Complexity Analysis

- **Time Complexity:** O(m * n) where m and n are the room dimensions. Each cell is visited once.
- **Space Complexity:** O(m * n) for the visited table and queue.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def cleanRoom(self, room: List[List[int]], row: int, col: int) -> int:
        m, n = len(room), len(room[0])
        vis = [[False] * n for _ in range(m)]
        dq = deque([(row, col)])
        vis[row][col] = True
        cnt = 0
        while dq:
            r, c = dq.popleft()
            cnt += 1
            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and not vis[nr][nc] and room[nr][nc] == 1:
                    vis[nr][nc] = True
                    dq.append((nr, nc))
        return cnt
```
