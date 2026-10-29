You are planning a walk over a terrain map `heights` with `rows` rows and `columns` columns, where `heights[row][col]` is the altitude of that square. The walk begins at the upper-left corner `(0, 0)` and must finish at the lower-right corner `(rows-1, columns-1)`, moving only to the four directly neighboring squares.

For any chosen walk, look at the absolute altitude change between each pair of successive squares and take the largest of those changes; that maximum is the walk's effort. Among all possible walks, return the smallest achievable effort.

**Constraints:**
- `rows == heights.length`
- `columns == heights[i].length`
- `1 <= rows, columns <= 100`
- `1 <= heights[i][j] <= 10^6`
