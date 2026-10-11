Given an `m x n` integer matrix where each row is sorted in increasing order from left to right and each column is sorted in increasing order from top to bottom, decide whether a `target` value appears in the matrix.

Exploit the ordering rather than scanning every cell: values grow toward the bottom and the right, and shrink toward the top and the left.

Return `true` when `target` is present, otherwise return `false`.

**Example 1:**
```
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
Output: true
Explanation: The value 5 sits at row 1, column 1.
```

**Example 2:**
```
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
Output: false
Explanation: No cell holds the value 20.
```

**Constraints:**
- `m == matrix.length`, `n == matrix[i].length`
- `1 <= m, n <= 300`
- `-10^9 <= matrix[i][j] <= 10^9`
- Each row and each column is sorted in ascending order.
- `-10^9 <= target <= 10^9`
