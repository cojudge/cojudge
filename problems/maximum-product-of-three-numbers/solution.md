## Approach

The winner must use either the three biggest numbers or the biggest number plus the two most negative numbers (whose product is positive and large). Track those five extremes in one pass, then return the better of the two candidate products.

## Complexity Analysis

- **Time Complexity:** O(n) for the single scan.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def maximumProduct(self, nums: List[int]) -> int:
        max1 = max2 = max3 = float("-inf")
        min1 = min2 = float("inf")
        for x in nums:
            if x > max1:
                max1, max2, max3 = x, max1, max2
            elif x > max2:
                max2, max3 = x, max2
            elif x > max3:
                max3 = x
            if x < min1:
                min1, min2 = x, min1
            elif x < min2:
                min2 = x
        return max(max1 * max2 * max3, min1 * min2 * max1)
```
