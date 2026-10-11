## Approach

A new leg can only collide with the few legs drawn just before it, because older legs lie too far away in the expanding spiral. Scanning once and testing three local shapes suffices: a direct crossing four legs back, a touching overlap five legs back when two parallel legs match, and a slanted overlap six legs back where the spiral tightens. If none of these patterns fires, the walk never meets itself.

## Complexity Analysis

- **Time Complexity:** O(n), one constant-time check per leg.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
from typing import List
class Solution:
    def isSelfCrossing(self, distance: List[int]) -> bool:
        d = distance
        n = len(d)
        for i in range(3, n):
            if d[i] >= d[i - 2] and d[i - 1] <= d[i - 3]:
                return True
            if i >= 4 and d[i - 1] == d[i - 3] and d[i] + d[i - 4] >= d[i - 2]:
                return True
            if (i >= 5 and d[i - 2] >= d[i - 4]
                    and d[i] + d[i - 4] >= d[i - 2]
                    and d[i - 1] + d[i - 5] >= d[i - 3]
                    and d[i - 1] <= d[i - 3]
                    and d[i - 3] <= d[i - 1] + d[i - 5]
                    and d[i - 2] <= d[i] + d[i - 4]):
                return True
        return False
```
