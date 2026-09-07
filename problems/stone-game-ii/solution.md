## Approach

Use dynamic programming over states `(i, m)` where `dp[i][m]` is the maximum number of stones the current player can collect from `piles[i:]` given the current `M = m`. If `2 * m >= n - i`, the current player can take every remaining pile, so `dp[i][m] = suffix[i]`. Otherwise, for every `X` from 1 to `2 * m`, the player takes the next `X` piles (`suffix[i] - suffix[i + X]`) and hands the game to the opponent at `i + X` with `M = max(m, X)`. The player's gain is `suffix[i] - dp[i + X][max(m, X)]`, and we keep the maximum over all `X`.

The answer is `dp[0][1]`.

## Complexity Analysis

- **Time Complexity:** O(n^2) states times O(n) moves each, i.e. O(n^3) (n <= 100, so this is fine).
- **Space Complexity:** O(n^2) for the dp table.

## Implementation

```python
from typing import List
class Solution:
    def stoneGameII(self, piles: List[int]) -> int:
        n = len(piles)
        suffix = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            suffix[i] = suffix[i + 1] + piles[i]

        dp = [[0] * (n + 1) for _ in range(n + 1)]
        for i in range(n - 1, -1, -1):
            for m in range(1, n + 1):
                if 2 * m >= n - i:
                    dp[i][m] = suffix[i]
                else:
                    best = 0
                    for x in range(1, 2 * m + 1):
                        best = max(best, suffix[i] - dp[i + x][max(m, x)])
                    dp[i][m] = best
        return dp[0][1]
```