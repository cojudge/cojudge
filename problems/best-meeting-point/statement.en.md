An `m x n` grid marks each friend's home with a `1` (all other cells are `0`). Friends may
meet at any cell, and everyone travels with Manhattan distance `|x1-x2| + |y1-y2|`. Return
the smallest possible total travel distance over all meeting cells. There is at least one
friend on the grid.

**Constraints:**
- `1 <= m, n <= 200`
- `grid[i][j]` is `0` or `1`.
- The grid holds at least one `1`.
