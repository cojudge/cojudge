## Approach

Because ships never touch orthogonally, the first cell of each ship (in row-major order) is exactly an X whose upper and left neighbours are not X. Counting such heads in one scan yields the ship total without extra visited memory.

## Complexity Analysis

- **Time Complexity:** O(mn) for the single scan.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List

class Solution:
    def countBattleships(self, board: List[List[str]]) -> int:
        if not board or not board[0]:
            return 0
        m, n = len(board), len(board[0])
        count = 0
        for i in range(m):
            for j in range(n):
                if board[i][j] != "X":
                    continue
                if i > 0 and board[i - 1][j] == "X":
                    continue
                if j > 0 and board[i][j - 1] == "X":
                    continue
                count += 1
        return count
```
