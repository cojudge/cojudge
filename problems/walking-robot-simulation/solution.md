## Approach

Collect all obstacles into a set of coordinate pairs for constant-time lookup. Walk through the commands while tracking the position and a heading index (north, east, south, west). Turns only rotate the heading; a move command advances one cell at a time and stops early when the next cell is blocked. After every step, refresh the best value of `x*x + y*y`.

## Complexity Analysis

- **Time Complexity:** O(C + S), where C is the number of commands and S is the total number of single steps walked (at most 9 per move command).
- **Space Complexity:** O(B) for the obstacle set, where B is the number of obstacles.

## Implementation

```python
from typing import List

class Solution:
    def robotSim(self, commands: List[int], obstacles: List[List[int]]) -> int:
        blocked = {(x, y) for x, y in obstacles}
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        d = x = y = best = 0
        for c in commands:
            if c == -2:
                d = (d + 3) % 4
            elif c == -1:
                d = (d + 1) % 4
            else:
                for _ in range(c):
                    nx, ny = x + dirs[d][0], y + dirs[d][1]
                    if (nx, ny) in blocked:
                        break
                    x, y = nx, ny
                    best = max(best, x * x + y * y)
        return best
```
