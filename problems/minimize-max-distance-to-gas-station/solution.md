## Approach

For a candidate cap D, each gap of length g can be tamed with ceil(g / D) - 1 added stops, so summing that need over all gaps tests whether k stops suffice. Feasibility shrinks monotonically as D grows, which makes the minimal feasible D searchable by binary search from 0 to 1e8. About eighty halvings settle far beyond the required precision, and the result is returned as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n * log precision) with n gaps and ~80 feasibility scans.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
import math
class Solution:
    def minmaxGasDist(self, stations: List[int], k: int) -> str:
        def feasible(d: float) -> bool:
            need = 0
            for i in range(1, len(stations)):
                gap = stations[i] - stations[i - 1]
                need += int((gap - 1e-9) / d)
                if need > k:
                    return False
            return need <= k
        lo, hi = 0.0, 1e8
        for _ in range(80):
            mid = (lo + hi) / 2
            if feasible(mid):
                hi = mid
            else:
                lo = mid
        return str(hi)
```
