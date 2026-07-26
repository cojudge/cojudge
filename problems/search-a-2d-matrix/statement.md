Given a nonempty rectangular integer matrix and an integer `target`, return `true` if `target` appears in the matrix. Otherwise, return `false`.

The matrix is globally sorted:

- Every row is sorted in nondecreasing order.
- The first value of each row after the first is greater than the last value of the preceding row.

**Constraints:**

- `1 <= matrix.length, matrix[i].length <= 100`
- Every row has the same number of columns.
- `-10^4 <= matrix[i][j], target <= 10^4`
- The matrix satisfies the global ordering described above.

**Portable interface:** Implement `searchMatrix(matrix, target)` directly. The judge supplies the rectangular matrix in each language's native two-dimensional integer-array representation.
