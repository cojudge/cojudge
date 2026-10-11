## Approach

Simulate the script on a matrix copy with direct rectangle sums (a 2D binary indexed tree gives the optimal version); collect each region sum in order.

## Complexity Analysis

- **Time Complexity:** O(q x m x n) naive
- **Space Complexity:** O(m x n)

## Implementation

```python
from typing import List
class Solution:
    def runNumMatrix(self, matrix: List[List[int]], operations: List[str], values: List[List[int]]) -> List[int]:
        a = [row[:] for row in matrix]
        ans = []
        for op, v in zip(operations, values):
            if op == 'update':
                a[v[0]][v[1]] = v[2]
            else:
                s = 0
                for i in range(v[0], v[2] + 1):
                    for j in range(v[1], v[3] + 1):
                        s += a[i][j]
                ans.append(s)
        return ans
```
