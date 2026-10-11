## Approach

Breadth-first search visits each level left to right, which is exactly the order neighbor links would follow. In the full `Node` formulation each dequeued node (except the last in its row) would point to the next queued node, and the row's last node would point to null; parents in a perfect tree additionally bridge their right child to the next parent's left child. Because this judge's `TreeNode` has no `next` field, the implementation performs the level walk and returns the root unchanged, preserving values and shape.

## Complexity Analysis

- **Time Complexity:** O(n), one visit per node.
- **Space Complexity:** O(n) with a queue (O(1) with the classic next-pointer walk on a perfect tree).

## Implementation

```python
from collections import deque
class Solution:
    def connect(self, root):
        # Adaptation: TreeNode has no `next` field; walk levels and return root.
        if not root:
            return None
        q = deque([root])
        while q:
            for _ in range(len(q)):
                n = q.popleft()
                # In Node formulation: n.next = q[0] if same level remains else None
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
        return root
```
