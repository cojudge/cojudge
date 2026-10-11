## Approach

Record the digits already used in each row, column, and 3x3 box as bit masks, and collect the empty cells. Repeatedly pick the empty cell with the fewest legal candidates, try each one while updating the masks, and recurse; restore the masks when a branch dead-ends. Bit operations make candidate checks and updates constant time.

## Complexity Analysis

- **Time Complexity:** Worst-case exponential in the number of blanks, but mask pruning plus fewest-candidates-first keeps real puzzles fast.
- **Space Complexity:** O(1) extra space besides the recursion stack and the board itself.

## Implementation

```python
from typing import List
class Solution:
    def solveSudoku(self, board: List[str]) -> List[str]:
        g = [list(row) for row in board]
        rows, cols, boxes = [0] * 9, [0] * 9, [0] * 9
        empties = []
        for r in range(9):
            for c in range(9):
                if g[r][c] == '.':
                    empties.append((r, c))
                else:
                    b = 1 << (ord(g[r][c]) - ord('1'))
                    rows[r] |= b
                    cols[c] |= b
                    boxes[(r // 3) * 3 + c // 3] |= b

        def cands(r, c):
            return (~(rows[r] | cols[c] | boxes[(r // 3) * 3 + c // 3])) & 0x1FF

        def dfs(k):
            if k == len(empties):
                return True
            best = min(range(k, len(empties)),
                       key=lambda i: bin(cands(*empties[i])).count('1'))
            empties[k], empties[best] = empties[best], empties[k]
            r, c = empties[k]
            b = (r // 3) * 3 + c // 3
            m = cands(r, c)
            d = 1
            while m:
                if m & 1:
                    bit = 1 << (d - 1)
                    g[r][c] = str(d)
                    rows[r] |= bit
                    cols[c] |= bit
                    boxes[b] |= bit
                    if dfs(k + 1):
                        return True
                    rows[r] &= ~bit
                    cols[c] &= ~bit
                    boxes[b] &= ~bit
                d += 1
                m >>= 1
            g[r][c] = '.'
            empties[k], empties[best] = empties[best], empties[k]
            return False

        dfs(0)
        return [''.join(row) for row in g]
```
