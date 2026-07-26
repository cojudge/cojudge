## Approach

Use dynamic programming where `dp[i][j]` records whether the first `i` characters of `s` match the first `j` characters of `p`. A literal or `.` extends `dp[i - 1][j - 1]`. For `x*`, either skip `x*` using `dp[i][j - 2]`, or consume one matching character and remain at the same pattern position using `dp[i - 1][j]`. Initialize the empty-string row for patterns that can reduce to empty.

## Complexity Analysis

- **Time Complexity:** O(m * n), where `m` and `n` are the string and pattern lengths.
- **Space Complexity:** O(m * n) for the dynamic programming table.

## Implementation

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True

        for j in range(2, n + 1):
            if p[j - 1] == "*":
                dp[0][j] = dp[0][j - 2]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                pattern = p[j - 1]
                if pattern == "." or pattern == s[i - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                elif pattern == "*":
                    dp[i][j] = dp[i][j - 2]
                    repeated = p[j - 2]
                    if repeated == "." or repeated == s[i - 1]:
                        dp[i][j] = dp[i][j] or dp[i - 1][j]
        return dp[m][n]
```
