You are given the current layout of a 3 by 3 tic-tac-toe board as an array of three strings. Each string has length 3 and each character is `X`, `O`, or `-` for an empty cell (the original statement uses a blank space, adapted here to a dash so that trailing blanks survive transport).

The opening move is always made by `X`, and the two sides then alternate strictly: `X`, `O`, `X`, `O`, and so on. A side claims victory as soon as any row, column, or diagonal is filled with three of its own marks. Play halts immediately after such a line appears, so no further marks are placed afterwards.

Decide whether the supplied layout could have arisen from a legal game played under these rules.

**Constraints:**
- `board.length == 3`
- `board[i].length == 3`
- Each character of `board` is `X`, `O`, or `-`
- Adaptation: empty cells use `-` instead of a blank space.
