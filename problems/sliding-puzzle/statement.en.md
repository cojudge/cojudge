You are given a `2 x 3` board holding the tiles `1` through `5` plus one empty cell marked `0`. In a single move you may slide a tile that neighbors the empty cell horizontally or vertically into it (swapping `0` with an adjacent number).

The solved layout is `[[1,2,3],[4,5,0]]`. Starting from the given `board`, return the fewest moves that reach the solved layout, or `-1` when it cannot be reached.

**Constraints:**
- `board.length == 2`, `board[i].length == 3`
- `0 <= board[i][j] <= 5`
- Each value appears exactly once
