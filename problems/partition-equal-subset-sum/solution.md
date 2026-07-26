## Approach

An equal partition is possible only when the total sum is even. Reduce the problem to
finding a subset whose sum is half of the total. A one-dimensional boolean array tracks
reachable sums, and iterating it backward ensures each input value is used at most once.

## Complexity Analysis

- **Time Complexity:** O(n * S), where `S` is half of the total sum.
- **Space Complexity:** O(S).

## Implementation

```python
from typing import List


class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False

        target = total // 2
        reachable = [False] * (target + 1)
        reachable[0] = True
        for num in nums:
            for value in range(target, num - 1, -1):
                reachable[value] = reachable[value] or reachable[value - num]
            if reachable[target]:
                return True
        return False
```
