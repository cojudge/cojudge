## Approach

Walk columns left to right while tracking which neighbouring row pairs are already strictly ordered by the columns kept so far. A column that steps down on any undecided pair must be deleted. Otherwise keep it and promote every pair it orders strictly to decided. Decided pairs never constrain later columns, which makes the greedy choice optimal.

## Complexity Analysis

- **Time Complexity:** O(n * m) for n rows and m columns.
- **Space Complexity:** O(n) for the decided-pair flags.

## Implementation

```python
from typing import List
class Solution:
    def minDeletionSize(self, strs: List[str]) -> int:
        rows = len(strs)
        if rows <= 1:
            return 0
        cols = len(strs[0])
        done = [False] * rows
        dels = 0
        for c in range(cols):
            bad = any(not done[r] and strs[r][c] > strs[r + 1][c] for r in range(rows - 1))
            if bad:
                dels += 1
                continue
            for r in range(rows - 1):
                if not done[r] and strs[r][c] < strs[r + 1][c]:
                    done[r] = True
        return dels
```
