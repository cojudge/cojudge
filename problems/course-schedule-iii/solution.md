## Approach

Sort by deadline, then greedily accept each course while tracking total study time. Store accepted durations in a max-heap; whenever the running total overshoots the current deadline, evict the longest accepted course (the cheapest way to recover feasibility). Courses surviving this filter form the largest feasible set.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting plus heap updates.
- **Space Complexity:** O(n) for the heap in the worst case.

## Implementation

```python
from typing import List
import heapq
class Solution:
    def scheduleCourse(self, courses: List[List[int]]) -> int:
        courses.sort(key=lambda c: c[1])
        bpm = []
        time = 0
        for d, last in courses:
            time += d
            heapq.heappush(bpm, -d)
            if time > last:
                time += heapq.heappop(bpm)
        return len(bpm)
```
