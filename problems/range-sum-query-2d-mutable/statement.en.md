You are given a changeable `matrix` plus a script of operations to replay in order. Each
operation is either `"sumRegion"` with values `[row1, col1, row2, col2]`, asking for the sum
of the rectangle from `(row1, col1)` to `(row2, col2)` inclusive, or `"update"` with values
`[row, col, value]`, assigning `matrix[row][col] = value`. Return the answers of the
`"sumRegion"` operations in order. (This is the function-style view of the classic mutable
2D-range-sum design task usually solved with a 2D binary indexed tree.)

**Constraints:**
- `1 <= rows, cols <= 200`
- `-1000 <= matrix[i][j], value <= 1000`
- Indices in every operation are valid; at least one `"sumRegion"` appears.
