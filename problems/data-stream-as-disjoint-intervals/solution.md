## Approach

Keep disjoint intervals ordered by start in a balanced map from start to end.
For each arriving value, skip it when it is already covered. Otherwise merge
with the interval directly below when it touches, then absorb every interval
above that touches the growing block. Each value is inserted and removed at
most once.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the number of arrivals.
- **Space Complexity:** O(n) for the interval map.

## Implementation

```python
import bisect
from typing import List

class Solution:
    def runSummaryRanges(self, values: List[int]) -> List[List[int]]:
        starts: List[int] = []
        table = {}
        for v in values:
            if v in table:
                continue
            i = bisect.bisect_right(starts, v) - 1
            if i >= 0 and table[starts[i]] >= v:
                continue
            ns, ne = v, v
            if i >= 0 and table[starts[i]] + 1 == v:
                ns = starts[i]
                ne = max(ne, table[starts[i]])
                del table[starts[i]]
                starts.pop(i)
            j = bisect.bisect_left(starts, ns)
            while j < len(starts) and starts[j] <= ne + 1:
                ne = max(ne, table[starts[j]])
                del table[starts[j]]
                starts.pop(j)
            starts.insert(bisect.bisect_left(starts, ns), ns)
            table[ns] = ne
        return [[s, table[s]] for s in starts]
```
