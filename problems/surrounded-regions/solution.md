## Approach

Convert the immutable input strings into a character grid and mark every `O` connected to the boundary with a breadth-first search. These marked cells cannot be captured. After the traversal, replace unmarked `O` cells with `X`, restore marked cells to `O`, and join each row for the adapted return value.

## Complexity Analysis

- **Time Complexity:** O(m * n), because every board cell is examined a constant number of times.
- **Space Complexity:** O(m * n) for the mutable character grid and breadth-first-search queue.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def solve(self, board: List[str]) -> List[str]:
        cells = [list(row) for row in board]
        rows, cols = len(cells), len(cells[0])
        queue = deque()

        def mark(row: int, col: int) -> None:
            if cells[row][col] != "O":
                return
            cells[row][col] = "#"
            queue.append((row, col))

        for row in range(rows):
            mark(row, 0)
            mark(row, cols - 1)
        for col in range(cols):
            mark(0, col)
            mark(rows - 1, col)
        while queue:
            row, col = queue.popleft()
            for row_step, col_step in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_step
                next_col = col + col_step
                if 0 <= next_row < rows and 0 <= next_col < cols:
                    mark(next_row, next_col)

        result = []
        for row in cells:
            result.append("".join("O" if cell == "#" else "X" for cell in row))
        return result
```
