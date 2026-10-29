You are given an `n x n` grid where `grid[row][col]` is the elevation of a
cell. At time `t`, you may enter cells whose elevation is at most `t`. From a
cell, you may move up, down, left, or right.

Return the minimum time at which it is possible to travel from the top-left
cell to the bottom-right cell.

**Constraints:**

- `1 <= n <= 50`
- `grid.length == n`
- `grid[i].length == n`
- The grid contains every elevation from `0` through `n^2 - 1` exactly once.
