An `m x n` integer board named `grid` holds an automaton that begins in the upper-left cell (`grid[0][0]`) and aims for the lower-right cell (`grid[m - 1][n - 1]`). At each step the automaton may advance only downward or rightward.

Cells of `grid` hold `1` for a blocked cell and `0` for a free cell. No traveled route may pass through a blocked cell.

Count how many distinct admissible routes reach the destination.

The test data is constructed so the count never exceeds `2 * 10^9`.

**Constraints:**
- m == obstacleGrid.length
- n == obstacleGrid[i].length
- 1 ≤ m, n ≤ 100
- obstacleGrid[i][j] is 0 or 1.
