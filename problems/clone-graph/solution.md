## Approach

BFS traversal using a hashmap from original to cloned nodes to avoid cycles and ensure each node is cloned exactly once.

## Complexity Analysis

- **Time Complexity:** O(V+E)
- **Space Complexity:** O(V)

## Implementation

```python
from typing import Optional
from collections import deque
class Solution:
    def cloneGraph(self, node: Optional['GraphNode']) -> Optional['GraphNode']:
        if not node:
            return None
        m = {}
        q = deque([node])
        m[node] = GraphNode(node.val)
        while q:
            cur = q.popleft()
            for nb in cur.neighbors:
                if nb not in m:
                    m[nb] = GraphNode(nb.val)
                    q.append(nb)
                m[cur].neighbors.append(m[nb])
        return m[node]
```
