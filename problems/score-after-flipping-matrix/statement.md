You are given a binary matrix `grid` with `m` rows and `n` columns. Each cell holds `0` or `1`, and each row is read as a binary number with the leftmost cell as the most significant bit.

You may perform two kinds of moves any number of times, in any order:

- Choose a row and invert every bit in that row.
- Choose a column and invert every bit in that column.

After all moves, the score is the sum of the row values interpreted in binary. Rearrange the bits with allowed moves to make this total as large as possible, and return that maximum.

**Example 1:**
```
Input: grid = [[0,0,1,1],[1,0,1,0],[1,1,0,0]]
Output: 39
Explanation: Force the first column to all ones with row moves, then flip the best columns to get rows 1111, 1001 and 1011 which are 15, 13 and 11, summing to 39.
```

**Example 2:**
```
Input: grid = [[0]]
Output: 1
Explanation: Flip the single cell to 1.
```

**Example 3:**
```
Input: grid = [[0,1],[1,1]]
Output: 5
Explanation: An optimal sequence yields rows 10 and 11, scoring 2 + 3 = 5.
```

**Constraints:**
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m <= 20`
- `1 <= n <= 20`
- `grid[i][j]` is `0` or `1`.
