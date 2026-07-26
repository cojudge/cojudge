You are given a nonempty rectangular grid where each cell is:

- `0` for empty,
- `1` for a fresh orange, or
- `2` for a rotten orange.

Every minute, each fresh orange horizontally or vertically adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains. Return `-1` if this is impossible.

**Constraints:**
- `1 <= grid.length <= 10`
- `1 <= grid[r].length <= 10`
- Every row has the same length.
- Every cell is `0`, `1`, or `2`.
