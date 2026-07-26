## Approach

Perform an iterative depth-first traversal while carrying the maximum value seen on each root-to-node path. A node is good when its value is at least that maximum. Push each child together with the updated maximum.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(h), where `h` is the tree height, for the DFS stack.

## Implementation

```python
class Solution:
    def goodNodes(self, root) -> int:
        if root is None:
            return 0

        stack = [(root, root.val)]
        count = 0
        while stack:
            node, path_maximum = stack.pop()
            if node.val >= path_maximum:
                count += 1
            next_maximum = max(path_maximum, node.val)
            if node.left is not None:
                stack.append((node.left, next_maximum))
            if node.right is not None:
                stack.append((node.right, next_maximum))
        return count
```
