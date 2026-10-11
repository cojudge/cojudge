## Approach

Handle rows and columns separately: gather the coordinates of all homes (already sorted by scan order), take each median, and add the absolute deviations.

## Complexity Analysis

- **Time Complexity:** O(m x n)
- **Space Complexity:** O(m x n)

## Implementation

```python
from typing import List
class Solution:
    def minTotalDistance(self, grid: List[List[int]]) -> int:
        rows = [i for i, row in enumerate(grid) for v in row if v == 1]
        cols = [j for j in range(len(grid[0])) for i in range(len(grid)) if grid[i][j] == 1]
        def spread(v):
            med = v[len(v) // 2]
            return sum(abs(x - med) for x in v)
        return spread(rows) + spread(cols)
```
