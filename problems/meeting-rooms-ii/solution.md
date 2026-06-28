## Approach
Sweep line algorithm: sort start and end times separately, then advance through them with two pointers. Each start increments the concurrent meeting count, each end decrements it. Track the maximum count.

## Complexity Analysis
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

## Implementation
```python
from typing import List
class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        starts = sorted(i[0] for i in intervals)
        ends = sorted(i[1] for i in intervals)
        s = e = 0
        cnt = 0
        res = 0
        while s < len(starts):
            if starts[s] < ends[e]:
                cnt += 1
                s += 1
            else:
                cnt -= 1
                e += 1
            res = max(res, cnt)
        return res
```
