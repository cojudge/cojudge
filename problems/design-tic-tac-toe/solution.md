## Approach

Keep one counter per row, one per column, and one for each diagonal, adding +1 for player 1 and -1 for player 2 on every placement. After updating the affected row, column, and possibly diagonals, a counter whose absolute value equals the board size proves its owner fills that entire line. Each move therefore resolves in constant time and memory grows linearly with board size.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the number of moves (O(1) each).
- **Space Complexity:** O(n) for the row and column tallies.

## Implementation

```python
from typing import List
class Solution:
    def runTicTacToe(self, operations: List[str], args: List[List[int]]) -> List[int]:
        n = args[0][0]
        rows = [0] * n
        cols = [0] * n
        diag = anti = 0
        out = []
        for op, a in zip(operations[1:], args[1:]):
            if op == "move":
                r, c, p = a
                d = 1 if p == 1 else -1
                rows[r] += d
                cols[c] += d
                if r == c:
                    diag += d
                if r + c == n - 1:
                    anti += d
                if abs(rows[r]) == n or abs(cols[c]) == n or abs(diag) == n or abs(anti) == n:
                    out.append(p)
                else:
                    out.append(0)
        return out
```
