## Approach

Fill a table over the two prefixes. The first row and column accumulate the cost of deleting everything on one side. For other cells, equal letters carry the diagonal value for free, while differing letters pay the cheaper of deleting from the first or the second string. The bottom-right cell is the answer.

## Complexity Analysis

- **Time Complexity:** O(m*n), where m and n are the string lengths.
- **Space Complexity:** O(m*n), reducible to O(min(m,n)) with rolling rows.

## Implementation

```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        dp = [[0]*(n+1) for _ in range(m+1)]
        for i in range(1, m+1):
            dp[i][0] = dp[i-1][0] + ord(s1[i-1])
        for j in range(1, n+1):
            dp[0][j] = dp[0][j-1] + ord(s2[j-1])
        for i in range(1, m+1):
            for j in range(1, n+1):
                if s1[i-1] == s2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = min(dp[i-1][j] + ord(s1[i-1]), dp[i][j-1] + ord(s2[j-1]))
        return dp[m][n]
```
