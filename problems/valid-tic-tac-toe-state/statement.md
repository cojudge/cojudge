You are given the current layout of a 3 by 3 tic-tac-toe board as an array of three strings. Each string has length 3 and each character is `X`, `O`, or `-` for an empty cell (the original statement uses a blank space, adapted here to a dash so that trailing blanks survive transport).

The opening move is always made by `X`, and the two sides then alternate strictly: `X`, `O`, `X`, `O`, and so on. A side claims victory as soon as any row, column, or diagonal is filled with three of its own marks. Play halts immediately after such a line appears, so no further marks are placed afterwards.

Decide whether the supplied layout could have arisen from a legal game played under these rules.

**Example 1:**
```
Input: board = ["O--","---","---"]
Output: false
Explanation: The first mark must be X, so a board whose only mark is O cannot occur.
```

**Example 2:**
```
Input: board = ["XOX","-X-","---"]
Output: false
Explanation: The counts are X = 4 and O = 1, which breaks the alternation requirement that X equals O or exceeds it by exactly one.
```

**Example 3:**
```
Input: board = ["XXX","---","OOO"]
Output: false
Explanation: Both sides show a complete line, but the game would have stopped after the first one.
```

**Example 4:**
```
Input: board = ["XOX","O-O","XOX"]
Output: true
Explanation: Counts are X = 5 and O = 4 with no winning line, which matches a full drawn game.
```

**Constraints:**
- `board.length == 3`
- `board[i].length == 3`
- Each character of `board` is `X`, `O`, or `-`
- Adaptation: empty cells use `-` instead of a blank space.
