You are handed a rectangular integer table that is never empty, together with an integer `target`. Report whether `target` occurs anywhere inside the table: answer `true` when it does and `false` when it does not.

The table obeys one strict global ordering:

- each row runs left to right in nondecreasing order;
- for every row past the first, its opening entry is strictly larger than the closing entry of the row directly above it.

Put differently, reading the rows one after another starting from the top left produces a single fully sorted sequence.

**Constraints:**

- `1 <= matrix.length, matrix[i].length <= 100`
- Every row has the same number of columns.
- `-10^4 <= matrix[i][j], target <= 10^4`
- The matrix satisfies the global ordering described above.

**Judge adaptation:** Code `searchMatrix(matrix, target)` directly in this repository. The test harness in each language passes the rectangle using that language's usual nested integer-array type.
