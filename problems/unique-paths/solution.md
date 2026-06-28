## Approach

Use 1D dynamic programming where dp[j] represents the number of paths to cell (i, j). Each cell is reachable from the top and left, so dp[j] = dp[j] + dp[j-1].

## Complexity Analysis

- **Time Complexity:** O(m×n)
- **Space Complexity:** O(n)

## Implementation

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        k = min(m - 1, n - 1)
        a = m + n - 2
        MASK64 = 0xFFFFFFFFFFFFFFFF
        res = 1
        for i in range(1, k + 1):
            res = (res * (a - k + i)) & MASK64
            if res >= 0x8000000000000000:
                res -= 0x10000000000000000
            res = res // i if res >= 0 else -(-res // i)
        res &= 0xFFFFFFFF
        return res if res < 0x80000000 else res - 0x100000000
```
