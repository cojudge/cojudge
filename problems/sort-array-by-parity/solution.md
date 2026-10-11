## Approach

Sweep the input twice: first copy every even value to the answer, then append every odd value. This keeps all evens ahead of all odds while preserving the multiset. A two-pointer in-place swap achieves the same with constant extra room.

## Complexity Analysis

- **Time Complexity:** O(n) for the two linear passes.
- **Space Complexity:** O(n) for the fresh output (O(1) extra with the two-pointer variant).

## Implementation

```python
from typing import List
class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        return [x for x in nums if x % 2 == 0] + [x for x in nums if x % 2 == 1]
```
