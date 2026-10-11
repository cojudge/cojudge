## Approach

Remember the last occupied chair while scanning. A leading empty run scores its full length, each interior run between two people scores half its span rounded up (integer division of the gap), and the trailing run scores its full length. The maximum over these runs is the answer.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the seat count, in a single pass.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def maxDistToClosest(self, seats: List[int]) -> int:
        best, prev, n = 0, -1, len(seats)
        for i, v in enumerate(seats):
            if v == 1:
                if prev < 0:
                    best = i
                else:
                    best = max(best, (i - prev) // 2)
                prev = i
        best = max(best, n - 1 - prev)
        return best
```
