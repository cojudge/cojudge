Given an `m x n` integer grid `matrix`, decide whether it is Toeplitz: every diagonal running from the upper left toward the lower right must hold a single repeated value. Formally, each cell must equal its upper-left neighbor whenever that neighbor exists.

**Example 1:**
```
Input: matrix = [[1,2,3,4],[5,1,2,3],[9,5,1,2]]
Output: true
Explanation: Diagonals [1,1,1], [2,2,2], [3,3], [4], [5,5], and [9] are each constant.
```

**Example 2:**
```
Input: matrix = [[1,2],[2,2]]
Output: false
Explanation: The main diagonal holds 1 and 2, which differ.
```

**Example 3:**
```
Input: matrix = [[1]]
Output: true
Explanation: A single cell is trivially Toeplitz.
```

**Constraints:**
- `m == matrix.length`, `n == matrix[i].length`
- `1 <= m, n <= 20`
- `0 <= matrix[i][j] <= 99`
