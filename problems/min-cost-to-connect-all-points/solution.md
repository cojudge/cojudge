## Approach

The points form a complete weighted graph whose edge costs are Manhattan distances. Use Prim's algorithm without materializing all edges: `best[i]` stores the cheapest known connection from the current tree to point `i`. Repeatedly add the unvisited point with minimum connection cost and update every remaining point.

## Complexity Analysis

- **Time Complexity:** O(N^2), where N is the number of points.
- **Space Complexity:** O(N) auxiliary space.

## Implementation

```python
from typing import List


class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        best = [float("inf")] * n
        in_tree = [False] * n
        best[0] = 0
        total = 0

        for _ in range(n):
            next_point = -1
            for i in range(n):
                if not in_tree[i] and (next_point == -1 or best[i] < best[next_point]):
                    next_point = i

            in_tree[next_point] = True
            total += best[next_point]
            for i in range(n):
                if not in_tree[i]:
                    distance = abs(points[next_point][0] - points[i][0]) + abs(
                        points[next_point][1] - points[i][1]
                    )
                    best[i] = min(best[i], distance)

        return total
```
