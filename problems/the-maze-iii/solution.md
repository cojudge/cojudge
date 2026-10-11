## Approach

Model each resting cell as a node and each maximal roll as a weighted edge, with the special rule that a roll halts early upon entering the hole. Dijkstra's algorithm over states ordered by (distance, path string) yields the shortest route, breaking ties toward the lexicographically smallest direction sequence. Distances and best paths are relaxed whenever a strictly shorter or equally short but smaller string is found.

## Complexity Analysis

- **Time Complexity:** O(m * n * (m + n) log(m * n)) for rolling from each cell with a heap.
- **Space Complexity:** O(m * n) for distance, path and heap storage.

## Implementation

```python
import heapq
from typing import List

class Solution:
    def findShortestWay(self, maze: List[List[int]], ball: List[int], hole: List[int]) -> str:
        m, n = len(maze), len(maze[0])
        INF = 10 ** 9
        dist = [[INF] * n for _ in range(m)]
        best = [[None] * n for _ in range(m)]
        dr = [1, 0, 0, -1]
        dc = [0, -1, 1, 0]
        ds = ['d', 'l', 'r', 'u']
        dist[ball[0]][ball[1]] = 0
        best[ball[0]][ball[1]] = ""
        pq = [(0, "", ball[0], ball[1])]
        while pq:
            d, p, r, c = heapq.heappop(pq)
            if d != dist[r][c] or p != best[r][c]:
                continue
            if r == hole[0] and c == hole[1]:
                return p
            for k in range(4):
                nr, nc, steps = r, c, d
                np = p + ds[k]
                while True:
                    tr, tc = nr + dr[k], nc + dc[k]
                    if not (0 <= tr < m and 0 <= tc < n and maze[tr][tc] == 0):
                        break
                    nr, nc = tr, tc
                    steps += 1
                    if nr == hole[0] and nc == hole[1]:
                        break
                if nr == r and nc == c:
                    continue
                if steps < dist[nr][nc] or (steps == dist[nr][nc] and (best[nr][nc] is None or np < best[nr][nc])):
                    dist[nr][nc] = steps
                    best[nr][nc] = np
                    heapq.heappush(pq, (steps, np, nr, nc))
        return "impossible"
```
