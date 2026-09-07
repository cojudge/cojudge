## Approach

Sort meetings by start. Maintain free rooms (min-heap by id) and busy rooms (min-heap by end time). Assign the lowest free room, or delay until the earliest busy room frees.

## Complexity Analysis

- **Time Complexity:** O(m log m + m log n)
- **Space Complexity:** O(n)

## Implementation

```python
import heapq
from typing import List
class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        meetings = sorted(meetings)
        free = list(range(n))
        heapq.heapify(free)
        busy = []  # (end, room)
        count = [0] * n
        for start, end in meetings:
            while busy and busy[0][0] <= start:
                _, r = heapq.heappop(busy)
                heapq.heappush(free, r)
            dur = end - start
            if free:
                r = heapq.heappop(free)
                heapq.heappush(busy, (start + dur, r))
            else:
                t, r = heapq.heappop(busy)
                heapq.heappush(busy, (t + dur, r))
            count[r] += 1
        return max(range(n), key=lambda i: (count[i], -i))
```
