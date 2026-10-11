Pull the k-th tiniest value out of a fully sorted grid.

You get an `n x n` matrix whose rows and columns each grow from small to large. Collecting every cell and sorting would order all `n^2` values; return the `k`-th entry of that order (counting from 1), keeping duplicates as separate positions rather than collapsing them.

**Example 1:**
```
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13
Explanation: Ordered values are [1,5,9,10,11,12,13,13,15], whose 8th entry is 13.
```

**Example 2:**
```
Input: matrix = [[-5]], k = 1
Output: -5
Explanation: The lone cell is the answer.
```

**Example 3:**
```
Input: matrix = [[1,2],[3,4]], k = 3
Output: 3
Explanation: Ordered values are [1,2,3,4].
```

**Constraints:**
- `n == matrix.length == matrix[i].length`
- `1 <= n <= 300`
- `-10^9 <= matrix[i][j] <= 10^9`
- Every row and every column is sorted in non-decreasing order.
- `1 <= k <= n * n`
