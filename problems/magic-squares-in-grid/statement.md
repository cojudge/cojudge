Count the 3 by 3 magic blocks hidden inside a number grid.

A 3 by 3 block is magic when it holds each integer from 1 through 9 exactly once, and every row, every column, and both long diagonals add to the same total (which must be 15). Scan every contiguous 3 by 3 window of `grid` and return how many of them are magic.

**Constraints:**
- `1 <= grid.length, grid[i].length <= 50`
- `0 <= grid[i][j] <= 15`
