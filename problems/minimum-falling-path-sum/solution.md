## Approach

Process rows top-down keeping only the cheapest cost to reach each column. The cost to reach a cell is its own value plus the minimum of the three reachable costs from the row above (fewer at the borders). After the last row, the answer is the minimum entry.

## Complexity Analysis

- **Time Complexity:** O(n^2) for an n by n matrix. Each cell checks up to three predecessors.
- **Space Complexity:** O(n) for one rolling row of costs.

## Implementation

```python
from typing import List
class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        prev = list(matrix[0])
        n = len(matrix)
        for r in range(1, n):
            cur = [0] * n
            for c in range(n):
                best = prev[c]
                if c > 0:
                    best = min(best, prev[c - 1])
                if c + 1 < n:
                    best = min(best, prev[c + 1])
                cur[c] = matrix[r][c] + best
            prev = cur
        return min(prev)
```
