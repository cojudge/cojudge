## Approach

Sort intervals by end time and greedily select the interval that finishes earliest. Whenever a new interval starts before the last selected interval ends, count it as an overlap to remove.

## Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        cnt = 0
        end = float('-inf')
        for s, e in intervals:
            if s < end:
                cnt += 1
            else:
                end = e
        return cnt
```
