## Approach

Transpose the matrix by swapping elements across the diagonal, then reverse each row to achieve a 90-degree clockwise rotation.

## Complexity Analysis

- **Time Complexity:** O(n²)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def rotate(self, matrix: List[List[int]]) -> List[List[int]]:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for i in range(n):
            matrix[i].reverse()
        return matrix
```
