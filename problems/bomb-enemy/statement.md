You are given a rectangular board whose cells hold `'W'` (wall), `'E'`
(enemy) or `'0'` (empty ground). Dropping a bomb on an empty cell destroys
every enemy standing in the same row and column, with the blast stopped in
each direction by the first wall (or the board edge).

Report the largest number of enemies any single bomb placement can destroy.
When the board has no empty cell, the answer is zero.

**Type note:** the board arrives as a 2D char array; in Rust it is passed as
one string holding the JSON-encoded board.

**Constraints:**
- `1 <= grid.length, grid[i].length <= 50`
- Each cell is one of `'W'`, `'E'`, `'0'`
