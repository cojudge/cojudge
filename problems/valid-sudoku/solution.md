## Approach

Maintain one set for each row, column, and `3 x 3` box. For every filled cell,
check all three corresponding sets before inserting the digit; a prior match
means the board is invalid.

## Complexity Analysis

- **Time Complexity:** `O(1)` because the board always contains 81 cells.
- **Space Complexity:** `O(1)` because there are always 27 sets holding at most nine digits each.

## Implementation

```python
from typing import List


class Solution:
    def isValidSudoku(self, board: List[str]) -> bool:
        rows = [set() for _ in range(9)]
        columns = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        for row in range(9):
            for column in range(9):
                cell = board[row][column]
                if cell == ".":
                    continue
                box = (row // 3) * 3 + column // 3
                if cell in rows[row] or cell in columns[column] or cell in boxes[box]:
                    return False
                rows[row].add(cell)
                columns[column].add(cell)
                boxes[box].add(cell)
        return True
```
