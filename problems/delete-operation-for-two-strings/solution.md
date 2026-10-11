## Approach

The characters that survive must form a common subsequence, so keeping the longest one is optimal. A classic two-row dynamic program finds the longest common subsequence length, and the deletions are whatever remains in both words.

## Complexity Analysis

- **Time Complexity:** O(m*n) for the table.
- **Space Complexity:** O(m*n), easily reduced to O(min(m,n)).

## Implementation

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = dp[i - 1][j] if dp[i - 1][j] > dp[i][j - 1] else dp[i][j - 1]
        return m + n - 2 * dp[m][n]
```
