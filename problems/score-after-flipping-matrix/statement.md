You are given a binary matrix `grid` with `m` rows and `n` columns. Each cell holds `0` or `1`, and each row is read as a binary number with the leftmost cell as the most significant bit.

You may perform two kinds of moves any number of times, in any order:

- Choose a row and invert every bit in that row.
- Choose a column and invert every bit in that column.

After all moves, the score is the sum of the row values interpreted in binary. Rearrange the bits with allowed moves to make this total as large as possible, and return that maximum.

**Constraints:**
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m <= 20`
- `1 <= n <= 20`
- `grid[i][j]` is `0` or `1`.
