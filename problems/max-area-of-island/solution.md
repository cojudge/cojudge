## Approach

Scan every cell and start a breadth-first search from each unvisited land cell. Mark land when it enters the queue so it is counted once, measure the component's area, and retain the largest area found. An explicit queue avoids recursion-depth problems on large connected islands.

## Complexity Analysis

- **Time Complexity:** O(m * n), because every grid cell is processed at most once.
- **Space Complexity:** O(m * n) for the visited matrix and breadth-first-search queue.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        visited = [[False] * cols for _ in range(rows)]
        largest = 0
        for row in range(rows):
            for col in range(cols):
                if grid[row][col] == 0 or visited[row][col]:
                    continue
                area = 0
                queue = deque([(row, col)])
                visited[row][col] = True
                while queue:
                    current_row, current_col = queue.popleft()
                    area += 1
                    for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        next_row = current_row + row_step
                        next_col = current_col + col_step
                        if not (0 <= next_row < rows and 0 <= next_col < cols):
                            continue
                        if grid[next_row][next_col] == 0 or visited[next_row][next_col]:
                            continue
                        visited[next_row][next_col] = True
                        queue.append((next_row, next_col))
                largest = max(largest, area)
        return largest
```
