You are given a rectangular grid encoded as an array of strings, where each string is one row. Each character means something:

- `@` is your starting cell.
- `.` is an empty cell you can walk on.
- `#` is a wall you cannot enter.
- Lowercase letters `a` to `f` are keys you must pick up (at most six distinct keys).
- Uppercase letters `A` to `F` are locked doors that open only after you hold the matching lowercase key.

In one move you can step up, down, left, or right to a neighboring cell that is inside the grid and not a wall or a locked door you cannot yet open. Walking onto a key cell collects that key automatically.

Return the smallest number of moves needed to collect every key present in the grid. If it cannot be done, return `-1`.

Adaptation note: the grid is passed as a string array (one string per row) and the answer is an integer, using only the allowed `string_array` and `int` types.

**Constraints:**
- `1 <= grid.length <= 30`
- `1 <= grid[i].length <= 30`
- All rows have equal length.
- Exactly one `@` appears; between zero and six keys appear.
