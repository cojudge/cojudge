## Approach

A graph is a valid tree if and only if it has exactly `n - 1` edges and is fully connected. If the number of edges is not `n - 1`, we immediately return `False`. Otherwise, we perform a Depth-First Search (DFS) starting from node 0 to check if we can reach all nodes. If the traversal visits all `n` nodes, then the graph is a valid tree.

## Complexity Analysis

- **Time Complexity:** O(n) to build the adjacency list and perform DFS.
- **Space Complexity:** O(n) for the adjacency list and the recursion stack.

## Implementation

```python
from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        
        # Build adjacency list
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        
        visited = [False] * n
        
        # DFS to traverse and check connectivity
        def dfs(node: int):
            visited[node] = True
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    dfs(neighbor)
        
        dfs(0)
        return all(visited)
```
