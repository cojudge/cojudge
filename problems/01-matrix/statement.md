You are given a rectangular binary grid `mat` containing only zeros and ones. At least one cell holds zero.

For every cell, compute how many steps it takes to reach the closest zero when you may move up, down, left, or right to a neighbouring cell. Each move costs one.

Return a grid of the same shape where each entry holds that distance.

**Example 1:**
```
Input: mat = [[0,0,0],[0,1,0],[0,0,0]]
Output: [[0,0,0],[0,1,0],[0,0,0]]
Explanation: The single 1 is adjacent to a 0, so its distance is 1.
```

**Example 2:**
```
Input: mat = [[0,0,0],[0,1,0],[1,1,1]]
Output: [[0,0,0],[0,1,0],[1,2,1]]
Explanation: Bottom-middle needs two steps to reach a 0.
```

**Example 3:**
```
Input: mat = [[0]]
Output: [[0]]
```

**Constraints:**
- `m == mat.length`, `n == mat[i].length`
- `1 <= m, n <= 100`
- `1 <= m * n <= 10^4`
- `mat[i][j]` is `0` or `1`
- At least one `0` exists
