## Approach

Seed a queue with every zero cell at distance zero and mark all ones as unseen. Repeatedly pop a cell and relax its four neighbours: the first time a neighbour is reached its distance is final because the search expands in increasing distance order.

## Complexity Analysis

- **Time Complexity:** O(m * n), each cell enqueued once.
- **Space Complexity:** O(m * n) for distances and the queue.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        m, n = len(mat), len(mat[0])
        dist = [[-1] * n for _ in range(m)]
        q = deque()
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    dist[i][j] = 0
                    q.append((i, j))
        while q:
            i, j = q.popleft()
            for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] == -1:
                    dist[ni][nj] = dist[i][j] + 1
                    q.append((ni, nj))
        return dist
```
