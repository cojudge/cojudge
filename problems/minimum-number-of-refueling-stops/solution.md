## Approach

Drive with current fuel while collecting every passed station's offer in a max-heap. When the destination is still beyond reach, redeem the largest collected offer; that greedy replacement is always safe because any solution must use some past station to get this far, and the largest one dominates. Count redemptions until the reach covers the target or the heap empties.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the station count, for heap operations.
- **Space Complexity:** O(n) for the heap.

## Implementation

```python
import heapq
from typing import List

class Solution:
    def minRefuelStops(self, target: int, startFuel: int, stations: List[List[int]]) -> int:
        heap = []
        stops = 0
        i = 0
        fuel = startFuel
        n = len(stations)
        while fuel < target:
            while i < n and stations[i][0] <= fuel:
                heapq.heappush(heap, -stations[i][1])
                i += 1
            if not heap:
                return -1
            fuel += -heapq.heappop(heap)
            stops += 1
        return stops
```
