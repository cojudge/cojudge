You own an `n x n` grid whose cells all start as `1`. A list `mines` marks cells that are flipped to `0`; each entry is a `[row, col]` pair.

An axis-aligned plus of order `k` needs a center cell holding `1` plus four straight arms of `1`s reaching `k - 1` steps up, down, left, and right from that center. Cells outside the arms are irrelevant. Return the greatest order achievable anywhere in the grid, or `0` when no `1` remains.

**Constraints:**
- `1 <= n <= 500`
- `0 <= mines.length <= 5000`
- `0 <= xi, yi < n`
- All mine pairs are unique
