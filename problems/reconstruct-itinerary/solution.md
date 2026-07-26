## Approach

View tickets as directed edges and the itinerary as an Eulerian trail beginning at `JFK`. Sort each departure's destinations in reverse lexical order so the smallest remaining destination can be removed from the end. Hierholzer's algorithm appends an airport only after consuming all of its outgoing tickets, then reverses that postorder route.

## Complexity Analysis

- **Time Complexity:** O(E log E) in the worst case for sorting destinations, followed by O(E) traversal.
- **Space Complexity:** O(E) for the adjacency lists, recursion stack, and route.

## Implementation

```python
from collections import defaultdict
from typing import List


class Solution:
    def findItinerary(self, from_: List[str], to: List[str]) -> List[str]:
        graph = defaultdict(list)
        for origin, destination in zip(from_, to):
            graph[origin].append(destination)
        for destinations in graph.values():
            destinations.sort(reverse=True)

        route = []

        def visit(airport: str) -> None:
            while graph[airport]:
                visit(graph[airport].pop())
            route.append(airport)

        visit("JFK")
        return route[::-1]
```
