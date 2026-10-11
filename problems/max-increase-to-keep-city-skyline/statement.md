You receive a square `grid` where `grid[i][j]` is the height of the tower in row `i`, column `j`. Viewed from the sides, each row shows its tallest tower, and viewed from the front and back, each column shows its tallest tower. Together these maxima form the skyline.

You may raise any towers but never lower them, with the restriction that every row maximum and every column maximum stays exactly the same. Maximize the total added height across all cells and return that increase.

**Constraints:**
- `1 <= grid.length == grid[0].length <= 50`
- `0 <= grid[i][j] <= 100`
- Adaptation: the square input maps to int_array_2d in this judge.
