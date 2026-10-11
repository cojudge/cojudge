## Approach

Scan `nums2` once while maintaining a strictly decreasing stack. When a new value exceeds the stack top, it is the next greater element for all popped smaller values. Remaining stack entries have no greater successor and map to `-1`. Each query from `nums1` is then answered by table lookup in order.

## Complexity Analysis

- **Time Complexity:** O(m + n) where m and n are the lengths of nums2 and nums1.
- **Space Complexity:** O(m) for the stack and map.

## Implementation

```python
from typing import List

class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nxt = {}
        st: List[int] = []
        for x in nums2:
            while st and x > st[-1]:
                nxt[st.pop()] = x
            st.append(x)
        for x in st:
            nxt[x] = -1
        return [nxt[v] for v in nums1]
```
