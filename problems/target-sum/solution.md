## Approach

Split the numbers into a positive subset with sum `P` and a negative subset with sum
`N`. Since `P + N` is the array sum and `P - N` is the target, `P` must equal
`(sum(nums) + target) / 2`. Count subsets with that sum using backward one-dimensional
dynamic programming. Zero values naturally double every existing count.

## Complexity Analysis

- **Time Complexity:** O(n * S), where `S` is `sum(nums)`.
- **Space Complexity:** O(S).

## Implementation

```python
from typing import List


class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        total = sum(nums)
        if target < -total or target > total or (total + target) % 2:
            return 0

        subset = (total + target) // 2
        ways = [0] * (subset + 1)
        ways[0] = 1
        for num in nums:
            for value in range(subset, num - 1, -1):
                ways[value] += ways[value - num]
        return ways[subset]
```
