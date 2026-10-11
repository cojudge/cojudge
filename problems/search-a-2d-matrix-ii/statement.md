Given an `m x n` integer matrix where each row is sorted in increasing order from left to right and each column is sorted in increasing order from top to bottom, decide whether a `target` value appears in the matrix.

Exploit the ordering rather than scanning every cell: values grow toward the bottom and the right, and shrink toward the top and the left.

Return `true` when `target` is present, otherwise return `false`.

**Constraints:**
- `m == matrix.length`, `n == matrix[i].length`
- `1 <= m, n <= 300`
- `-10^9 <= matrix[i][j] <= 10^9`
- Each row and each column is sorted in ascending order.
- `-10^9 <= target <= 10^9`
