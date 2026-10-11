## Approach

The three views separate cleanly. Scan every cell once: each positive cell adds one to the top view, and each row's running maximum feeds the front view. A second pass over the columns collects each column's maximum for the side view. Adding the three totals gives the answer.

## Complexity Analysis

- **Time Complexity:** O(n^2) for the full scan of the n x n grid.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List

class Solution:
    def projectionArea(self, grid: List[List[int]]) -> int:
        n = len(grid)
        top = sum(1 for i in range(n) for j in range(n) if grid[i][j] > 0)
        front = sum(max(row) for row in grid)
        side = sum(max(grid[i][j] for i in range(n)) for j in range(n))
        return top + front + side
```
