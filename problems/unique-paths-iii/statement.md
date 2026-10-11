A grid contains `1` (start), `2` (finish), `0` (open), and `-1` (blocked). From the start cell, move up, down, left, or right one step at a time without leaving the grid or entering blocked cells.

A valid walk must step on every non-blocked cell exactly once and finish on the `2` cell. Count such walks.

**Constraints:**
- `1 <= grid.length, grid[0].length <= 20`
- Values are only `-1`, `0`, `1`, or `2`.
- Exactly one `1` and one `2` appear.
