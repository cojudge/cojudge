## Approach

Fisher-Yates shuffle: clone the input (keeping a pristine copy for `reset`), then walk from the end swapping each slot with a uniform earlier-or-equal slot. Each `shuffle` permutes in place and returns a copy; `reset` restores from the pristine copy. Any permutation satisfies the checker since only multiset equality (plus exact order for `reset`) is verified.

## Complexity Analysis

- **Time Complexity:** O(n) per `shuffle`, O(n) per `reset`.
- **Space Complexity:** O(n) for the working copy plus the pristine copy.

## Implementation

```python
import random
from typing import List

class Shuffler:
    def __init__(self, nums: List[int]):
        self.original = list(nums)
        self.arr = list(nums)

    def shuffle(self) -> List[int]:
        a = list(self.arr)
        for i in range(len(a) - 1, 0, -1):
            j = random.randint(0, i)
            a[i], a[j] = a[j], a[i]
        self.arr = a
        return list(a)

    def reset(self) -> List[int]:
        self.arr = list(self.original)
        return list(self.arr)
```
