## Approach

Use two pointers with a write index `k` starting at 0. Scan each element; whenever `nums[i] != val`, copy it to `nums[k]` and increment `k`. At the end `k` is the count of kept elements and the first `k` positions hold them in order. This overwrites removed elements in place in a single pass.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each element is visited once.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0
        for x in nums:
            if x != val:
                nums[k] = x
                k += 1
        return k
```
