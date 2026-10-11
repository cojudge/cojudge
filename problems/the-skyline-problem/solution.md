## Approach

Convert each building into an opening event (negative height, so openings sort first) and a closing event, then sweep x in order. Maintain the active heights in a max-heap with lazy deletion: push every opened height, count every closed one, and discard heap tops that have been fully closed. After applying every event at one x, the heap top is the visible height; whenever it differs from the previous height, record `[x, height]` as a key point.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting 2n events and heap updates.
- **Space Complexity:** O(n) for the events and the heap.

## Implementation

```python
import heapq
from collections import Counter
from typing import List

class Solution:
    def getSkyline(self, buildings: List[List[int]]) -> List[List[int]]:
        events = []
        for l, r, h in buildings:
            events.append((l, -h))
            events.append((r, h))
        events.sort(key=lambda e: (e[0], e[1]))
        live = Counter()
        heap = [0]
        res: List[List[int]] = []
        prev = 0
        i = 0
        while i < len(events):
            x = events[i][0]
            while i < len(events) and events[i][0] == x:
                h = events[i][1]
                if h < 0:
                    heapq.heappush(heap, h)
                else:
                    live[h] += 1
                i += 1
            while heap and live[-heap[0]] > 0:
                live[-heap[0]] -= 1
                heapq.heappop(heap)
            cur = -heap[0]
            if cur != prev:
                res.append([x, cur])
                prev = cur
        return res
```
