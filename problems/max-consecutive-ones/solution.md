## Approach

Sweep the array once while keeping the length of the ongoing run of ones. A `1` extends the run, a `0` resets it, and the best value seen so far is retained throughout.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        best = cur = 0
        for v in nums:
            if v == 1:
                cur += 1
                best = max(best, cur)
            else:
                cur = 0
        return best
```
