## Approach

Use the first row and first column as markers to record which rows and columns should be zeroed. Track whether those rows/columns originally contained a zero separately to avoid overwriting.

## Complexity Analysis

- **Time Complexity:** O(m×n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> List[List[int]]:
        m, n = len(matrix), len(matrix[0])
        first_row = any(matrix[0][j] == 0 for j in range(n))
        first_col = any(matrix[i][0] == 0 for i in range(m))
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        if first_row:
            for j in range(n):
                matrix[0][j] = 0
        if first_col:
            for i in range(m):
                matrix[i][0] = 0
        return matrix
```
