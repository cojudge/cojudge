You are given a Minesweeper board where each cell holds one character:
- `E`: an unrevealed empty square,
- `M`: an unrevealed mine,
- `B`: a revealed blank square (no neighboring mines),
- `1`–`8`: a revealed square showing its count of neighboring mines,
- `X`: a revealed mine.

You are also given a click position `[r, c]`. Apply one reveal step and return the updated board:
- If the clicked square hides a mine (`M`), it becomes `X` and the game ends.
- If the clicked square is empty (`E`), count its neighboring mines in all 8 directions (horizontal, vertical, diagonal). If the count is positive, write it as a digit character. If it is zero, write `B` and repeat the same reveal step for every neighboring square (neighbors that are already revealed stay as they are).
- Clicking an already revealed square changes nothing.

Return the updated board as a list of row strings: row `r` of the answer is the string formed by that row's characters from left to right.

*Adaptation note:* the board is passed in as a 2D grid of characters and the answer is read back as a list of strings (one per row) so every supported language can express it.

**Constraints:**
- `1 <= board.length, board[i].length <= 50`
- The board is rectangular; every cell holds one of `E`, `M`, `B`, `X`, or a digit `1`–`8`.
- `click.length == 2` and the position is inside the board.
