## Approach

Build prefix sums so any interval average is a constant-time division. Then dynamic programming: dp[i][g] stores the best total for the first i numbers cut into g groups. A single group is just its average; for more groups, try every possible start of the final group and combine the optimal prefix with the last group's average. The entry for the full array with k groups is the answer, formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n^2 * k) for n numbers and k groups.
- **Space Complexity:** O(n * k) for the DP table.

## Implementation

```python
from typing import List
class Solution:
    def largestSumOfAverages(self, nums: List[int], k: int) -> str:
        n = len(nums)
        pref = [0.0] * (n + 1)
        for i, v in enumerate(nums):
            pref[i + 1] = pref[i] + v
        dp = [[0.0] * (k + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            dp[i][1] = pref[i] / i
        for g in range(2, k + 1):
            for i in range(g, n + 1):
                best = 0.0
                for j in range(g - 1, i):
                    cand = dp[j][g - 1] + (pref[i] - pref[j]) / (i - j)
                    if cand > best:
                        best = cand
                dp[i][g] = best
        return str(dp[n][k])
```
