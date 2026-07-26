## Approach

The time at which a node receives the signal is its shortest-path distance from `k`. Because every edge weight is positive, run Dijkstra's algorithm with a min-heap and ignore stale heap entries. If every node is reached, the largest shortest distance is the network delay.

## Complexity Analysis

- **Time Complexity:** O((V + E) log V) with a binary heap.
- **Space Complexity:** O(V + E) for the graph, distances, and heap.

## Implementation

```python
import heapq
from typing import List


class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        graph = [[] for _ in range(n + 1)]
        for source, target, weight in times:
            graph[source].append((target, weight))

        distance = [float("inf")] * (n + 1)
        distance[k] = 0
        queue = [(0, k)]

        while queue:
            elapsed, node = heapq.heappop(queue)
            if elapsed != distance[node]:
                continue
            for target, weight in graph[node]:
                next_distance = elapsed + weight
                if next_distance < distance[target]:
                    distance[target] = next_distance
                    heapq.heappush(queue, (next_distance, target))

        answer = max(distance[1:])
        return -1 if answer == float("inf") else answer
```
