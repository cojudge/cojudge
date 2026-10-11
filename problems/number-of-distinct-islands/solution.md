## Approach

Scan every cell and flood-fill each undiscovered land mass with an explicit stack over four neighbours. For one island, shift all its cells by the island's minimum row and column, sort the resulting offsets, and join them into a canonical string that is identical exactly for translation-equal shapes. Collecting those strings in a set and reporting its size counts the distinct forms.

## Complexity Analysis

- **Time Complexity:** O(R * C log(R*C)) in the worst case due to sorting island cells; linear without that term.
- **Space Complexity:** O(R * C) for visited flags and the shape set.

## Implementation

```python
from typing import List
class Solution:
    def numDistinctIslands(self, grid: List[List[int]]) -> int:
        R, C = len(grid), len(grid[0])
        seen = [[False]*C for _ in range(R)]
        shapes = set()
        for r in range(R):
            for c in range(C):
                if grid[r][c] == 1 and not seen[r][c]:
                    stack = [(r, c)]
                    seen[r][c] = True
                    cells = []
                    while stack:
                        cr, cc = stack.pop()
                        cells.append((cr, cc))
                        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                            nr, nc = cr+dr, cc+dc
                            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1 and not seen[nr][nc]:
                                seen[nr][nc] = True
                                stack.append((nr, nc))
                    minr = min(x for x, _ in cells)
                    minc = min(y for _, y in cells)
                    sig = tuple(sorted((x-minr, y-minc) for x, y in cells))
                    shapes.add(sig)
        return len(shapes)
```
