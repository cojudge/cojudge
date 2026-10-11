## Approach

Treat every cell where the ball can rest as a graph vertex. Rolling from one resting cell in a straight line until a wall yields an edge whose weight is the number of cells crossed. Because all weights are positive, Dijkstra's algorithm starting at `start` finds the cheapest travel length to every reachable resting cell. Simulate each of the four rolls directly, relax improved distances through a priority queue, and read off the destination distance (or `-1` when it stays unsettled).

## Complexity Analysis

- **Time Complexity:** O(m * n * max(m, n) * log(m * n)) for rolling simulation plus heap operations.
- **Space Complexity:** O(m * n) for the distance table and the queue.

## Implementation

```python
from typing import List
import heapq

class Solution:
    def shortestDistance(self, maze: List[List[int]], start: List[int], destination: List[int]) -> int:
        m, n = len(maze), len(maze[0])
        INF = 10 ** 9
        dist = [[INF] * n for _ in range(m)]
        dist[start[0]][start[1]] = 0
        pq = [(0, start[0], start[1])]
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        while pq:
            d, r, c = heapq.heappop(pq)
            if d != dist[r][c]:
                continue
            if r == destination[0] and c == destination[1]:
                return d
            for dr, dc in dirs:
                nr, nc, steps = r, c, 0
                while 0 <= nr + dr < m and 0 <= nc + dc < n and maze[nr + dr][nc + dc] == 0:
                    nr += dr
                    nc += dc
                    steps += 1
                if dist[nr][nc] > d + steps:
                    dist[nr][nc] = d + steps
                    heapq.heappush(pq, (d + steps, nr, nc))
        ans = dist[destination[0]][destination[1]]
        return -1 if ans == INF else ans
```
