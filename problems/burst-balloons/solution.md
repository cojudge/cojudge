## Approach

Pad the balloon values with `1` at both ends. Let `dp[left][right]` be the maximum coins obtainable by bursting every balloon in that closed interval. Instead of choosing the first balloon, try each position as the last balloon burst; its neighbors are then the fixed values immediately outside the interval. Build the table from shorter intervals to longer ones.

## Complexity Analysis

- **Time Complexity:** O(n^3), because every interval tries every possible final balloon.
- **Space Complexity:** O(n^2) for the dynamic programming table.

## Implementation

```python
from typing import List


class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        n = len(nums)
        values = [1, *nums, 1]
        dp = [[0] * (n + 2) for _ in range(n + 2)]

        for length in range(1, n + 1):
            for left in range(1, n - length + 2):
                right = left + length - 1
                boundary_product = values[left - 1] * values[right + 1]
                best = 0
                for last in range(left, right + 1):
                    coins = (
                        dp[left][last - 1]
                        + dp[last + 1][right]
                        + boundary_product * values[last]
                    )
                    if coins > best:
                        best = coins
                dp[left][right] = best
        return dp[1][n]
```
