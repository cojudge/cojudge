## Approach

A mine click ends immediately by marking `X`. Otherwise a depth-first reveal handles empty squares: count adjacent mines across the 8 neighbors; write the digit when the count is positive, else write `B` and recurse into every neighbor. The guard that only unrevealed `E` cells are processed keeps already-revealed squares untouched and prevents infinite loops.

## Complexity Analysis

- **Time Complexity:** O(m * n), where m and n are the board dimensions. Each cell is revealed at most once.
- **Space Complexity:** O(m * n) in the worst case for the recursion stack and flood region.

## Implementation

```python
from typing import List
class Solution:
    def updateBoard(self, board: List[List[str]], click: List[int]) -> List[str]:
        r, c = click
        if board[r][c] == 'M':
            board[r][c] = 'X'
        else:
            m, n = len(board), len(board[0])
            dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
            def reveal(x, y):
                if not (0 <= x < m and 0 <= y < n) or board[x][y] != 'E':
                    return
                mines = sum(1 for dx, dy in dirs
                            if 0 <= x+dx < m and 0 <= y+dy < n
                            and board[x+dx][y+dy] in ('M', 'X'))
                if mines > 0:
                    board[x][y] = str(mines)
                else:
                    board[x][y] = 'B'
                    for dx, dy in dirs:
                        reveal(x+dx, y+dy)
            reveal(r, c)
        return [''.join(row) for row in board]
```
