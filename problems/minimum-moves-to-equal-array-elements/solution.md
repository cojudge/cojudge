## Approach

Incrementing `n-1` entries is equivalent to decrementing the single skipped entry. Hence each value must fall to the current minimum, needing `nums[i]-min` steps. Adding over all positions gives `sum - min*n`.

## Complexity Analysis

- **Time Complexity:** O(n), one pass for the minimum and sum.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def minMoves(self, nums: List[int]) -> int:
        m = min(nums)
        return sum(nums) - m * len(nums)
```
