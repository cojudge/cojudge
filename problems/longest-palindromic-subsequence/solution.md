## Approach

Work over intervals: for substring `s[i..j]`, equal ends wrap the best answer of the inner interval plus two, while differing ends inherit the better of dropping the left or the right character. Processing starts from short intervals toward longer ones guarantees dependencies are solved. A single rolling row is enough because each step only needs the previous row's values and the diagonal.

## Complexity Analysis

- **Time Complexity:** O(n^2) interval states with O(1) work each.
- **Space Complexity:** O(n) with the rolling one-dimensional table.

## Implementation

```python
class Solution:
    def longestPalindromeSubseq(self, s: str) -> int:
        n = len(s)
        dp = [0] * n
        for i in range(n - 1, -1, -1):
            dp[i] = 1
            prev = 0
            for j in range(i + 1, n):
                tmp = dp[j]
                if s[i] == s[j]:
                    dp[j] = prev + 2
                else:
                    dp[j] = max(dp[j], dp[j - 1])
                prev = tmp
        return dp[n - 1]
```
