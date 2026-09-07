## Approach

Use interval dynamic programming (minimax). Let `dp[i][j]` be the maximum score difference the current player can achieve over the subarray `piles[i..j]` (their total minus the opponent's total at the end of that subgame). A player can take the left pile or the right pile, and the opponent then plays the remaining subarray optimally, so:

```
dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])
```

with base case `dp[i][i] = piles[i]`. Alice wins if and only if `dp[0][n-1] > 0`. Note that under the given constraints Alice always wins (even number of piles, odd total), but the DP computes the correct answer for any input.

## Complexity Analysis

- **Time Complexity:** O(n^2), one state per interval.
- **Space Complexity:** O(n^2) for the dp table.

## Implementation

```python
from typing import List
class Solution:
    def stoneGame(self, piles: List[int]) -> bool:
        n = len(piles)
        dp = [[0] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if i == j:
                    dp[i][j] = piles[i]
                else:
                    dp[i][j] = max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1])
        return dp[0][n - 1] > 0
```