You are given an `m x n` grid where each cell is one of three kinds: `1` marks a building, `0` marks empty land where you may build, and `2` marks an obstacle that cannot be crossed.

Starting from a candidate empty cell, the travel cost to a building is the length of the shortest 4-directional path that steps only through `0` cells (the destination building cell itself is the final step; paths may not go through other buildings or obstacles). The total cost of a candidate cell is the sum of these distances over every building on the grid.

Find the empty cell with the smallest total cost and return that cost. If no empty cell can reach all buildings, return `-1`.

**Constraints:**
- `m == grid.length`, `n == grid[i].length`
- `1 <= m, n <= 50`
- Each `grid[i][j]` is `0`, `1` or `2`.
- The grid contains at least one building.
