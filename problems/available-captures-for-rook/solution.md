## Approach

Find the rook's cell with a single scan of the board. From there, step outward
in each of the four straight directions one square at a time. Empty squares
are skipped; the first bishop ends that direction with no capture, while the
first pawn adds one capture and ends the direction. Adding the results of all
four walks gives the answer.

## Complexity Analysis

- **Time Complexity:** O(m * n), where m and n are the board dimensions (8x8 here). The rook search plus four bounded walks each touch a cell at most a few times.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
from typing import List
class Solution:
    def numRookCaptures(self, board: List[List[str]]) -> int:
        rx = ry = -1
        for i, row in enumerate(board):
            for j, c in enumerate(row):
                if c == 'R':
                    rx, ry = i, j
        ans = 0
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            x, y = rx + dx, ry + dy
            while 0 <= x < len(board) and 0 <= y < len(board[0]):
                if board[x][y] == 'B':
                    break
                if board[x][y] == 'p':
                    ans += 1
                    break
                x += dx
                y += dy
        return ans
```
