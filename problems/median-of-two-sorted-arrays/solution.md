## Approach

Binary-search a partition in the shorter array and infer the partition in the longer array so the left side contains half of all values. A partition is valid when both left boundary values are no greater than the opposite right boundary values. Use the middle boundary value or pair of values to produce the required canonical `.0` or `.5` string without floating-point arithmetic.

## Complexity Analysis

- **Time Complexity:** O(log(min(m, n))), where `m` and `n` are the input lengths.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> str:
        if len(nums1) > len(nums2):
            return self.findMedianSortedArrays(nums2, nums1)

        total = len(nums1) + len(nums2)
        left_size = (total + 1) // 2
        low, high = 0, len(nums1)

        while low <= high:
            partition1 = low + (high - low) // 2
            partition2 = left_size - partition1
            left1 = -(2**63) if partition1 == 0 else nums1[partition1 - 1]
            right1 = 2**63 - 1 if partition1 == len(nums1) else nums1[partition1]
            left2 = -(2**63) if partition2 == 0 else nums2[partition2 - 1]
            right2 = 2**63 - 1 if partition2 == len(nums2) else nums2[partition2]

            if left1 <= right2 and left2 <= right1:
                lower = max(left1, left2)
                if total % 2 == 1:
                    return f"{lower}.0"
                total_middle = lower + min(right1, right2)
                if total_middle % 2 == 0:
                    return f"{total_middle // 2}.0"
                sign = "-" if total_middle < 0 else ""
                return f"{sign}{abs(total_middle) // 2}.5"

            if left1 > right2:
                high = partition1 - 1
            else:
                low = partition1 + 1

        raise ValueError("Input arrays must be sorted")
```
