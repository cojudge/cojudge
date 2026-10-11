## Approach

Count black pixels per row and per column up front. A pixel can only qualify when its row count and column count both equal `N`, which already rules out most cells. For each surviving candidate, walk down its column: every row holding a black pixel there must match the candidate's whole row, compared with an array equality test. Candidates passing all three filters are tallied.

## Complexity Analysis

- **Time Complexity:** O(m^2 * n), where the picture is m by n: each candidate may scan a full column with row comparisons.
- **Space Complexity:** O(m + n) for the two count arrays.

## Implementation

```python
from typing import List
class Solution:
    def findBlackPixel(self, picture: List[List[str]], n: int) -> int:
        m, cols = len(picture), len(picture[0])
        row_count = [row.count('B') for row in picture]
        col_count = [sum(1 for i in range(m) if picture[i][j] == 'B') for j in range(cols)]
        ans = 0
        for i in range(m):
            if row_count[i] != n:
                continue
            for j in range(cols):
                if picture[i][j] != 'B' or col_count[j] != n:
                    continue
                ok = True
                for r in range(m):
                    if picture[r][j] == 'B' and picture[r] != picture[i]:
                        ok = False
                        break
                if ok:
                    ans += 1
        return ans
```
