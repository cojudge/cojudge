## Approach

Precompute how many zeroes and ones each binary string needs. Then run a two-dimensional 0/1 knapsack over the budgets `m` and `n`: the table entry for `(i, j)` keeps the best count achievable with at most `i` zeroes and `j` ones. Process every string once, scanning the table backwards so each string is used at most once, and keep the better of skipping or taking it.

## Complexity Analysis

- **Time Complexity:** O(S * m * n) where S is the number of strings.
- **Space Complexity:** O(m * n) for the DP table.

## Implementation

```python
from typing import List

class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for s in strs:
            zeros = s.count("0")
            ones = len(s) - zeros
            for i in range(m, zeros - 1, -1):
                for j in range(n, ones - 1, -1):
                    if dp[i - zeros][j - ones] + 1 > dp[i][j]:
                        dp[i][j] = dp[i - zeros][j - ones] + 1
        return dp[m][n]
```
