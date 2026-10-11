A ball sits on an `m x n` grid at (`startRow`, `startColumn`). In one move it may step to any of the four neighboring cells; a step that leaves the grid scores one successful path and ends that ball's journey. Count how many move sequences of at most `maxMove` moves take the ball out of bounds, returning the total modulo 1,000,000,007.

Count paths by dynamic programming over positions and remaining moves: from each cell, the four exits either leave immediately (when no neighbor exists) or continue from the neighboring cell with one fewer move.

**Example 1:**
```
Input: m = 2, n = 2, maxMove = 2, startRow = 0, startColumn = 0
Output: 6
Explanation: Six short sequences step off the corner within two moves.
```

**Example 2:**
```
Input: m = 1, n = 3, maxMove = 3, startRow = 0, startColumn = 1
Output: 12
Explanation: Twelve sequences of up to three moves exit the single row.
```

**Example 3:**
```
Input: m = 1, n = 1, maxMove = 1, startRow = 0, startColumn = 0
Output: 4
Explanation: Any of the four first steps leaves the lone cell.
```

**Constraints:**
- `1 <= m, n <= 50`
- `0 <= maxMove <= 50`
- `0 <= startRow < m`, `0 <= startColumn < n`
