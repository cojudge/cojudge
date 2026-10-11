## Approach

Model each subdivided link as a weighted edge of cost `cnt + 1` and run Dijkstra from node 0 to learn the cheapest arrival distance for every original node. Original nodes whose distance fits inside `maxMoves` are directly counted. For each link, the unused moves remaining at its two endpoints (`maxMoves - dist`) can sweep inward over middle nodes from both sides, covering up to `min(cnt, leftoverU + leftoverV)` of them.

## Complexity Analysis

- **Time Complexity:** O(E log n), where E is the number of links, for Dijkstra plus a linear pass over the links.
- **Space Complexity:** O(n + E) for the adjacency lists and distance array.

## Implementation

```python
import heapq
from typing import List

class Solution:
    def reachableNodes(self, edges: List[List[int]], maxMoves: int, n: int) -> int:
        g = [[] for _ in range(n)]
        for u, v, c in edges:
            g[u].append((v, c + 1))
            g[v].append((u, c + 1))
        INF = float("inf")
        dist = [INF] * n
        dist[0] = 0
        pq = [(0, 0)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            for v, w in g[u]:
                if dist[v] > d + w:
                    dist[v] = d + w
                    heapq.heappush(pq, (dist[v], v))
        ans = sum(1 for d in dist if d <= maxMoves)
        for u, v, c in edges:
            left_u = 0 if dist[u] > maxMoves else maxMoves - dist[u]
            left_v = 0 if dist[v] > maxMoves else maxMoves - dist[v]
            ans += min(c, left_u + left_v)
        return ans
```
