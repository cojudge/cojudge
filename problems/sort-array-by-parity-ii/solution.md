## Approach

Since the input is guaranteed to hold equally many evens and odds, deal each value into its own kind of slot: evens go to indices 0, 2, 4, ... and odds to 1, 3, 5, .... Every slot receives a matching value, so one linear pass builds a valid rearrangement.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for the answer (O(1) extra with an in-place two-pointer swap variant).

## Implementation

```python
from typing import List
class Solution:
    def sortArrayByParityII(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [0] * n
        e, o = 0, 1
        for v in nums:
            if v % 2 == 0:
                ans[e] = v
                e += 2
            else:
                ans[o] = v
                o += 2
        return ans
```
