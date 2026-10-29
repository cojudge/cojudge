Given a nonempty rectangular board represented by an array of equal-width strings, capture every region of `O` cells that is completely surrounded by `X` cells.

Cells connect horizontally and vertically. An `O` connected to any boundary `O` is not surrounded and must remain unchanged. Replace every other `O` with `X` and return the transformed rows.

This version adapts the usual in-place character-grid operation to `solve(board: string_array) -> string_list`.

**Constraints:**
- `1 <= board.length <= 200`
- `1 <= board[r].length <= 200`
- Every row has the same length.
- Every character is `X` or `O`.
