## Approach

Group dial positions by their letter so each key character only considers stops that can actually spell it. Then run a memoized search over states `(key index, current dial position)`: for the next needed letter, try every matching stop, pay the shorter circular walk plus one press, and continue from there. Taking the minimum over those choices yields the optimal total.

## Complexity Analysis

- **Time Complexity:** O(k * m^2) in the worst case, where k is the key length and m the ring length (each state scans matching stops).
- **Space Complexity:** O(k * m) for the memo table plus the position groups.

## Implementation

```python
class Solution:
    def findRotateSteps(self, ring: str, key: str) -> int:
        from functools import lru_cache
        m = len(ring)
        pos_map = {}
        for i, c in enumerate(ring):
            pos_map.setdefault(c, []).append(i)

        @lru_cache(maxsize=None)
        def dp(ki, pos):
            if ki == len(key):
                return 0
            best = 10 ** 9
            for np in pos_map[key[ki]]:
                diff = abs(pos - np)
                step = min(diff, m - diff)
                best = min(best, step + 1 + dp(ki + 1, np))
            return best

        return dp(0, 0)
```
