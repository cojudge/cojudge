## Approach

Compact non-zero values forward with a write pointer, then fill the remaining tail with zeros. This keeps non-zero order and uses one pass.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) extra besides the returned copy.

## Implementation

```python
from typing import List
class Solution:
    def moveZeroes(self, nums: List[int]) -> List[int]:
        a = list(nums)
        w = 0
        for x in a:
            if x != 0:
                a[w] = x
                w += 1
        while w < len(a):
            a[w] = 0
            w += 1
        return a
```
