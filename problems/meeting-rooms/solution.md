## Approach
Sort intervals by start time, then iterate through them checking if any meeting overlaps with the previous one (i.e., the current start is before the previous end). If any overlap is found, return `false`.

## Complexity Analysis
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(1)

## Implementation
```python
from typing import List
class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        intervals.sort(key=lambda x: x[0])
        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i - 1][1]:
                return False
        return True
```
