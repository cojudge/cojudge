## Approach

Treat the set of already picked numbers as a bitmask and explore the game tree with depth-first search: a position is winning if some unused pick reaches the target at once or leaves the opponent in a losing position. Memoize results by mask so every reachable subset is evaluated a single time. Two shortcuts finish early: a non-positive target is an instant win, and a target above the sum of the whole pool is an instant loss.

## Complexity Analysis

- **Time Complexity:** O(m * 2^m), where m is `maxChoosableInteger` (at most 20), for the memoized states times the moves tried per state.
- **Space Complexity:** O(2^m) for the memo table.

## Implementation

```python
from functools import lru_cache

class Solution:
    def canIWin(self, maxChoosableInteger: int, desiredTotal: int) -> bool:
        if desiredTotal <= 0:
            return True
        if maxChoosableInteger * (maxChoosableInteger + 1) // 2 < desiredTotal:
            return False

        @lru_cache(maxsize=None)
        def win(used: int, total: int) -> bool:
            for i in range(1, maxChoosableInteger + 1):
                bit = 1 << (i - 1)
                if used & bit:
                    continue
                if total + i >= desiredTotal or not win(used | bit, total + i):
                    return True
            return False

        return win(0, 0)
```
