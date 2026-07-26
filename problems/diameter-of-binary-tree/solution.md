## Approach

Compute node heights in postorder without recursion. First collect nodes with an explicit stack, then process that order backward so both child heights are known. The longest path through a node is its left height plus its right height; track the largest such value.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for the traversal order and height table.

## Implementation

```python
class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        if root is None:
            return 0

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
        diameter = 0
        for node in reversed(order):
            left = heights.get(node.left, 0)
            right = heights.get(node.right, 0)
            diameter = max(diameter, left + right)
            heights[node] = 1 + max(left, right)
        return diameter
```
