## Approach

Handle rows from top to bottom while remembering, for every column pair, how many earlier rows held ones in both columns. Within the current row, each pair of ones can close one rectangle with every earlier row that shared the pair, so add the stored count and then increment it. This counts each rectangle once at its lower row.

## Complexity Analysis

- **Time Complexity:** O(m * n^2), where m is the row count and n is the column count, from enumerating column pairs per row.
- **Space Complexity:** O(n^2) for the pair counters.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def countCornerRectangles(self, grid: List[List[int]]) -> int:
        ans = 0
        cnt = defaultdict(int)
        for row in grid:
            ones = [i for i, v in enumerate(row) if v == 1]
            for a in range(len(ones)):
                for b in range(a + 1, len(ones)):
                    key = (ones[a], ones[b])
                    ans += cnt[key]
                    cnt[key] += 1
        return ans
```
