## Approach

Emit the binary-reflected code directly with the formula `i ^ (i >> 1)` for every `i` from `0` to `2^n - 1`. Flipping the lowest set bit of the increment guarantees neighbors differ in exactly one position while covering all values once.

## Complexity Analysis

- **Time Complexity:** O(2^n), one constant-time step per entry.
- **Space Complexity:** O(2^n) for the output list.

## Implementation

```python
from typing import List
class Solution:
    def grayCode(self, n: int) -> List[int]:
        return [i ^ (i >> 1) for i in range(1 << n)]
```
