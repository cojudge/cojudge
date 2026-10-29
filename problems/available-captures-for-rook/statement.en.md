An 8x8 chessboard is given as a grid of characters. Exactly one cell holds the
white rook `'R'`. Other cells hold pawns `'p'`, bishops `'B'`, or empty
squares `'.'`.

The rook moves like in chess: it slides any number of squares horizontally or
vertically, but it cannot jump over a bishop, and it stops at the first piece
it meets in each of the four directions. A pawn is capturable when it is the
first piece the rook meets along some direction.

Return how many pawns the rook can capture (from `0` to `4`).

**Constraints:**
- The board is 8x8 with exactly one `'R'`.
- Every cell is `'R'`, `'.'`, `'B'` or `'p'`.
