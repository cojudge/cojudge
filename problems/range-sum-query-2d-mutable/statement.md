You are given a changeable `matrix` plus a script of operations to replay in order. Each
operation is either `"sumRegion"` with values `[row1, col1, row2, col2]`, asking for the sum
of the rectangle from `(row1, col1)` to `(row2, col2)` inclusive, or `"update"` with values
`[row, col, value]`, assigning `matrix[row][col] = value`. Return the answers of the
`"sumRegion"` operations in order. (This is the function-style view of the classic mutable
2D-range-sum design task usually solved with a 2D binary indexed tree.)

**Example 1:**
```
Input: matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]],
operations = ["sumRegion","update","sumRegion"], values = [[2,1,4,3],[3,2,2],[2,1,4,3]]
Output: [8,10]
Explanation: The rectangle sums to 8; after writing 2 at (3,2) it sums to 10.
```

**Example 2:**
```
Input: matrix = [[1]], operations = ["sumRegion","update","sumRegion"],
values = [[0,0,0,0],[0,0,5],[0,0,0,0]]
Output: [1,5]
Explanation: A lone cell is read, rewritten, and read again.
```

**Example 3:**
```
Input: matrix = [[1,2],[3,4]], operations = ["sumRegion","update","sumRegion"],
values = [[0,0,1,1],[0,0,10],[0,0,0,0]]
Output: [10,10]
Explanation: The whole 2 x 2 frame sums to 10, and cell (0,0) alone sums to 10 after its update.
```

**Constraints:**
- `1 <= rows, cols <= 200`
- `-1000 <= matrix[i][j], value <= 1000`
- Indices in every operation are valid; at least one `"sumRegion"` appears.
