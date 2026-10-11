Compute one step of Conway's Game of Life.

Each cell is live (`1`) or dead (`0`). Count its eight neighbors, then apply
simultaneously: a live cell with fewer than two or more than three live
neighbors dies; a live cell with two or three lives on; a dead cell with
exactly three becomes live.

**Adaptation:** instead of a void in-place update, implement
`gameOfLife(board)` returning the next-state board.

**Examples:**
```
Input: board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
```
```
Input: board = [[1,1],[1,0]]
Output: [[1,1],[1,1]]
```

**Constraints:**
- `1 <= m, n <= 25`
- `board[i][j]` is `0` or `1`.
