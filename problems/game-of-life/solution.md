## Approach

Copy neighbor counts from the original board, then decide each cell's next state with the four rules. Reading from the snapshot guarantees simultaneity.

## Complexity Analysis

- **Time Complexity:** O(m * n) with constant neighbor work.
- **Space Complexity:** O(m * n) for the next board.

## Implementation

```python
from typing import List
class Solution:
    def gameOfLife(self, board: List[List[int]]) -> List[List[int]]:
        m, n = len(board), len(board[0])
        nxt = [[0] * n for _ in range(m)]
        for r in range(m):
            for c in range(n):
                live = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 1:
                            live += 1
                if board[r][c] == 1:
                    nxt[r][c] = 1 if live in (2, 3) else 0
                else:
                    nxt[r][c] = 1 if live == 3 else 0
        return nxt
```
