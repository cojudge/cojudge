## Approach

Triple loop over i, p, j but skip zero entries of mat1 so sparse rows cost almost nothing; accumulate into the answer matrix.

## Complexity Analysis

- **Time Complexity:** O(m x k x n)
- **Space Complexity:** O(m x n)

## Implementation

```python
from typing import List
class Solution:
    def multiply(self, mat1: List[List[int]], mat2: List[List[int]]) -> List[List[int]]:
        m, k, n = len(mat1), len(mat1[0]), len(mat2[0])
        ans = [[0] * n for _ in range(m)]
        for i in range(m):
            for p in range(k):
                if mat1[i][p] == 0:
                    continue
                for j in range(n):
                    ans[i][j] += mat1[i][p] * mat2[p][j]
        return ans
```
