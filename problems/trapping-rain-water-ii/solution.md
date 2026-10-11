## Approach

Seed a min-heap with every border cell and mark them visited; the heap always yields the lowest boundary seen so far. Repeatedly pop that boundary and inspect its four neighbours: any unvisited neighbour traps the gap between its height and the boundary, then joins the heap at the higher of the two levels. Because cells leave the heap in rising boundary order, each trapped amount is final.

## Complexity Analysis

- **Time Complexity:** O(mn log(mn)) for heap operations over all cells.
- **Space Complexity:** O(mn) for visited flags and the heap.

## Implementation

```python
import heapq
from typing import List

class Solution:
    def trapRainWater(self, heightMap: List[List[int]]) -> int:
        if not heightMap or not heightMap[0]:
            return 0
        m, n = len(heightMap), len(heightMap[0])
        vis = [[False] * n for _ in range(m)]
        pq = []
        for i in range(m):
            heapq.heappush(pq, (heightMap[i][0], i, 0))
            vis[i][0] = True
            if n > 1:
                heapq.heappush(pq, (heightMap[i][n - 1], i, n - 1))
                vis[i][n - 1] = True
        for j in range(1, n - 1):
            heapq.heappush(pq, (heightMap[0][j], 0, j))
            vis[0][j] = True
            if m > 1:
                heapq.heappush(pq, (heightMap[m - 1][j], m - 1, j))
                vis[m - 1][j] = True
        water = 0
        while pq:
            h, x, y = heapq.heappop(pq)
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or nx >= m or ny < 0 or ny >= n or vis[nx][ny]:
                    continue
                vis[nx][ny] = True
                water += max(0, h - heightMap[nx][ny])
                heapq.heappush(pq, (max(h, heightMap[nx][ny]), nx, ny))
        return water
```
