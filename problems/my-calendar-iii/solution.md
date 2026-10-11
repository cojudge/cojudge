## Approach

Keep an ordered timeline of changes: add one at every start and subtract one at every end. Because slots are half-open, processing these changes in time order with a running count reproduces the true overlap at every point. The highest running count after each booking is the requested peak.

## Complexity Analysis

- **Time Complexity:** O(b^2) for b bookings in the simple sweep version (each query scans all distinct endpoints).
- **Space Complexity:** O(b) for the timeline entries.

## Implementation

```python
from typing import List
class Solution:
    def runCalendarThree(self, operations: List[str], args: List[List[int]]) -> List[int]:
        from collections import defaultdict
        delta = defaultdict(int)
        out = []
        for i in range(1, len(operations)):
            s, e = args[i]
            delta[s] += 1
            delta[e] -= 1
            cur = best = 0
            for t in sorted(delta):
                cur += delta[t]
                best = max(best, cur)
            out.append(best)
        return out
```
