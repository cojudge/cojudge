## Approach

A path's required time is the maximum elevation visited along it. Run Dijkstra's algorithm where a state's cost is that maximum, and entering a neighbor changes the cost to `max(current_time, neighbor_elevation)`. The first time the bottom-right cell leaves the min-heap, its cost is the smallest possible path maximum.

## Complexity Analysis

- **Time Complexity:** O(N^2 log(N^2)) for an `N x N` grid.
- **Space Complexity:** O(N^2) for best costs and the heap.

## Implementation

```python
import heapq
from typing import List


class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        best = [[float("inf")] * n for _ in range(n)]
        best[0][0] = grid[0][0]
        queue = [(grid[0][0], 0, 0)]

        while queue:
            time, row, col = heapq.heappop(queue)
            if time != best[row][col]:
                continue
            if row == n - 1 and col == n - 1:
                return time

            for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_step
                next_col = col + col_step
                if 0 <= next_row < n and 0 <= next_col < n:
                    next_time = max(time, grid[next_row][next_col])
                    if next_time < best[next_row][next_col]:
                        best[next_row][next_col] = next_time
                        heapq.heappush(queue, (next_time, next_row, next_col))

        return -1
```
