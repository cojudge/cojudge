Pull the k-th tiniest value out of a fully sorted grid.

You get an `n x n` matrix whose rows and columns each grow from small to large. Collecting every cell and sorting would order all `n^2` values; return the `k`-th entry of that order (counting from 1), keeping duplicates as separate positions rather than collapsing them.

**Constraints:**
- `n == matrix.length == matrix[i].length`
- `1 <= n <= 300`
- `-10^9 <= matrix[i][j] <= 10^9`
- Every row and every column is sorted in non-decreasing order.
- `1 <= k <= n * n`
