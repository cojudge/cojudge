## Approach

Copy the input, then run the Fisher-Yates pass from the tail: swap each position with a uniformly chosen earlier-or-equal slot. Copying first keeps the caller's array intact, and the in-place swaps produce a uniform permutation.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the returned copy.

## Implementation

```python
import random
from typing import List
class Solution:
    def shuffleArray(self, nums: List[int]) -> List[int]:
        a = list(nums)
        for i in range(len(a) - 1, 0, -1):
            j = random.randint(0, i)
            a[i], a[j] = a[j], a[i]
        return a
```
