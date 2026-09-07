## Approach

Classic backtracking over rows. Because no two queens may share a column, we place exactly one queen per row and only need to check columns, main diagonals (`row - col`), and anti-diagonals (`row + col`). Mark all three families when a queen is placed, recurse to the next row, then unmark them when backtracking. Each time the last row is reached successfully, increment the count.

## Complexity Analysis

- **Time Complexity:** O(n!), the number of placements to explore; pruning by column and diagonal collisions reduces the branching factor sharply.
- **Space Complexity:** O(n) for the recursion stack and the three boolean arrays.

## Implementation

```python
from typing import List


class Solution:
    def totalNQueens(self, n: int) -> int:
        cols = [False] * n
        diags = [False] * (2 * n - 1)
        anti_diags = [False] * (2 * n - 1)

        def place(row: int) -> int:
            if row == n:
                return 1
            count = 0
            for col in range(n):
                diag = row - col + n - 1
                anti_diag = row + col
                if cols[col] or diags[diag] or anti_diags[anti_diag]:
                    continue
                cols[col] = diags[diag] = anti_diags[anti_diag] = True
                count += place(row + 1)
                cols[col] = diags[diag] = anti_diags[anti_diag] = False
            return count

        return place(0)
```