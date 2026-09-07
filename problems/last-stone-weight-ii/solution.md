## Approach

The smash game is equivalent to assigning each stone a `+` or `-` sign: smashing two stones keeps the difference of their signs, and the final remaining stone is `|signed sum|`. So the answer is the smallest possible non-negative value of `total - 2 * S`, where `S` is a subset sum. This is a classic 0/1 knapsack: use boolean DP to find all achievable subset sums, then pick the largest `S <= total / 2`. The answer is `total - 2 * S`.

## Complexity Analysis

- **Time Complexity:** O(n * total), where `total` is the sum of all stones (at most 3000).
- **Space Complexity:** O(total) for the dp array.

## Implementation

```python
from typing import List
class Solution:
    def lastStoneWeightII(self, stones: List[int]) -> int:
        total = sum(stones)
        dp = [False] * (total + 1)
        dp[0] = True
        for s in stones:
            for sm in range(total, s - 1, -1):
                dp[sm] = dp[sm] or dp[sm - s]
        for sm in range(total // 2, -1, -1):
            if dp[sm]:
                return total - 2 * sm
        return total
```