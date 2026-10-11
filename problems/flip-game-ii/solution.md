## Approach

Depth-first game search with memoisation: try every flip, and win if any reply position is losing for the opponent. Boards without moves lose.

## Complexity Analysis

- **Time Complexity:** O(2^n)
- **Space Complexity:** O(2^n)

## Implementation

```python
class Solution:
    def canWin(self, currentState: str) -> bool:
        from functools import lru_cache
        @lru_cache(maxsize=None)
        def win(s: str) -> bool:
            c = list(s)
            for i in range(len(c) - 1):
                if c[i] == '+' and c[i + 1] == '+':
                    c[i] = c[i + 1] = '-'
                    nxt = ''.join(c)
                    c[i] = c[i + 1] = '+'
                    if not win(nxt):
                        return True
            return False
        return win(currentState)
```
