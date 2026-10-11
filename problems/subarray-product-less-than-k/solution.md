## Approach

Keep a window with its product. Advance the right edge one step at a time; while the product reaches or exceeds `k`, divide out the leftmost value and shift left forward. Once the window fits, every sub-window ending at `right` and starting anywhere inside it is valid, adding `right - left + 1` to the total.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length; each index enters and leaves once.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
        if k <= 1:
            return 0
        prod = 1
        left = 0
        ans = 0
        for right, v in enumerate(nums):
            prod *= v
            while prod >= k:
                prod //= nums[left]
                left += 1
            ans += right - left + 1
        return ans
```
