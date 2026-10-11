## Approach

Think of flipping a row as deciding its first cell becomes 1, since the leading bit dominates all others combined. Normalize every row that way without explicitly rewriting the grid. After that, each column is independent: either keep it or invert it, so take the larger of the one-count and zero-count times the column weight. Summing those maxima gives the best achievable total.

## Complexity Analysis

- **Time Complexity:** O(m * n) to count each column once.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List

class Solution:
    def matrixScore(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        ans = 0
        for j in range(n):
            ones = 0
            for i in range(m):
                v = grid[i][j] ^ (1 if grid[i][0] == 0 else 0)
                if v == 1:
                    ones += 1
            ans += max(ones, m - ones) * (1 << (n - 1 - j))
        return ans
```
