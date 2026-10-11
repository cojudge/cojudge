## Approach

Track two collections while sweeping left to right: all distinct ORs seen so far, and the ORs of blocks that finish at the current index. Each new value `x` starts a fresh singleton plus `y | x` for every previous ending value `y`. Because an OR can only turn zero bits to one, the ending set never grows beyond about thirty entries, keeping the whole pass fast.

## Complexity Analysis

- **Time Complexity:** O(n * B) where B <= 30 is the bounded ending-set size, effectively O(n).
- **Space Complexity:** O(B) for the rolling sets plus O(D) for the distinct answers.

## Implementation

```python
from typing import List
class Solution:
    def subarrayBitwiseORs(self, arr: List[int]) -> int:
        seen = set()
        cur = set()
        for x in arr:
            cur = {x} | {y | x for y in cur}
            seen |= cur
        return len(seen)
```
