## Approach

Order interval indices by their start coordinate once. For each interval's end, binary-search that sorted start list for the leftmost start reaching at least the end, then map back to the original index (or `-1` when the search runs past the end).

## Complexity Analysis

- **Time Complexity:** O(n log n), dominated by sorting plus one binary search per interval.
- **Space Complexity:** O(n) for the ordering and answer arrays.

## Implementation

```python
from bisect import bisect_left
class Solution:
    def findRightInterval(self, intervals):
        n = len(intervals)
        order = sorted(range(n), key=lambda i: intervals[i][0])
        starts = [intervals[i][0] for i in order]
        ans = []
        for s, e in intervals:
            pos = bisect_left(starts, e)
            ans.append(order[pos] if pos < n else -1)
        return ans
```
