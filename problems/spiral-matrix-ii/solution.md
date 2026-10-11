## Approach

Fill the grid layer by layer with four moving boundaries. Write the top row left to right, the right column top to bottom, the bottom row right to left, and the left column bottom to top, shrinking each boundary after its edge is done. Repeat until the boundaries cross.

## Complexity Analysis

- **Time Complexity:** O(n^2), one write per cell.
- **Space Complexity:** O(1), excluding the output matrix.

## Implementation

```python
from typing import List
class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        m = [[0] * n for _ in range(n)]
        top, bottom, left, right = 0, n - 1, 0, n - 1
        num = 1
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                m[top][j] = num
                num += 1
            top += 1
            for i in range(top, bottom + 1):
                m[i][right] = num
                num += 1
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    m[bottom][j] = num
                    num += 1
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    m[i][left] = num
                    num += 1
                left += 1
        return m
```
