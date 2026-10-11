Given two matrices `mat1` of size `m x k` and `mat2` of size `k x n`, return their product,
an `m x n` matrix where each entry `(i, j)` is the dot product of row `i` of `mat1` with
column `j` of `mat2`. The inputs are called sparse because most entries are zero, so a good
solution skips zero entries instead of multiplying everything blindly.

**Example 1:**
```
Input: mat1 = [[1,0,0],[-1,0,3]], mat2 = [[7,0,0],[0,0,0],[0,0,1]]
Output: [[7,0,0],[-7,0,3]]
Explanation: Row 0 picks out row 0 of mat2; row 1 mixes rows 0 and 2.
```

**Example 2:**
```
Input: mat1 = [[0]], mat2 = [[0]]
Output: [[0]]
Explanation: A single zero entry multiplies to zero.
```

**Example 3:**
```
Input: mat1 = [[1,2],[3,4]], mat2 = [[5,6],[7,8]]
Output: [[19,22],[43,50]]
Explanation: Plain dense multiplication of two 2 x 2 matrices.
```

**Constraints:**
- `1 <= m, k, n <= 100`
- `-100 <= mat1[i][j], mat2[i][j] <= 100`.
