## Approach

Read every output cell from the untouched input. Gather the up-to-nine valid neighbours with offsets -1..1, skipping out-of-bounds positions, then store the integer average. A separate output grid prevents smoothed values from leaking into later cells.

## Complexity Analysis

- **Time Complexity:** O(m * n) with constant window work per cell.
- **Space Complexity:** O(m * n) for the answer grid.

## Implementation

```python
from typing import List
class Solution:
    def imageSmoother(self, img: List[List[int]]) -> List[List[int]]:
        m, n = len(img), len(img[0])
        ans = [[0] * n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                s = c = 0
                for di in (-1, 0, 1):
                    for dj in (-1, 0, 1):
                        ni, nj = i + di, j + dj
                        if 0 <= ni < m and 0 <= nj < n:
                            s += img[ni][nj]
                            c += 1
                ans[i][j] = s // c
        return ans
```
