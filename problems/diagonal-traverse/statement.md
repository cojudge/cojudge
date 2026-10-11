Given a rectangular grid of numbers, list its entries in diagonal zigzag order. Start at the top-left corner heading up-and-right, then alternate between down-and-left and up-and-right each time a border is reached. When a border blocks the diagonal step, sidestep along the border to the next row or column and flip direction.

Continue until every cell has been emitted once, and return the resulting flat list.

**Constraints:**
- `1 <= mat.length * mat[i].length <= 10^4`
- Each row has the same length
- `-10^5 <= mat[i][j] <= 10^5`
