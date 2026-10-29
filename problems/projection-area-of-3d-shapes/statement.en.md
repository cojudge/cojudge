A square `n x n` grid describes stacks of unit cubes: `grid[i][j]` cubes are piled on cell `(i, j)`. Picture the solid from three sides and count the visible unit squares:

- From above, every non-empty cell shows exactly one square.
- From the front, each row shows as many squares as its tallest stack.
- From the side, each column shows as many squares as its tallest stack.

Return the sum of the three views.

**Constraints:**
- `n == grid.length == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] <= 100`
