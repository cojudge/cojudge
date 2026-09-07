## Approach

Iterate every cell. For each land cell add 4 to the perimeter, then subtract 2 for every shared edge with a land neighbor above or to the left.

## Complexity Analysis

- **Time Complexity:** O(mn)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        peri = 0
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == 0:
                    continue
                peri += 4
                if i > 0 and grid[i-1][j] == 1:
                    peri -= 2
                if j > 0 and grid[i][j-1] == 1:
                    peri -= 2
        return peri
```
