## Approach

The global ordering makes the matrix equivalent to one sorted array in row-major order. Binary-search virtual indices from `0` through `rows * columns - 1`, mapping index `i` to `matrix[i // columns][i % columns]`. This avoids constructing a flattened copy.

## Complexity Analysis

- **Time Complexity:** O(log(m * n)), where `m` is the number of rows and `n` is the number of columns.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        columns = len(matrix[0])
        left, right = 0, len(matrix) * columns - 1
        while left <= right:
            middle = left + (right - left) // 2
            value = matrix[middle // columns][middle % columns]
            if value == target:
                return True
            if value < target:
                left = middle + 1
            else:
                right = middle - 1
        return False
```
