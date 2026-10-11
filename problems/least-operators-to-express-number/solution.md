## Approach

Because the chain has no parentheses, every term glued by + or - is a product/quotient chain of x's, i.e. a power of x. Work recursively on the remaining value v: when v does not exceed x, build it from v copies of x/x (or subtract the shortfall from x). Otherwise locate the power x^k bracketing v, peel off one copy of x^(k-1) and recurse on the rest; when overshooting to x^k is close (x^k - v < v), also try reaching x^k and subtracting back. Memoization keeps the distinct states logarithmic.

## Complexity Analysis

- **Time Complexity:** O(log target) states, each doing O(1) work.
- **Space Complexity:** O(log target) for memoization and recursion depth.

## Implementation

```python
from functools import lru_cache

class Solution:
    def leastOpsExpressTarget(self, x: int, target: int) -> int:
        @lru_cache(maxsize=None)
        def dfs(v):
            if x >= v:
                return min(v * 2 - 1, 2 * (x - v))
            k = 2
            y = x * x
            while y < v:
                y *= x
                k += 1
            ans = (k - 1) + dfs(v - y // x)
            if y - v < v:
                ans = min(ans, k + dfs(y - v))
            return ans

        return dfs(target)
```
