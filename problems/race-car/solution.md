## Approach

Think in terms of full forward bursts: n accelerations from rest reach 2^n - 1. If that equals the flag, n moves are optimal. Otherwise either overshoot with n moves, reverse, and solve the mirrored remainder, or drive n-1 moves, reverse, creep forward m moves, reverse again, and solve what is left. Trying every m and memoizing the remainders yields the optimum because any shortest plan has one of these two shapes.

## Complexity Analysis

- **Time Complexity:** O(T log T) for target T with memoization.
- **Space Complexity:** O(T) for the memo table plus recursion depth.

## Implementation

```python
class Solution:
    def racecar(self, target: int) -> int:
        from functools import lru_cache
        @lru_cache(maxsize=None)
        def dfs(t: int) -> int:
            if t == 0:
                return 0
            n = 1
            while (1 << n) - 1 < t:
                n += 1
            if (1 << n) - 1 == t:
                return n
            ans = n + 1 + dfs((1 << n) - 1 - t)
            for m in range(n - 1):
                cand = n + m + 1 + dfs(t - (1 << (n - 1)) + (1 << m))
                if cand < ans:
                    ans = cand
            return ans
        return dfs(target)
```
