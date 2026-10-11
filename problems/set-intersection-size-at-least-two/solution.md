## Approach

Sort intervals by increasing right end, preferring larger left ends on ties so narrow intervals come first. Walk through them while remembering only the two largest points chosen so far. If both already lie inside the current interval, do nothing; if exactly one does, add the right end; if none does, add the two rightmost positions. Rightmost placement leaves maximal room for later intervals, giving optimality.

## Complexity Analysis

- **Time Complexity:** O(m log m), where m is the number of intervals, dominated by sorting.
- **Space Complexity:** O(1) besides sorting and the input.

## Implementation

```python
from typing import List
class Solution:
    def intersectionSizeTwo(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: (x[1], -x[0]))
        ans = 0
        p1, p2 = -1, -1
        for s, e in intervals:
            if s <= p1:
                continue
            if s <= p2:
                ans += 1
                p1, p2 = p2, e
            else:
                ans += 2
                p1, p2 = e - 1, e
        return ans
```
