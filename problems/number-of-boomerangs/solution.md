## Approach

Treat every point in turn as the middle. Measure squared distances to all other points and tally how many share each distance. A distance group of size `c` yields `c*(c-1)` ordered outer pairs, since either member can come first. Summing over all middles gives the total.

## Complexity Analysis

- **Time Complexity:** O(n^2), one distance per ordered pair of distinct points.
- **Space Complexity:** O(n) for the distance tally of the current middle.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def numberOfBoomerangs(self, points: List[List[int]]) -> int:
        ans = 0
        n = len(points)
        for i in range(n):
            freq = defaultdict(int)
            xi, yi = points[i]
            for j in range(n):
                if i == j:
                    continue
                dx = xi - points[j][0]
                dy = yi - points[j][1]
                freq[dx * dx + dy * dy] += 1
            for c in freq.values():
                ans += c * (c - 1)
        return ans
```
