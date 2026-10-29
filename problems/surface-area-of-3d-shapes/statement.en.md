Picture an `n` by `n` board. On the cell in row `i`, column `j` you pile up `grid[i][j]` unit cubes, one on top of another, forming a small tower (a zero means the cell stays empty). Towers that touch side-by-side hide the faces where they meet, and cubes stacked vertically hide the faces between them.

Count every square that remains visible from the outside, counting the underside that rests on the table as well.

**Constraints:**
- `n == grid.length == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] <= 50`
