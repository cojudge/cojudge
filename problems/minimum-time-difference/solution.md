## Approach

Convert each clock reading to minutes since midnight and sort the values. After sorting, the closest pair on a circle must either be neighbours in the sorted order or the wrap-around pair (last and first across midnight), so scan those gaps and keep the minimum.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting n readings.
- **Space Complexity:** O(n) for the minute values (O(1) extra besides the copy).

## Implementation

```python
from typing import List
class Solution:
    def findMinDifference(self, timePoints: List[str]) -> int:
        mins = sorted(int(t[:2]) * 60 + int(t[3:]) for t in timePoints)
        best = 1440 - mins[-1] + mins[0]
        for i in range(1, len(mins)):
            best = min(best, mins[i] - mins[i - 1])
        return best
```
