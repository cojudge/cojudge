## Approach

Build a `(m+1) x (n+1)` 2D prefix sum where `pref[i+1][j+1]` is the sum of `matrix[0..i][0..j]`. Each cell is `pref[i][j+1] + pref[i+1][j] - pref[i][j] + matrix[i][j]`. Then each query `[r1,c1,r2,c2]` is answered in `O(1)` by inclusion-exclusion: `pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1]`.

## Complexity Analysis

- **Time Complexity:** O(m*n + q) for `m x n` matrix and `q` queries (O(1) per query after preprocessing).
- **Space Complexity:** O(m*n) for the prefix table.

## Implementation

```python
from typing import List
class Solution:
    def sumRegion(self, matrix: List[List[int]], queries: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        pref = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m):
            for j in range(n):
                pref[i + 1][j + 1] = pref[i][j + 1] + pref[i + 1][j] - pref[i][j] + matrix[i][j]
        ans = []
        for r1, c1, r2, c2 in queries:
            ans.append(pref[r2 + 1][c2 + 1] - pref[r1][c2 + 1] - pref[r2 + 1][c1] + pref[r1][c1])
        return ans
```
