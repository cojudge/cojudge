## Approach

Rescale millilitres into 25 ml units so the four moves become small integer steps. Memoized recursion over remaining (a,b) pairs returns 0.5 when both empty together, 1.0 when only A is empty, 0.0 when only B is empty, and otherwise the average of the four successors. Very large `n` is shortcut to 1.0.

## Complexity Analysis

- **Time Complexity:** O(m^2), where m is ceil(n / 25), capped by the 5000 shortcut.
- **Space Complexity:** O(m^2) for the memo table.

## Implementation

```python
class Solution:
    def soupServings(self, n: int) -> str:
        if n >= 5000:
            return str(1.0)
        m = (n + 24) // 25
        memo = {}
        def dfs(a: int, b: int) -> float:
            if a <= 0 and b <= 0:
                return 0.5
            if a <= 0:
                return 1.0
            if b <= 0:
                return 0.0
            if (a, b) in memo:
                return memo[(a, b)]
            v = (dfs(a - 4, b) + dfs(a - 3, b - 1) + dfs(a - 2, b - 2) + dfs(a - 1, b - 3)) / 4.0
            memo[(a, b)] = v
            return v
        return str(dfs(m, m))
```
