## Approach

Expand the position with the set of keys held, encoded as a bit mask, so the full state is (row, col, mask). Count the distinct keys to build the target mask, then breadth-first search from the start across walkable neighbors, refusing walls and locked doors without the key and adding keys on entry. The first time a state with the full mask is dequeued, its distance is the shortest possible.

## Complexity Analysis

- **Time Complexity:** O(m * n * 2^k), where k is the number of keys (at most 6). Each state is processed once.
- **Space Complexity:** O(m * n * 2^k) for the visited table and queue.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def shortestPathAllKeys(self, grid: List[str]) -> int:
        m, n = len(grid), len(grid[0])
        sx = sy = 0
        all_keys = 0
        for i in range(m):
            for j in range(n):
                c = grid[i][j]
                if c == '@':
                    sx, sy = i, j
                elif 'a' <= c <= 'f':
                    all_keys |= 1 << (ord(c) - ord('a'))
        vis = [[[False] * 64 for _ in range(n)] for _ in range(m)]
        q = deque([(sx, sy, 0)])
        vis[sx][sy][0] = True
        steps = 0
        while q:
            for _ in range(len(q)):
                x, y, mask = q.popleft()
                if mask == all_keys:
                    return steps
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if not (0 <= nx < m and 0 <= ny < n):
                        continue
                    c = grid[nx][ny]
                    if c == '#':
                        continue
                    if 'A' <= c <= 'F' and not (mask >> (ord(c) - ord('A')) & 1):
                        continue
                    nm = mask
                    if 'a' <= c <= 'f':
                        nm |= 1 << (ord(c) - ord('a'))
                    if not vis[nx][ny][nm]:
                        vis[nx][ny][nm] = True
                        q.append((nx, ny, nm))
            steps += 1
        return -1
```
