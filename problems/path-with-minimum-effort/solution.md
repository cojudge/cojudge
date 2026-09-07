## Approach

Treat each cell as a graph node with edges to its four neighbors weighted by the absolute height difference. The effort of a path is the maximum edge weight along it, so run Dijkstra where the path cost is the max edge seen so far instead of a sum. A min-heap ordered by effort expands the cheapest frontier first, and the first time the target is popped its effort is optimal.

## Complexity Analysis

- **Time Complexity:** O(mn log(mn)), where m and n are the grid dimensions. Each cell is processed with heap operations.
- **Space Complexity:** O(mn) for the distance array and the heap.

## Implementation

```python
import heapq
class Solution:
    def minimumEffortPath(self, heights: list[list[int]]) -> int:
        rows, cols = len(heights), len(heights[0])
        dist = [[10**18] * cols for _ in range(rows)]
        dist[0][0] = 0
        pq = [(0, 0, 0)]
        while pq:
            effort, r, c = heapq.heappop(pq)
            if r == rows - 1 and c == cols - 1:
                return effort
            if effort > dist[r][c]:
                continue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nxt = max(effort, abs(heights[r][c] - heights[nr][nc]))
                    if nxt < dist[nr][nc]:
                        dist[nr][nc] = nxt
                        heapq.heappush(pq, (nxt, nr, nc))
        return dist[rows - 1][cols - 1]
```
