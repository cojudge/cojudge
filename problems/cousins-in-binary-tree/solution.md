## Approach

Do one depth-first walk carrying each node's parent and depth. When the walk
reaches the node holding `x`, record its depth and parent; do the same for
`y`. The two nodes are cousins exactly when both were found, their depths
match, and their parents differ (reference comparison also rules out the
shared-parent sibling case).

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def isCousins(self, root, x: int, y: int) -> bool:
        found = {}

        def walk(node, parent, depth):
            if node is None:
                return
            if node.val == x or node.val == y:
                found[node.val] = (depth, parent)
            walk(node.left, node, depth + 1)
            walk(node.right, node, depth + 1)

        walk(root, None, 0)
        if x not in found or y not in found:
            return False
        return found[x][0] == found[y][0] and found[x][1] is not found[y][1]
```
