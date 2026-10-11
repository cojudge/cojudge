## Approach

First walk the tree to remember each node's parent, turning it into a graph that can be climbed upward. Locate the node whose value equals the target. Then run a breadth-first search from there across child and parent edges, level by level, until depth `k` is reached. Sorting the collected values gives a stable order.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited a constant number of times.
- **Space Complexity:** O(n) for the parent map and search queue.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def distanceK(self, root, target: int, k: int) -> List[int]:
        pmap = {}
        tgt = None
        stack = [(root, None)]
        while stack:
            n, p = stack.pop()
            if not n:
                continue
            pmap[id(n)] = p
            if n.val == target:
                tgt = n
            stack.append((n.left, n))
            stack.append((n.right, n))
        if tgt is None:
            return []
        q = deque([tgt])
        seen = {id(tgt)}
        d = 0
        while q:
            if d == k:
                return sorted([n.val for n in q])
            for _ in range(len(q)):
                cur = q.popleft()
                for nb in (cur.left, cur.right, pmap.get(id(cur))):
                    if nb is not None and id(nb) not in seen:
                        seen.add(id(nb))
                        q.append(nb)
            d += 1
        return []
```
