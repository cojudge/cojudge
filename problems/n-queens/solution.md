## Approach

Place one queen in each row and backtrack whenever a candidate column or diagonal is occupied. Boolean arrays track columns and the two diagonal families in O(1) per check. Once all rows are assigned, convert the queen positions into the required string board.

## Complexity Analysis

- **Time Complexity:** O(n! + S * n^2), where `S` is the number of valid boards and each output board takes O(n^2) to construct.
- **Space Complexity:** O(n) auxiliary recursion and occupancy space, excluding the O(S * n^2) output.

## Implementation

```python
from typing import List


class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        result: List[List[str]] = []
        queens = [-1] * n
        columns = [False] * n
        descending = [False] * (2 * n - 1)
        ascending = [False] * (2 * n - 1)

        def place(row: int) -> None:
            if row == n:
                result.append([
                    "." * col + "Q" + "." * (n - col - 1)
                    for col in queens
                ])
                return
            for col in range(n):
                down = row - col + n - 1
                up = row + col
                if columns[col] or descending[down] or ascending[up]:
                    continue
                queens[row] = col
                columns[col] = descending[down] = ascending[up] = True
                place(row + 1)
                columns[col] = descending[down] = ascending[up] = False

        place(0)
        return result
```
