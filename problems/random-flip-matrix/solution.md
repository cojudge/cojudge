## Approach

Simulate sampling without replacement over the `m * n` virtual cell indices. Keep a remap table from drawn positions to still-unused ones (the Fisher-Yates idea): each draw picks a random index from the shrinking pool, records the remapped cell, and moves the pool's last element into the drawn slot. Converting drawn indices via `row = k / n`, `col = k % n` gives distinct valid coordinates, and any such batch satisfies the checker.

## Complexity Analysis

- **Time Complexity:** O(count) draws with O(1) work each.
- **Space Complexity:** O(count) for the remap table and the answer.

## Implementation

```python
import random
from typing import List

class Solution:
    def runFlip(self, m: int, n: int, count: int) -> List[List[int]]:
        total = m * n
        k = min(count, total)
        remap = {}
        ans = []
        last = total - 1
        for i in range(k):
            j = random.randint(i, last)
            vi = remap.get(i, i)
            vj = remap.get(j, j)
            remap[i], remap[j] = vj, vi
            ans.append([vj // n, vj % n])
        return ans
```
