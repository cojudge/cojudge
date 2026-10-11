You are given a binary grid `grid` holding only `0` and `1`.

An axis-aligned corner rectangle is a choice of two different rows `r1 < r2` and two different columns `c1 < c2` such that all four crossings `(r1,c1)`, `(r1,c2)`, `(r2,c1)` and `(r2,c2)` hold `1`. Cells inside or on the edges may be anything; only the four corners matter.

Return how many such rectangles appear in the grid.

**Example 1:**
```
Input: grid = [[1,0,0,1,0],[0,0,1,0,1],[0,0,0,1,0],[1,0,1,0,1]]
Output: 1
Explanation: Only rows 1 and 3 together with columns 2 and 4 have ones at all four crossings.
```

**Example 2:**
```
Input: grid = [[1,1,1],[1,1,1],[1,1,1]]
Output: 9
Explanation: Any pair of the 3 rows with any pair of the 3 columns works, giving 3 times 3 rectangles.
```

**Example 3:**
```
Input: grid = [[1,1,1,1]]
Output: 0
Explanation: A single row can never supply two different rows.
```

**Constraints:**
- `m == grid.length`, `n == grid[i].length`
- `1 <= m <= 200`
- `1 <= n <= 200`
- Each entry is `0` or `1`.
- The count fits in a 32-bit signed integer.
