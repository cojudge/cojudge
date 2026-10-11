## Approach

Count distinct palindromic subsequences per interval with dynamic programming. For a slice, equal ends extend every inner palindrome on both sides, contributing the two single letters plus the wrapped forms; the nearest matching letters inside decide how much was already counted and must be removed. Unequal ends merge the two one-shorter slices minus their overlap. All steps use modulo 1,000,000,007.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the string length — one state per interval.
- **Space Complexity:** O(n^2) for the table.

## Implementation

```python
class Solution:
    def countPalindromicSubsequences(self, s: str) -> int:
        MOD = 1000000007
        n = len(s)
        dp = [[0] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = 1
        for length in range(2, n + 1):
            for l in range(n - length + 1):
                r = l + length - 1
                if s[l] == s[r]:
                    low, high = l + 1, r - 1
                    while low <= high and s[low] != s[l]:
                        low += 1
                    while low <= high and s[high] != s[l]:
                        high -= 1
                    if low > high:
                        dp[l][r] = dp[l + 1][r - 1] * 2 + 2
                    elif low == high:
                        dp[l][r] = dp[l + 1][r - 1] * 2 + 1
                    else:
                        dp[l][r] = dp[l + 1][r - 1] * 2 - dp[low + 1][high - 1]
                else:
                    dp[l][r] = dp[l + 1][r] + dp[l][r - 1] - dp[l + 1][r - 1]
                dp[l][r] %= MOD
        return dp[0][n - 1] % MOD
```
