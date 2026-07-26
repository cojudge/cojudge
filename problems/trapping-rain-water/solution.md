## Approach

Use pointers at both ends while tracking the highest wall seen from each side.
The side with the lower current height has a known limiting boundary, so its
trapped water can be added before moving that pointer inward.

## Complexity Analysis

- **Time Complexity:** `O(n)`.
- **Space Complexity:** `O(1)`.

## Implementation

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = water = 0
        while left < right:
            if height[left] <= height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water
```
