## Approach

Walk the starting tree in level order and collect every node missing a child; the first of these is always the next insertion parent for a complete tree. Each insert attaches left first, retires the parent once it has both children, and enqueues the newcomer as a future parent. Recording parent values (and the root value on demand) replays the trace exactly.

## Complexity Analysis

- **Time Complexity:** O(n + m) for the initial walk over n nodes plus O(1) per traced operation.
- **Space Complexity:** O(n) for the candidate queue and the walk.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def runCbtInserter(self, root, operations: List[str], values: List[int]) -> List[int]:
        cand = deque()
        bfs = deque([root])
        while bfs:
            node = bfs.popleft()
            if node.left is None or node.right is None:
                cand.append(node)
            if node.left is not None:
                bfs.append(node.left)
            if node.right is not None:
                bfs.append(node.right)
        ans = []
        for op, v in zip(operations, values):
            if op == "insert":
                parent = cand[0]
                node = TreeNode(v)
                if parent.left is None:
                    parent.left = node
                else:
                    parent.right = node
                    cand.popleft()
                cand.append(node)
                ans.append(parent.val)
            else:
                ans.append(root.val)
        return ans
```
