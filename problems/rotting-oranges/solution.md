## Approach

Copy the grid, count all fresh oranges, and initialize a queue with every rotten orange. Each breadth-first-search layer represents one minute and rots all fresh neighbors simultaneously. Stop when no fresh oranges remain or the queue can no longer spread; the latter case is impossible and returns `-1`.

## Complexity Analysis

- **Time Complexity:** O(m * n), because every orange is processed at most once.
- **Space Complexity:** O(m * n) for the copied state and breadth-first-search queue.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        state = [row.copy() for row in grid]
        rows, cols = len(state), len(state[0])
        queue = deque()
        fresh = 0
        for row in range(rows):
            for col in range(cols):
                if state[row][col] == 1:
                    fresh += 1
                elif state[row][col] == 2:
                    queue.append((row, col))

        minutes = 0
        while fresh > 0 and queue:
            for _ in range(len(queue)):
                row, col = queue.popleft()
                for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    next_row = row + row_step
                    next_col = col + col_step
                    if not (0 <= next_row < rows and 0 <= next_col < cols):
                        continue
                    if state[next_row][next_col] != 1:
                        continue
                    state[next_row][next_col] = 2
                    fresh -= 1
                    queue.append((next_row, next_col))
            minutes += 1
        return minutes if fresh == 0 else -1
```
