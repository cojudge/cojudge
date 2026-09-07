## Approach

The transpose of a matrix swaps its rows and columns. For an `m x n` matrix, the result is an `n x m` matrix where `result[j][i] = matrix[i][j]`. Create the result with swapped dimensions and fill it by iterating over every cell of the original matrix.

## Complexity Analysis

- **Time Complexity:** O(m * n), where `m` is the number of rows and `n` is the number of columns. Every cell is visited once.
- **Space Complexity:** O(m * n) for the output matrix (excluding the output, O(1) extra space).

## Implementation

```python
from typing import List

class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        m, n = len(matrix), len(matrix[0])
        ans = [[0] * m for _ in range(n)]
        for i in range(m):
            for j in range(n):
                ans[j][i] = matrix[i][j]
        return ans
```