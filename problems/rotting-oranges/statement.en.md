Picture a rectangular box of cells that is never empty. Each position stores one of three codes: `0` means the cell holds nothing, `1` means it holds a fresh orange, and `2` means it holds an already spoiled orange.

Spoilage advances in rounds, one round per minute: every fresh orange that shares an edge — up, down, left, or right, but not diagonally — with a spoiled orange turns spoiled too, with all such changes in a round happening together.

Determine the smallest number of minutes needed before no fresh orange is left anywhere in the box. When some fresh orange can never be reached by the spread, answer `-1` instead.

**Constraints:**
- `1 <= grid.length <= 10`
- `1 <= grid[r].length <= 10`
- Every row has the same length.
- Every cell is `0`, `1`, or `2`.
