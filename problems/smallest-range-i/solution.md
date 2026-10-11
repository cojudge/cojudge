## Approach

Only the extreme values influence the spread, since every shifted element stays between the shifted minimum and the shifted maximum. Raising the minimum by the full `k` and lowering the maximum by the full `k` squeezes the interval as much as possible, and the bounds can cross, in which case every element can be made equal.

## Complexity Analysis

- **Time Complexity:** O(n) to scan for the minimum and maximum.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
from typing import List
class Solution:
    def smallestRangeI(self, nums: List[int], k: int) -> int:
        return max(0, max(nums) - min(nums) - 2 * k)
```
