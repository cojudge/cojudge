## Approach

Remember the root's value, then visit every node (depth-first with an explicit stack) and compare. The first mismatch disqualifies the tree; surviving the whole walk proves uniformity. Empty trees pass at once.

## Complexity Analysis

- **Time Complexity:** O(n) for n nodes.
- **Space Complexity:** O(h) stack space for height h.

## Implementation

```python
class Solution:
    def isUnivalTree(self, root) -> bool:
        if root is None:
            return True
        stack = [root]
        while stack:
            cur = stack.pop()
            if cur.val != root.val:
                return False
            if cur.left is not None:
                stack.append(cur.left)
            if cur.right is not None:
                stack.append(cur.right)
        return True
```
