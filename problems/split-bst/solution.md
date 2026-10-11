## Approach

Split the search tree with recursion that respects the target bound. An empty tree yields two empties; when the root fits the small side, split its right child and graft the small half back as the new right child; otherwise split the left child and graft the large half back as the new left child. Both halves are then encoded with level-order serialization, trimming trailing nulls, so the answer is the pair of BFS strings.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the node count, visiting each node once plus serialization.
- **Space Complexity:** O(h) recursion depth for height h, plus O(n) for the queues and strings.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def splitBST(self, root, target: int) -> List[str]:
        def split(node):
            if not node:
                return (None, None)
            if node.val <= target:
                small_r, large = split(node.right)
                node.right = small_r
                return (node, large)
            else:
                small, large_l = split(node.left)
                node.left = large_l
                return (small, node)
        def serialize(node):
            if not node:
                return "[]"
            out = []
            q = deque([node])
            while q:
                cur = q.popleft()
                if cur is None:
                    out.append("null")
                else:
                    out.append(str(cur.val))
                    q.append(cur.left)
                    q.append(cur.right)
            while out and out[-1] == "null":
                out.pop()
            return "[" + ",".join(out) + "]"
        small, large = split(root)
        return [serialize(small), serialize(large)]
```
