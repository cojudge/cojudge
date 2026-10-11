## Approach

Equalizing the totals means Alice's given box must exceed Bob's returned box by half the difference of the two sums. With that target gap known, load Bob's sizes into a set and scan Alice's boxes for one whose ideal partner exists. The first match forms a fair swap.

## Complexity Analysis

- **Time Complexity:** O(a + b), where a and b are the numbers of boxes each person holds.
- **Space Complexity:** O(b) for Bob's size set.

## Implementation

```python
from typing import List

class Solution:
    def fairCandySwap(self, aliceSizes: List[int], bobSizes: List[int]) -> List[int]:
        diff = (sum(aliceSizes) - sum(bobSizes)) // 2
        bob = set(bobSizes)
        for a in aliceSizes:
            if a - diff in bob:
                return [a, a - diff]
        return []
```
