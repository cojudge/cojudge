## Approach

Map each stop to the buses that visit it. Then breadth-first search outward from the source stop, expanding stop by stop but marking whole buses as visited the first time any of their stops is reached. The search proceeds in layers where each layer corresponds to boarding one more bus; reaching the target stop inside a newly boarded bus yields its depth. If the queue empties, the target is unreachable.

## Complexity Analysis

- **Time Complexity:** O(total stops across all routes).
- **Space Complexity:** O(total stops) for the index, queue, and visited sets.

## Implementation

```python
from typing import List
from collections import defaultdict, deque
class Solution:
    def numBusesToDestination(self, routes: List[List[int]], source: int, target: int) -> int:
        if source == target:
            return 0
        stop_to_buses = defaultdict(list)
        for b, stops in enumerate(routes):
            for s in stops:
                stop_to_buses[s].append(b)
        if source not in stop_to_buses or target not in stop_to_buses:
            return -1
        q = deque([source])
        seen_stop = {source}
        seen_bus = [False] * len(routes)
        buses = 0
        while q:
            buses += 1
            for _ in range(len(q)):
                stop = q.popleft()
                for b in stop_to_buses.get(stop, []):
                    if seen_bus[b]:
                        continue
                    seen_bus[b] = True
                    for ns in routes[b]:
                        if ns == target:
                            return buses
                        if ns not in seen_stop:
                            seen_stop.add(ns)
                            q.append(ns)
        return -1
```
