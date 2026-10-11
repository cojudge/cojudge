You are given an `m x n` table `grid` whose entries are all zero or positive. Starting in the upper-left corner, you must reach the lower-right corner, stepping only one cell downward or one cell rightward at a time. Among all such monotone routes, find the one whose visited cells add up to the smallest total, and return that total.

**Example 1:**
```
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: The route visiting 1 → 3 → 1 → 1 → 1 gives the smallest possible total.
```

**Example 2:**
```
Input: grid = [[1,2,3],[4,5,6]]
Output: 12
```

**Constraints:**
- m == grid.length
- n == grid[i].length
- 1 ≤ m, n ≤ 200
- 0 ≤ grid[i][j] ≤ 200
