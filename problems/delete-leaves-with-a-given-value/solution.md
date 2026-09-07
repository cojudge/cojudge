## Approach

Post-order DFS: clean children first, then if the current node is a leaf equal to `target`, delete it by returning null.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation

```python
class Solution:
    def removeLeafNodes(self, root, target: int):
        if not root:
            return None
        root.left = self.removeLeafNodes(root.left, target)
        root.right = self.removeLeafNodes(root.right, target)
        if not root.left and not root.right and root.val == target:
            return None
        return root
```
