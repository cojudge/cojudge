## Approach

Copy the matrix for the return-value adaptation, then put every gate into one breadth-first-search queue. Expanding all gates together visits each empty room first from its nearest gate. Assign a distance only when the cell still has the empty-room sentinel, which also prevents repeated work and leaves unreachable rooms unchanged.

## Complexity Analysis

- **Time Complexity:** O(m * n), because every room enters the queue at most once.
- **Space Complexity:** O(m * n) for the returned copy and the breadth-first-search queue.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def wallsAndGates(self, rooms: List[List[int]]) -> List[List[int]]:
        result = [row.copy() for row in rooms]
        rows, cols = len(result), len(result[0])
        queue = deque(
            (row, col)
            for row in range(rows)
            for col in range(cols)
            if result[row][col] == 0
        )
        while queue:
            row, col = queue.popleft()
            for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_step
                next_col = col + col_step
                if not (0 <= next_row < rows and 0 <= next_col < cols):
                    continue
                if result[next_row][next_col] != 2147483647:
                    continue
                result[next_row][next_col] = result[row][col] + 1
                queue.append((next_row, next_col))
        return result
```
