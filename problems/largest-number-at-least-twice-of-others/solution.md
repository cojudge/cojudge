## Approach

Find the maximum value and its index in a first scan. Then scan again and verify the maximum reaches at least twice each other entry. Return the stored index when all checks pass, otherwise return -1.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length. Two linear passes suffice.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def dominantIndex(self, nums: List[int]) -> int:
        mx = max(nums)
        idx = nums.index(mx)
        for i, x in enumerate(nums):
            if i != idx and mx < 2 * x:
                return -1
        return idx
```
