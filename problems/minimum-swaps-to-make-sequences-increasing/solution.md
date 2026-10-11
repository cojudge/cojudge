## Approach

Maintain two running costs: the cheapest swaps so far with the current index left as-is, and with it swapped. For each new position, extend the prior states only when the increasing condition holds naturally (both arrays keep order) or crosswise (each current value exceeds the opposite previous value). The smaller of the two final states is optimal.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass with constant work per index.
- **Space Complexity:** O(1), only two integers are carried forward.

## Implementation

```python
from typing import List
class Solution:
    def minSwap(self, nums1: List[int], nums2: List[int]) -> int:
        INF = 10 ** 9
        no_swap, swap = 0, 1
        for i in range(1, len(nums1)):
            new_no, new_swap = INF, INF
            if nums1[i] > nums1[i - 1] and nums2[i] > nums2[i - 1]:
                new_no = min(new_no, no_swap)
                new_swap = min(new_swap, swap + 1)
            if nums1[i] > nums2[i - 1] and nums2[i] > nums1[i - 1]:
                new_no = min(new_no, swap)
                new_swap = min(new_swap, no_swap + 1)
            no_swap, swap = new_no, new_swap
        return min(no_swap, swap)
```
