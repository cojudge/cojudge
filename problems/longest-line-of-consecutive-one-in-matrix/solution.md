## Approach

Sweep the matrix once while remembering, for every `1` cell, how long the run ending there is in each of the four allowed directions. The horizontal count extends the left neighbor, the vertical count extends the upper neighbor, the diagonal count extends the upper-left neighbor, and the anti-diagonal count extends the upper-right neighbor; zeros reset everything. The largest value seen is the answer.

## Complexity Analysis

- **Time Complexity:** O(m * n) for a single pass over all cells.
- **Space Complexity:** O(m * n) for the four direction tables (compressible to O(n)).

## Implementation

```python
from typing import List

class Solution:
    def longestLine(self, mat: List[List[int]]) -> int:
        m, n = len(mat), len(mat[0])
        best = 0
        dp = [[[0] * 4 for _ in range(n)] for _ in range(m)]
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    continue
                dp[i][j][0] = (dp[i][j - 1][0] if j > 0 else 0) + 1
                dp[i][j][1] = (dp[i - 1][j][1] if i > 0 else 0) + 1
                dp[i][j][2] = (dp[i - 1][j - 1][2] if i > 0 and j > 0 else 0) + 1
                dp[i][j][3] = (dp[i - 1][j + 1][3] if i > 0 and j + 1 < n else 0) + 1
                best = max(best, max(dp[i][j]))
        return best
```
