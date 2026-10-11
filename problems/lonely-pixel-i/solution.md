## Approach

First tally the black pixels in every row and every column with two counting arrays. Then revisit each black pixel and keep it only when both its row tally and its column tally equal exactly one. This two-pass scan captures precisely the lonely pixels.

## Complexity Analysis

- **Time Complexity:** O(m * n), where m and n are the picture dimensions.
- **Space Complexity:** O(m + n) for the row and column tallies.

## Implementation

```python
from typing import List
class Solution:
    def findLonelyPixel(self, picture: List[List[str]]) -> int:
        m, n = len(picture), len(picture[0])
        rows = [0] * m
        cols = [0] * n
        for i in range(m):
            for j in range(n):
                if picture[i][j] == 'B':
                    rows[i] += 1
                    cols[j] += 1
        ans = 0
        for i in range(m):
            for j in range(n):
                if picture[i][j] == 'B' and rows[i] == 1 and cols[j] == 1:
                    ans += 1
        return ans
```
