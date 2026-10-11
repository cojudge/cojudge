## Approach

Begin at the top-right cell, where moving left lowers the value and moving down raises it. Compare the current cell with the target: step left when the cell is too large and step down when it is too small. Either the target is found or the walk exits the matrix bounds.

## Complexity Analysis

- **Time Complexity:** O(m + n) for an m x n matrix. Each step discards one row or one column.
- **Space Complexity:** O(1), only two indices.

## Implementation

```python
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        r, c = 0, len(matrix[0]) - 1
        while r < len(matrix) and c >= 0:
            if matrix[r][c] == target:
                return True
            if matrix[r][c] > target:
                c -= 1
            else:
                r += 1
        return False
```
