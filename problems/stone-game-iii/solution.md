## Approach

This is a minimax game. Let `dp[i]` be the maximum score difference the player whose turn it is at position `i` can achieve (their final score minus the opponent's final score). Instead of simulating both players, note that if the current player takes the next `k` stones, they gain their sum and the opponent starts at `i + k` with advantage `dp[i + k]`, so the player's advantage is `suffix[i] - dp[i + k]`. Iterate from right to left over the suffix sums, take `k in {1, 2, 3}`, and keep the best.

At the end, `dp[0] > 0` means Alice wins, `dp[0] < 0` means Bob wins, and `dp[0] == 0` is a tie.

## Complexity Analysis

- **Time Complexity:** O(n), as each position considers at most 3 next moves.
- **Space Complexity:** O(n) for the `dp` and suffix arrays (can be reduced to O(1) with a sliding window since only the last 3 values are needed).

## Implementation

```python
from typing import List
class Solution:
    def stoneGameIII(self, stoneValue: List[int]) -> str:
        n = len(stoneValue)
        dp = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            best = float('-inf')
            take = 0
            for k in range(3):
                if i + k >= n:
                    break
                take += stoneValue[i + k]
                best = max(best, take - dp[i + k + 1])
            dp[i] = best

        if dp[0] > 0:
            return "Alice"
        if dp[0] < 0:
            return "Bob"
        return "Tie"
```