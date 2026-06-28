## Approach

Linear scan through the sorted intervals: add all intervals ending before the new interval starts, merge overlapping intervals by extending the new interval bounds, then append the merged interval and remaining intervals.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of intervals.
- **Space Complexity:** O(n) for the output list.

## Implementation

```python
from typing import List
class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []
        i, n = 0, len(intervals)
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        res.append(newInterval)
        while i < n:
            res.append(intervals[i])
            i += 1
        return res
```
