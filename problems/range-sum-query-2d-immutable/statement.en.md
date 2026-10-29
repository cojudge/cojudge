Given a 2D matrix `matrix`, handle multiple queries asking for the sum of elements inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.

For this judge, you are given the full `matrix` and a list of `queries`, where each query is `[row1, col1, row2, col2]`. Return an array with the sum for each query in order. An efficient solution precomputes a 2D prefix sum so each query runs in `O(1)`.

**Constraints:**

- m == matrix.length, n == matrix[i].length
- 1 ≤ m, n ≤ 200
- -10^4 ≤ matrix[i][j] ≤ 10^4
- 0 ≤ row1 ≤ row2 < m, 0 ≤ col1 ≤ col2 < n
- At most 10^4 queries.
