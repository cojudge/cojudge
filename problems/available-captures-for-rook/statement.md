An 8x8 chessboard is given as a grid of characters. Exactly one cell holds the
white rook `'R'`. Other cells hold pawns `'p'`, bishops `'B'`, or empty
squares `'.'`.

The rook moves like in chess: it slides any number of squares horizontally or
vertically, but it cannot jump over a bishop, and it stops at the first piece
it meets in each of the four directions. A pawn is capturable when it is the
first piece the rook meets along some direction.

Return how many pawns the rook can capture (from `0` to `4`).

**Example 1:**
```
Input: board = [[".",".",".",".",".",".",".","."],[".",".",".","p",".",".",".","."],[".",".",".","R",".",".",".","p"],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".","p",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."]]
Output: 3
Explanation: The rook takes the pawns above, below and to the right.
```

**Example 2:**
```
Input: board = [[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".","R",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."]]
Output: 0
Explanation: No pawn shares the rook's row or column.
```

**Example 3:**
```
Input: board = [[".",".",".",".",".",".",".","."],[".",".",".",".","p",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".","."],[".",".",".",".","R",".","B","."],[".",".",".",".",".",".",".","."],[".",".",".",".","B",".",".","."],[".",".",".",".",".",".",".","."]]
Output: 1
Explanation: Only the pawn above the rook is reachable; a bishop blocks the right and the lower column, and the left row is empty.
```

**Constraints:**
- The board is 8x8 with exactly one `'R'`.
- Every cell is `'R'`, `'.'`, `'B'` or `'p'`.
