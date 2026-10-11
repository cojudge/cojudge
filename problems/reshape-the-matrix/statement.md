Given an `m x n` matrix `mat` and target dimensions `r` rows and `c` columns, return the reshaped matrix whose entries follow the original row-major order. If the total cell count differs (`r * c != m * n`), reshaping is impossible and the original matrix must be returned unchanged.

To rebuild, read the input left to right, top to bottom into a flat stream, then deal that stream into `r` rows of `c` entries each.

**Constraints:**
- `1 <= m, n <= 100`
- `1 <= r, c <= 300`
- `-1000 <= mat[i][j] <= 1000`
