Fill a 9x9 Sudoku grid so that every row, every column, and each of the nine 3x3 sub-boxes contains the digits `1` through `9` exactly once. Empty cells are written as `'.'`; the pre-filled digits must stay untouched.

Each board is passed as nine strings of nine characters, and you must return the completed board in the same shape: nine strings with every `'.'` replaced by the correct digit.

**Constraints:**
- `board.length == 9`
- `board[i].length == 9`
- Each cell holds a digit `'1'`-`'9'` or `'.'`.
- Every test board admits at least one valid completion.

*Adaptation note:* the classic statement edits a `char[][]` in place with no return value. Because this judge compares returned values, each row is encoded as a string and you return the nine completed row-strings instead. Any fully valid completion is accepted.
