## Approach

Step through the array with an index. A `1` jumps two places because it must pair with its follower; a `0` advances one place. Stop before the last cell: landing exactly on it means it was read alone.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def isOneBitCharacter(self, bits: List[int]) -> bool:
        i = 0
        n = len(bits)
        while i < n - 1:
            i += 2 if bits[i] == 1 else 1
        return i == n - 1
```
