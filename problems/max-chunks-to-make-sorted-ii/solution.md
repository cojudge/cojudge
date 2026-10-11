## Approach

Walk the array while keeping a stack of chunk maxima. Each value begins a new chunk, but whenever the prior maximum is larger than the newcomer the two chunks must fuse (otherwise sorting separately would misplace values), carrying forward the larger maximum. Fusing repeatedly until the stack top fits preserves the finest valid partition.

## Complexity Analysis

- **Time Complexity:** O(n) since each element is pushed and popped at most once.
- **Space Complexity:** O(n) for the stack in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def maxChunksToSorted(self, arr: List[int]) -> int:
        st = []
        for x in arr:
            cur = x
            while st and st[-1] > x:
                cur = max(cur, st.pop())
            st.append(cur)
        return len(st)
```
