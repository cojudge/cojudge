## Approach

Simulate the expanding spiral directly. Cycle through the headings east, south, west, north while the stride grows as 1, 1, 2, 2, 3, 3, and so on. Each visited position that falls inside the grid is appended to the answer; positions outside are simply skipped. The walk ends as soon as `rows * cols` cells have been gathered.

## Complexity Analysis

- **Time Complexity:** O(max(rows, cols)^2) steps in the worst case, since the spiral may wander outside before covering everything; each step is O(1).
- **Space Complexity:** O(rows * cols) for the collected coordinates.

## Implementation

```python
from typing import List

class Solution:
    def spiralMatrixIII(self, rows: int, cols: int, rStart: int, cStart: int) -> List[List[int]]:
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        res = [[rStart, cStart]]
        r, c, d, step = rStart, cStart, 0, 1
        while len(res) < rows * cols:
            for _ in range(2):
                for _ in range(step):
                    r += dirs[d][0]
                    c += dirs[d][1]
                    if 0 <= r < rows and 0 <= c < cols:
                        res.append([r, c])
                        if len(res) >= rows * cols:
                            break
                d = (d + 1) % 4
                if len(res) >= rows * cols:
                    break
            step += 1
        return res
```
