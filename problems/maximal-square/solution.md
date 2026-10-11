## Approach

Treat each cell as the bottom-right corner of a square: on a `'1'`, its side equals one plus the minimum of the squares ending above, to the left, and diagonally above-left, since all three must extend together. A `'0'` ends every square there. Keeping the largest side seen and squaring it gives the maximal area, using a single rolling row of state.

## Complexity Analysis

- **Time Complexity:** O(m * n) for one pass over the grid.
- **Space Complexity:** O(n) for the rolling row.

## Implementation

```python
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        cols = len(matrix[0])
        dp = [0] * (cols + 1)
        best = 0
        for row in matrix:
            prev = 0
            for j, cell in enumerate(row, start=1):
                tmp = dp[j]
                if cell == "1":
                    dp[j] = 1 + min(dp[j], dp[j - 1], prev)
                    best = max(best, dp[j])
                else:
                    dp[j] = 0
                prev = tmp
        return best * best
```
