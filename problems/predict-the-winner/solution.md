## Approach

Let the table hold the largest net advantage the player about to move can secure on each subarray. Single cells are worth their own value; wider intervals take the better of grabbing the left end or the right end and then subtracting the opponent's optimal reply on the remainder. A non-negative advantage on the full array means the opener ties or wins.

## Complexity Analysis

- **Time Complexity:** O(n^2) for all intervals, with n <= 20.
- **Space Complexity:** O(n^2) for the table.

## Implementation

```python
from typing import List

class Solution:
    def predictTheWinner(self, nums: List[int]) -> bool:
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = nums[i]
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                dp[i][j] = max(nums[i] - dp[i + 1][j], nums[j] - dp[i][j - 1])
        return dp[0][n - 1] >= 0
```
