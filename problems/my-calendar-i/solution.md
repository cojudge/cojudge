## Approach

Store the accepted half-open slots in a structure ordered by start time. For a new request `[s, e)`, only the stored slot starting just before (or at) `s` and the one starting just after `s` can possibly overlap it, because everything else is farther away. The request clashes exactly when the previous slot ends after `s` or the next slot starts before `e`. Otherwise record it and report success.

## Complexity Analysis

- **Time Complexity:** O(b log b) for b bookings, one ordered-map step each.
- **Space Complexity:** O(b) for the stored slots.

## Implementation

```python
from typing import List
class Solution:
    def runCalendar(self, operations: List[str], args: List[List[int]]) -> List[int]:
        booked = []
        out = []
        for i in range(1, len(operations)):
            s, e = args[i]
            clash = any(max(s, a) < min(e, b) for a, b in booked)
            if clash:
                out.append(0)
            else:
                booked.append((s, e))
                out.append(1)
        return out
```
