You are given a binary grid `grid` holding only `0` and `1`.

An axis-aligned corner rectangle is a choice of two different rows `r1 < r2` and two different columns `c1 < c2` such that all four crossings `(r1,c1)`, `(r1,c2)`, `(r2,c1)` and `(r2,c2)` hold `1`. Cells inside or on the edges may be anything; only the four corners matter.

Return how many such rectangles appear in the grid.

**Constraints:**
- `m == grid.length`, `n == grid[i].length`
- `1 <= m <= 200`
- `1 <= n <= 200`
- Each entry is `0` or `1`.
- The count fits in a 32-bit signed integer.
