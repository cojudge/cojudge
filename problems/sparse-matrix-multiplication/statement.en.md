Given two matrices `mat1` of size `m x k` and `mat2` of size `k x n`, return their product,
an `m x n` matrix where each entry `(i, j)` is the dot product of row `i` of `mat1` with
column `j` of `mat2`. The inputs are called sparse because most entries are zero, so a good
solution skips zero entries instead of multiplying everything blindly.

**Constraints:**
- `1 <= m, k, n <= 100`
- `-100 <= mat1[i][j], mat2[i][j] <= 100`.
