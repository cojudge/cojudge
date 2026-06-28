## Approach

Bottom-up DP where dp[i] counts the number of combinations summing to i, considering each number as the last element added. Use modulo 1e9+7 to handle large results.

## Complexity Analysis

- **Time Complexity:** O(target * len(nums))
- **Space Complexity:** O(target)

## Implementation

```python
from typing import List
class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1
        MOD = 1000000007
        for i in range(1, target + 1):
            for n in nums:
                if i >= n:
                    dp[i] = (dp[i] + dp[i - n]) % MOD
        return dp[target]
```
