## Approach

Check columns one at a time. For a fixed column, walk down the rows comparing each adjacent pair; the first downward step marks the column for deletion and the scan moves on. Columns with no downward step are kept. The total number of marked columns is the answer.

## Complexity Analysis

- **Time Complexity:** O(n * m) for n rows and m columns.
- **Space Complexity:** O(1), only counters are stored.

## Implementation

```python
from typing import List
class Solution:
    def minDeletionSize(self, strs: List[str]) -> int:
        if not strs:
            return 0
        dels = 0
        for c in range(len(strs[0])):
            for r in range(len(strs) - 1):
                if strs[r][c] > strs[r + 1][c]:
                    dels += 1
                    break
        return dels
```
