A square board of `n x n` cells is described by `n` text rows. Each cell holds one mark: `' '` (empty), `'/'` (a wall joining the top-right and bottom-left corners), or `'\\'` (a wall joining the top-left and bottom-right corners). The walls split the board into connected zones; empty space touching across cell edges belongs to one zone.

Count how many distinct zones the walls create.

Input encoding: because blank cells are significant, the rows are passed as a single string with rows joined by `'|'` (for example `" /|/ "` means the two rows `" /"` and `"/ "`). The `'|'` character never appears inside a row.

**Constraints:**
- The board is `n x n` with `1 <= n <= 30`, and every row has exactly `n` characters.
- Each character is `' '`, `'/'`, or `'\\'`.
- Rows are joined with `'|'` into one string.
