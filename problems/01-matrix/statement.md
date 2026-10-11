You are given a rectangular binary grid `mat` containing only zeros and ones. At least one cell holds zero.

For every cell, compute how many steps it takes to reach the closest zero when you may move up, down, left, or right to a neighbouring cell. Each move costs one.

Return a grid of the same shape where each entry holds that distance.

**Constraints:**
- `m == mat.length`, `n == mat[i].length`
- `1 <= m, n <= 100`
- `1 <= m * n <= 10^4`
- `mat[i][j]` is `0` or `1`
- At least one `0` exists
