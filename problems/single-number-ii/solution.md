## Approach

Track bits seen once and twice with two masks. For each number, the update folds it into the `ones` mask unless it is already in `twos`, and into `twos` unless it is in the new `ones`. Bits appearing three times vanish from both masks, leaving only the lone element in `ones`.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length. Each element needs constant bit operations.
- **Space Complexity:** O(1), using two integer masks.

## Implementation

```python
from typing import List
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ones = twos = 0
        for x in nums:
            ones = (ones ^ x) & ~twos
            twos = (twos ^ x) & ~ones
        return ones
```
