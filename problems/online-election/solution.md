## Approach

Sweep once through the votes while counting per-person totals; after each vote record the current leader, awarding ties to the latest vote. The leader only changes at vote moments, so each query reduces to finding the rightmost vote time at or before it with binary search and reading the stored leader.

## Complexity Analysis

- **Time Complexity:** O(n + q log n) for the sweep plus one binary search per query.
- **Space Complexity:** O(n) for the leader table and counts.

## Implementation

```python
from typing import List
import bisect
class Solution:
    def runElection(self, persons: List[int], times: List[int], queries: List[int]) -> List[int]:
        leaders = []
        count = {}
        best, best_count = -1, 0
        for p in persons:
            c = count.get(p, 0) + 1
            count[p] = c
            if c >= best_count:
                best_count, best = c, p
            leaders.append(best)
        ans = []
        for t in queries:
            idx = bisect.bisect_right(times, t) - 1
            ans.append(leaders[idx])
        return ans
```
