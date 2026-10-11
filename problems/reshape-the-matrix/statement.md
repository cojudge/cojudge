Given an `m x n` matrix `mat` and target dimensions `r` rows and `c` columns, return the reshaped matrix whose entries follow the original row-major order. If the total cell count differs (`r * c != m * n`), reshaping is impossible and the original matrix must be returned unchanged.

To rebuild, read the input left to right, top to bottom into a flat stream, then deal that stream into `r` rows of `c` entries each.

**Example 1:**
```
Input: mat = [[1,2],[3,4]], r = 1, c = 4
Output: [[1,2,3,4]]
Explanation: The four values flow into a single row in order.
```

**Example 2:**
```
Input: mat = [[1,2],[3,4]], r = 2, c = 4
Output: [[1,2],[3,4]]
Explanation: 2*4 != 2*2, so the input is returned as is.
```

**Example 3:**
```
Input: mat = [[1,2,3],[4,5,6]], r = 3, c = 2
Output: [[1,2],[3,4],[5,6]]
Explanation: Six values in order fill three rows of two.
```

**Constraints:**
- `1 <= m, n <= 100`
- `1 <= r, c <= 300`
- `-1000 <= mat[i][j] <= 1000`
