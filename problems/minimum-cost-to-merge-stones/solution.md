## Approach

Each move removes exactly `k - 1` piles, so collapsing `n` piles into one is
possible only when `(n - 1)` is divisible by `(k - 1)`; otherwise the answer
is `-1`. For feasible inputs, fill an interval DP table: `dp[i][j]` is the
cheapest cost to shrink piles `i..j` as far as the rules allow. Split the
interval at every position reachable in steps of `k - 1` and keep the cheapest
pair of halves. When the interval length itself allows a full collapse, add
the interval's stone sum (read from a prefix array) for the final merging
move.

## Complexity Analysis

- **Time Complexity:** O(n^3 / (k - 1)), with n at most 30. Each of the O(n^2) intervals tries O(n / (k-1)) splits.
- **Space Complexity:** O(n^2) for the DP table plus O(n) for prefix sums.

## Implementation

```python
from typing import List
class Solution:
    def mergeStones(self, stones: List[int], k: int) -> int:
        n = len(stones)
        if (n - 1) % (k - 1) != 0:
            return -1
        prefix = [0] * (n + 1)
        for i, s in enumerate(stones):
            prefix[i + 1] = prefix[i] + s
        dp = [[0] * n for _ in range(n)]
        for length in range(k, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                best = float('inf')
                m = i
                while m < j:
                    best = min(best, dp[i][m] + dp[m + 1][j])
                    m += k - 1
                if (length - 1) % (k - 1) == 0:
                    best += prefix[j + 1] - prefix[i]
                dp[i][j] = best
        return dp[0][n - 1]
```
