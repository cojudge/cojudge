## Approach

At most `k` intermediate stops means at most `k + 1` flight edges. Perform `k + 1` Bellman-Ford rounds, cloning the previous costs before each round so every update uses one additional edge at most. The destination remains unreachable if its cost is still infinity after the final round.

## Complexity Analysis

- **Time Complexity:** O((k + 1) * E), where E is the number of flights.
- **Space Complexity:** O(V) for the current and next cost arrays.

## Implementation

```python
from typing import List


class Solution:
    def findCheapestPrice(
        self, n: int, flights: List[List[int]], src: int, dst: int, k: int
    ) -> int:
        infinity = float("inf")
        cost = [infinity] * n
        cost[src] = 0

        for _ in range(k + 1):
            next_cost = cost.copy()
            for source, target, price in flights:
                if cost[source] != infinity:
                    next_cost[target] = min(next_cost[target], cost[source] + price)
            cost = next_cost

        return -1 if cost[dst] == infinity else cost[dst]
```
