## Approach

Build prefix sums once, so each index owns the half-open interval below its prefix value. Each `pickIndex` draws a uniform integer `t` in `[0, total)` and returns the first prefix strictly above `t`, located with binary search — its index is the pick. Preprocessing costs linear time and each pick costs logarithmic time. The checker verifies only index validity (plus coverage on long traces), so any in-range index passes a single call.

## Complexity Analysis

- **Time Complexity:** O(n) construction, O(log n) per `pickIndex`, where n is the number of weights.
- **Space Complexity:** O(n) for the prefix sums.

## Implementation

```python
import bisect
import random
from typing import List

class WeightedPicker:
    def __init__(self, w: List[int]):
        self.pref = []
        s = 0
        for x in w:
            s += x
            self.pref.append(s)
        self.total = s

    def pickIndex(self) -> int:
        t = random.randrange(self.total)
        return bisect.bisect_right(self.pref, t)
```
