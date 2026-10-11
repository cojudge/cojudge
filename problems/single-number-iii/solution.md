## Approach

Xor-ing everything cancels the duplicated values and leaves the xor of the two single answers. Isolate any set bit of that xor, which must differ between the answers, then xor each group separately: numbers sharing the bit give one answer and the rest give the other.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(1) besides the two-value output.

## Implementation

```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        xor = 0
        for v in nums:
            xor ^= v
        bit = xor & -xor
        a = b = 0
        for v in nums:
            if v & bit:
                a ^= v
            else:
                b ^= v
        return [a, b]
```
