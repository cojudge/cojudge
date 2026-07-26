## Approach

Use iterative postorder so child heights are available before their parent is checked. If any node's child heights differ by more than one, return `False`; otherwise store its height and continue. This avoids recursion-depth limits on tall valid inputs.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for the traversal order and height table.

## Implementation

```python
class Solution:
    def isBalanced(self, root) -> bool:
        if root is None:
            return True

        order = []
        stack = [root]
        while stack:
            node = stack.pop()
            order.append(node)
            if node.left is not None:
                stack.append(node.left)
            if node.right is not None:
                stack.append(node.right)

        heights = {}
        for node in reversed(order):
            left = heights.get(node.left, 0)
            right = heights.get(node.right, 0)
            if abs(left - right) > 1:
                return False
            heights[node] = 1 + max(left, right)
        return True
```
