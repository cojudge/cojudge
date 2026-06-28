## Approach

2D dynamic programming where dp[i][j] stores the LCS length of prefixes text1[:i] and text2[:j]. If characters match, extend the LCS by 1; otherwise, take the maximum of excluding either character.

## Complexity Analysis

- **Time Complexity:** O(n * m), where n and m are the lengths of the two strings.
- **Space Complexity:** O(n * m) for the DP table.

## Implementation

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        n, m = len(text1), len(text2)
        dp = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[n][m]
```
