## Approach

Treat every interval `[lo, hi]` as a subgame needing its cheapest worst-case price. Guessing `x` inside it pays `x` plus the pricier of the two resulting sides; pick the `x` minimizing that total. Solve intervals from short to long so both sides are ready, and read the answer at `[1, n]`.

## Complexity Analysis

- **Time Complexity:** O(n^3), one scan of candidate guesses per interval.
- **Space Complexity:** O(n^2) for the interval table.

## Implementation

```python
class Solution:
    def getMoneyAmount(self, n: int) -> int:
        if n <= 1:
            return 0
        dp = [[0] * (n + 2) for _ in range(n + 2)]
        for length in range(2, n + 1):
            for lo in range(1, n - length + 2):
                hi = lo + length - 1
                best = float("inf")
                for x in range(lo, hi + 1):
                    left = dp[lo][x - 1] if x - 1 >= lo else 0
                    right = dp[x + 1][hi] if x + 1 <= hi else 0
                    best = min(best, x + max(left, right))
                dp[lo][hi] = best
        return dp[1][n]
```
