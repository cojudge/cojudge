## Approach

Recurse on the tree. An empty spot stays empty. If the current value is below `low`, the entire left subtree is also too small, so return the trimmed right child. Symmetrically, if it is above `high`, return the trimmed left child. Otherwise the node survives: trim both children and reattach them.

## Complexity Analysis

- **Time Complexity:** O(n), each node is visited once.
- **Space Complexity:** O(h) recursion depth, where h is the tree height.

## Implementation

```python
class Solution:
    def trimBST(self, root, low: int, high: int):
        if not root:
            return None
        if root.val < low:
            return self.trimBST(root.right, low, high)
        if root.val > high:
            return self.trimBST(root.left, low, high)
        root.left = self.trimBST(root.left, low, high)
        root.right = self.trimBST(root.right, low, high)
        return root
```
