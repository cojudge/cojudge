You hold a square grid with `n` rows and `n` columns. Every cell shows one
of two symbols, `0` or `1` (stored as single-character strings). In one step
you may exchange any two whole rows, or any two whole columns. The order of
cells inside a row or column otherwise stays fixed.

A finished board is called alternating when no two cells that touch
sideways (up, down, left, right) hold the same symbol — the pattern must
look like a chessboard. Count the fewest row/column exchanges that turn the
given board into an alternating one. When no sequence of swaps can do it,
report `-1`.

Note on types: the grid arrives as characters `'0'` and `'1'`, not as
numbers, so compare symbols directly.

**Example 1:**
```
Input: board = [["0","1","1","0"],["0","1","1","0"],["1","0","0","1"],["1","0","0","1"]]
Output: 2
Explanation: One row exchange plus one column exchange is enough to reach
an alternating layout, and one move alone cannot fix it.
```

**Example 2:**
```
Input: board = [["0","1"],["1","0"]]
Output: 0
Explanation: Neighbors already alternate, so zero moves are needed.
```

**Example 3:**
```
Input: board = [["1","0"],["1","0"]]
Output: -1
Explanation: Both rows start with 1, so the first column can never be made
to alternate; the task is impossible.
```

**Constraints:**
- `n == board.length`
- `n == board[i].length`
- `2 <= n <= 30`
- `board[i][j]` is `"0"` or `"1"`.
