You are handed a `row x col` matrix `grid` describing a map, where `grid[i][j] = 1` marks ground and `grid[i][j] = 0` marks water.

Treat cells as linked across shared sides, not corners. The map is ringed entirely by water and holds a single island — one connected cluster of ground cells.

That island encloses no isolated water: no water cell inside its boundary is cut off from the surrounding water. Picture every cell as a 1-by-1 square, with the whole rectangle no taller or wider than 100 cells. Compute the length of the island's outline.

**Constraints:**
- `row == grid.length`
- `col == grid[i].length`
- `1 <= row, col <= 100`
- `grid[i][j]` is `0` or `1`
- There is exactly one island in `grid`
