## Approach
Sort intervals by start time, then iterate through them. If the result list is empty or the current interval does not overlap with the last merged interval, append it. Otherwise, merge by extending the end of the last interval.

## Complexity Analysis
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

## Implementation
```python
from typing import List
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        res = []
        for iv in intervals:
            if not res or res[-1][1] < iv[0]:
                res.append(iv)
            else:
                res[-1][1] = max(res[-1][1], iv[1])
        return res
```
