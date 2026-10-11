## Approach

Scan every cell that has an upper-left neighbor and require equality with that neighbor. The first mismatch proves the grid is not Toeplitz; surviving the whole scan proves every diagonal is constant.

## Complexity Analysis

- **Time Complexity:** O(m*n) for one pass over the grid.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def isToeplitzMatrix(self, matrix: List[List[int]]) -> bool:
        for r in range(1, len(matrix)):
            for c in range(1, len(matrix[r])):
                if matrix[r][c] != matrix[r - 1][c - 1]:
                    return False
        return True
```
