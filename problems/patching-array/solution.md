## Approach

Maintain `miss`, the smallest total not yet achievable; every value below it is already covered. If the next array entry is at most `miss`, include it and stretch coverage by its value; otherwise insert `miss` itself as a patch, which doubles the covered range. Repeat until coverage passes `n`, counting the patches used.

## Complexity Analysis

- **Time Complexity:** O(m + log n), where m is the length of `nums`.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def minPatches(self, nums: List[int], n: int) -> int:
        miss = 1
        patches = 0
        i = 0
        while miss <= n:
            if i < len(nums) and nums[i] <= miss:
                miss += nums[i]
                i += 1
            else:
                miss += miss
                patches += 1
        return patches
```
