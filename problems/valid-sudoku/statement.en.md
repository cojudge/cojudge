Determine whether a partially filled `9 x 9` Sudoku board is valid. Only the
filled cells need to be checked according to these rules:

- Each row must contain the digits `1` through `9` at most once.
- Each column must contain the digits `1` through `9` at most once.
- Each of the nine `3 x 3` sub-boxes must contain the digits `1` through `9` at most once.

The board is provided as nine strings of length nine. A `.` represents an empty
cell. A valid partial board does not need to be solvable.

**Constraints:**

- `board.length == 9`
- `board[i].length == 9`
- Every cell is `.` or a digit from `1` to `9`.
