## Approach

Pair each difficulty with its profit and sort the pairs by difficulty, then sweep once to remember the highest pay reachable at or before every position. Each worker independently takes the prefix-best pay of the hardest qualifying job, found with binary search, and the individual earnings are summed.

## Complexity Analysis

- **Time Complexity:** O((n + m) log n) for sorting n jobs and binary-searching per each of the m workers.
- **Space Complexity:** O(n) for the sorted job pairs and prefix maxima.

## Implementation

```python
from typing import List
import bisect

class Solution:
    def maxProfitAssignment(self, difficulty: List[int], profit: List[int], worker: List[int]) -> int:
        jobs = sorted(zip(difficulty, profit))
        diffs = []
        best = []
        mx = 0
        for d, p in jobs:
            mx = max(mx, p)
            diffs.append(d)
            best.append(mx)
        ans = 0
        for w in worker:
            i = bisect.bisect_right(diffs, w) - 1
            if i >= 0:
                ans += best[i]
        return ans
```
