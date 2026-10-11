## Approach

Collapse consecutive duplicates since they print together. On the shortened string, let `dp[l][r]` be the best cost for that interval. Paint `s[r]` separately for `dp[l][r-1] + 1`, then try sharing its turn with any equal letter `s[k]`: the cost becomes `dp[l][k] + dp[k+1][r-1]`. Fill intervals by growing length.

## Complexity Analysis

- **Time Complexity:** O(n^3) over intervals and split points.
- **Space Complexity:** O(n^2) for the table.

## Implementation

```python
class Solution:
    def strangePrinter(self, s: str) -> int:
        t = []
        for c in s:
            if not t or t[-1] != c:
                t.append(c)
        s = "".join(t)
        n = len(s)
        if n == 0:
            return 0
        dp = [[0] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = 1
        for ln in range(2, n + 1):
            for l in range(n - ln + 1):
                r = l + ln - 1
                dp[l][r] = dp[l][r - 1] + 1
                for k in range(l, r):
                    if s[k] == s[r]:
                        v = dp[l][k] + (dp[k + 1][r - 1] if k + 1 <= r - 1 else 0)
                        if v < dp[l][r]:
                            dp[l][r] = v
        return dp[0][n - 1]
```
