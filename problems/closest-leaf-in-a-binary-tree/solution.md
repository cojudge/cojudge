## Approach

Record each node's parent with one depth-first walk while locating the node that holds `k`. Then run a breadth-first search starting from that target, stepping to parents and children alike. The first node dequeued without children is the nearest leaf, because BFS expands in order of edge distance.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited a constant number of times.
- **Space Complexity:** O(n) for the parent table and the BFS queue.

## Implementation

```python
from collections import deque
class Solution:
    def findClosestLeaf(self, root, k: int) -> int:
        parent = {}
        target = None
        stack = [(root, None)]
        while stack:
            node, par = stack.pop()
            if node is None:
                continue
            parent[id(node)] = par
            if node.val == k:
                target = node
            stack.append((node.left, node))
            stack.append((node.right, node))
        q = deque([target])
        seen = {id(target)}
        while q:
            cur = q.popleft()
            if cur.left is None and cur.right is None:
                return cur.val
            for nb in (parent.get(id(cur)), cur.left, cur.right):
                if nb is not None and id(nb) not in seen:
                    seen.add(id(nb))
                    q.append(nb)
        return -1
```
