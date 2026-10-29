A rectangular grid holds `0` for water and `1` for land. Cells touching up, down, left or right belong to the same island; diagonal contact does not join islands.

Two islands share a shape when one can be slid (without rotation or flipping) to cover the other exactly. Count how many different shapes appear.

This is a portable adaptation: the grid arrives as `int_array_2d` and the answer is the integer shape count.

**Constraints:**
- `1 <= grid.length, grid[0].length <= 50`
- Grid entries are `0` or `1`.
