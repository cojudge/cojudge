## Approach

View every cell as a node with directed edges to its strictly larger neighbors. These
edges form a directed acyclic graph. Count each cell's outgoing edges, start from local
maxima, and remove one topological layer at a time while moving toward smaller cells.
The number of layers is the longest increasing path length.

## Complexity Analysis

- **Time Complexity:** O(rows * columns).
- **Space Complexity:** O(rows * columns).

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        rows, columns = len(matrix), len(matrix[0])
        directions = ((1, 0), (-1, 0), (0, 1), (0, -1))
        outdegree = [[0] * columns for _ in range(rows)]
        queue = deque()

        for row in range(rows):
            for column in range(columns):
                for row_step, column_step in directions:
                    next_row = row + row_step
                    next_column = column + column_step
                    if (
                        0 <= next_row < rows
                        and 0 <= next_column < columns
                        and matrix[next_row][next_column] > matrix[row][column]
                    ):
                        outdegree[row][column] += 1
                if outdegree[row][column] == 0:
                    queue.append((row, column))

        length = 0
        while queue:
            length += 1
            for _ in range(len(queue)):
                row, column = queue.popleft()
                for row_step, column_step in directions:
                    previous_row = row + row_step
                    previous_column = column + column_step
                    if (
                        0 <= previous_row < rows
                        and 0 <= previous_column < columns
                        and matrix[previous_row][previous_column] < matrix[row][column]
                    ):
                        outdegree[previous_row][previous_column] -= 1
                        if outdegree[previous_row][previous_column] == 0:
                            queue.append((previous_row, previous_column))
        return length
```
