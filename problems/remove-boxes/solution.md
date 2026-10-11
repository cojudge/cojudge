## Approach

Interval DP with an extra count k of same-coloured boxes fused to the left end. Collapse the leading run, score it immediately, or keep it and merge with a later matching box after the gap is cleared. Memoisation over (l, r, k) explores all merge orders.

## Complexity Analysis

- **Time Complexity:** O(n^4) worst case with n <= 100.
- **Space Complexity:** O(n^3) memo table.

## Implementation

```python
from typing import List
class Solution:
    def removeBoxes(self, boxes: List[int]) -> int:
        from functools import lru_cache
        n = len(boxes)
        @lru_cache(None)
        def dfs(l: int, r: int, k: int) -> int:
            if l > r:
                return 0
            while l + 1 <= r and boxes[l + 1] == boxes[l]:
                l += 1
                k += 1
            best = (k + 1) * (k + 1) + dfs(l + 1, r, 0)
            for m in range(l + 1, r + 1):
                if boxes[m] == boxes[l]:
                    best = max(best, dfs(l + 1, m - 1, 0) + dfs(m, r, k + 1))
            return best
        return dfs(0, n - 1, 0)
```
