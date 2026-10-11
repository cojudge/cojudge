## Approach

Check whether the reshape is feasible by comparing cell counts; a mismatch returns the original matrix. Otherwise walk a single flat index over all cells, translating it into source coordinates `(k / n, k % n)` and destination coordinates `(k / c, k % c)`, copying each value into its new home.

## Complexity Analysis

- **Time Complexity:** O(m * n), one visit per cell.
- **Space Complexity:** O(r * c) for the reshaped output.

## Implementation

```python
from typing import List

class Solution:
    def matrixReshape(self, mat: List[List[int]], r: int, c: int) -> List[List[int]]:
        m, n = len(mat), len(mat[0])
        if r * c != m * n:
            return mat
        ans = [[0] * c for _ in range(r)]
        for k in range(m * n):
            ans[k // c][k % c] = mat[k // n][k % n]
        return ans
```
