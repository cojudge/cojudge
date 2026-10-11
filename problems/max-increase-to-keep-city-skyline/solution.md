## Approach

First record the tallest tower in every row and every column. Each cell can then be lifted up to the smaller of its two caps without altering any skyline, so summing those headrooms over the whole grid gives the greatest achievable increase.

## Complexity Analysis

- **Time Complexity:** O(n * m) for an n by m grid, two passes.
- **Space Complexity:** O(n + m) for the row and column maxima.

## Implementation

```python
from typing import List
class Solution:
    def maxIncreaseKeepingSkyline(self, grid: List[List[int]]) -> int:
        row_max = [max(row) for row in grid]
        col_max = [max(col) for col in zip(*grid)]
        ans = 0
        for i, row in enumerate(grid):
            for j, h in enumerate(row):
                ans += min(row_max[i], col_max[j]) - h
        return ans
```
