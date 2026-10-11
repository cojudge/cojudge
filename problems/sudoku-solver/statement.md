Fill a 9x9 Sudoku grid so that every row, every column, and each of the nine 3x3 sub-boxes contains the digits `1` through `9` exactly once. Empty cells are written as `'.'`; the pre-filled digits must stay untouched.

Each board is passed as nine strings of nine characters, and you must return the completed board in the same shape: nine strings with every `'.'` replaced by the correct digit.

**Example 1:**
```
Input: board = ["53..7....","6..195...",".98....6.","8...6...3","4..8.3..1","7...2...6",".6....28.","...419..5","....8..79"]
Output: ["534678912","672195348","198342567","859761423","426853791","713924856","961537284","287419635","345286179"]
Explanation: The completed grid satisfies the row, column, and box rules while keeping all given digits.
```

**Example 2:**
```
Input: board = ["5.4.7.9.2","6.2.9.3.8","1.8.4.5.7","8.9.6.4.3","4.6.5.7.1","7.3.2.8.6","9.1.3.2.4","2.7.1.6.5","3.5.8.1.9"]
Output: ["534678912","672195348","198342567","859761423","426853791","713924856","961537284","287419635","345286179"]
Explanation: With every other cell blanked out, the givens still determine the same full solution.
```

**Constraints:**
- `board.length == 9`
- `board[i].length == 9`
- Each cell holds a digit `'1'`-`'9'` or `'.'`.
- Every test board admits at least one valid completion.

*Adaptation note:* the classic statement edits a `char[][]` in place with no return value. Because this judge compares returned values, each row is encoded as a string and you return the nine completed row-strings instead. Any fully valid completion is accepted.
