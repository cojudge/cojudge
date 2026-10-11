You are given a rectangular board whose cells hold `'W'` (wall), `'E'`
(enemy) or `'0'` (empty ground). Dropping a bomb on an empty cell destroys
every enemy standing in the same row and column, with the blast stopped in
each direction by the first wall (or the board edge).

Report the largest number of enemies any single bomb placement can destroy.
When the board has no empty cell, the answer is zero.

**Type note:** the board arrives as a 2D char array; in Rust it is passed as
one string holding the JSON-encoded board.

**Example 1:**
```
Input: grid = [["0","E","0","0"],["E","0","W","E"],["0","E","0","0"]]
Output: 3
Explanation: A bomb on the middle of the first row sees two enemies downward
and one to the side, for a total of 3.
```

**Example 2:**
```
Input: grid = [["W","W","W"],["0","0","0"],["E","E","E"]]
Output: 1
Explanation: Walls block every column, so each empty cell sees exactly one
enemy below it.
```

**Constraints:**
- `1 <= grid.length, grid[i].length <= 50`
- Each cell is one of `'W'`, `'E'`, `'0'`
