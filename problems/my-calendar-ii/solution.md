## Approach

Track two lists: confirmed bookings and the pairwise overlaps between them (the double-booked zones). A fresh request is refused when it touches any double-booked zone, because that would stack three bookings. Otherwise compute its overlap with every confirmed booking, append those slices to the double-booked list, and store the booking itself.

## Complexity Analysis

- **Time Complexity:** O(b^2) for b bookings, comparing each request against stored lists.
- **Space Complexity:** O(b^2) worst case for overlap slices, O(b) typically.

## Implementation

```python
from typing import List
class Solution:
    def runCalendarTwo(self, operations: List[str], args: List[List[int]]) -> List[int]:
        booked, overlaps, out = [], [], []
        for i in range(1, len(operations)):
            s, e = args[i]
            if any(max(s, a) < min(e, b) for a, b in overlaps):
                out.append(0)
                continue
            for a, b in booked:
                ns, ne = max(s, a), min(e, b)
                if ns < ne:
                    overlaps.append((ns, ne))
            booked.append((s, e))
            out.append(1)
        return out
```
