## Approach

Add the weights into prefix sums once, so each index owns the half-open interval below its prefix value. Every draw value is wrapped into `[0, total)` with a non-negative modulo, then the first prefix strictly above that position is located with binary search — its index is the pick. Preprocessing costs linear time and each draw costs logarithmic time.

## Complexity Analysis

- **Time Complexity:** O(n + m log n), where n is the number of weights and m the number of draws.
- **Space Complexity:** O(n) for the prefix sums (plus O(m) for the answers).

## Implementation

```python
from typing import List
class Solution:
    def runWeightedPick(self, weights: List[int], calls: List[int]) -> List[int]:
        pref = []
        total = 0
        for w in weights:
            total += w
            pref.append(total)
        import bisect
        ans = []
        for c in calls:
            t = c % total
            ans.append(bisect.bisect_right(pref, t))
        return ans
```
