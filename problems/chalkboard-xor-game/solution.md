## Approach

Compute the xor of the whole board. A zero value is an immediate win for the player to move. Otherwise the key insight is parity: with an even number of entries the first player can always answer the opponent's move and force the win, while with an odd number the second player mirrors instead. So the answer is true when the xor is zero or the length is even.

## Complexity Analysis

- **Time Complexity:** O(n) to xor the array once.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def xorGame(self, nums: List[int]) -> bool:
        x = 0
        for v in nums:
            x ^= v
        return x == 0 or len(nums) % 2 == 0
```
