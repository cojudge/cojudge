## Approach

Two-pointer technique starting from the ends, always moving the shorter line inward since that is the limiting factor for the area.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0
        while l < r:
            area = min(height[l], height[r]) * (r - l)
            res = max(res, area)
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return res
```
