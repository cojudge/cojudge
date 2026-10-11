An `n x n` board holds the squares numbered `1` to `n * n`. Numbering starts at the bottom-left corner with `1`, runs left to right across the bottom row, then continues right to left on the row above, alternating direction on every row (boustrophedon order).

Each cell is either `-1` (nothing happens there) or the number of a destination square: landing on it via a die throw forces an immediate jump to that destination (a ladder when the destination is larger, a snake when it is smaller). You start on square `1`. Each throw lets you pick any of the next 1 to 6 squares ahead (never past `n * n`); if the chosen square holds a jump, you take it at once. Return the smallest number of throws needed to land exactly on square `n * n`, or `-1` if it cannot be reached.

**Example 1:**
```
Input: board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]
Output: 4
```

**Example 2:**
```
Input: board = [[-1,-1],[-1,3]]
Output: 1
Explanation: Move 1 -> 2, then ride the ladder 2 -> 4.
```

**Example 3:**
```
Input: board = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]
Output: 2
```

**Constraints:**
- `n == board.length == board[i].length`
- `2 <= n <= 20`
- `board[i][j]` is `-1` or an integer in `[1, n * n]`
