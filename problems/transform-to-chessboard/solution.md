## Approach

An alternating board has only two distinct row shapes that oppose each
other, and likewise for columns. First reject boards where any rectangle
corner breaks that rule or where the first row/column holds the wrong number
of ones. Then compare the current first column and first row against the two
ideal alternating edges; each pair of misplaced lines costs one swap, so the
mismatch count halved (taking the cheaper edge, or the parity-valid edge for
odd sizes) gives the row and column moves.

## Complexity Analysis

- **Time Complexity:** O(n^2) to scan the grid.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List


class Solution:
    def movesToChessboard(self, board: List[List[str]]) -> int:
        n = len(board)
        g = [[1 if c == '1' else 0 for c in row] for row in board]
        for i in range(n):
            for j in range(n):
                if (g[0][0] ^ g[i][0] ^ g[0][j] ^ g[i][j]) == 1:
                    return -1
        row_ones = sum(g[0])
        col_ones = sum(g[i][0] for i in range(n))
        if row_ones not in (n // 2, (n + 1) // 2):
            return -1
        if col_ones not in (n // 2, (n + 1) // 2):
            return -1
        row_diff = sum(1 for i in range(n) if g[i][0] != i % 2)
        col_diff = sum(1 for j in range(n) if g[0][j] != j % 2)
        if n % 2 == 0:
            row_moves = min(row_diff, n - row_diff) // 2
            col_moves = min(col_diff, n - col_diff) // 2
        else:
            row_moves = (row_diff if row_diff % 2 == 0 else n - row_diff) // 2
            col_moves = (col_diff if col_diff % 2 == 0 else n - col_diff) // 2
        return row_moves + col_moves
```
